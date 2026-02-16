import { getCurrentUserId, logError } from "@/lib/shared";
import { validateSubscriptionAndUsage } from "@/lib/subscription";
import { SubscriptionStatus } from "@/types/subscription";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId(request);
    const { requestsRemaining, requestsUsed } =
      await validateSubscriptionAndUsage(userId);
    const response: SubscriptionStatus = {
      requestsRemaining,
      requestsUsed,
    };

    return NextResponse.json(response);
  } catch (error) {
    logError(error as Error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
