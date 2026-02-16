"use server";

import { getMyDailyRequestCount } from "@/actions/ai-usage";
import { SubscriptionRequiredError } from "@/types/errors";
import { SubscriptionCheck } from "@/types/subscription";
import { NextRequest } from "next/server";
import { AI_REQUEST_FREE_TIER_LIMIT } from "./constants";
import { getCurrentUserId } from "./shared";

export async function validateSubscriptionAndUsage(userId: string): Promise<SubscriptionCheck> {
  try {
    const requestsUsedToday = await getMyDailyRequestCount(userId);

    const requestsRemaining = Math.max(0, AI_REQUEST_FREE_TIER_LIMIT - requestsUsedToday);
    const canProceed = requestsUsedToday < AI_REQUEST_FREE_TIER_LIMIT;

    if (!canProceed) {
      return {
        canProceed: false,
        requestsUsed: requestsUsedToday,
        requestsRemaining: 0,
        error: `You've reached your daily free limit of ${AI_REQUEST_FREE_TIER_LIMIT} requests. Come back tomorrow!`,
      };
    }

    return {
      canProceed: true,
      requestsUsed: requestsUsedToday,
      requestsRemaining,
    };
  } catch (error) {
    console.error("Error validating subscription:", error);
    throw error;
  }
}

export async function requireSubscriptionOrFreeUsage(req: NextRequest): Promise<void> {
  const userId = await getCurrentUserId(req);
  const validation = await validateSubscriptionAndUsage(userId);

  if (!validation.canProceed) {
    throw new SubscriptionRequiredError(validation.error, {
      requestsRemaining: validation.requestsRemaining,
    });
  }
}
