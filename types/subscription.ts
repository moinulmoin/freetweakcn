export interface SubscriptionCheck extends SubscriptionStatus {
  canProceed: boolean;
  error?: string;
}

export interface SubscriptionStatus {
  requestsUsed: number;
  requestsRemaining: number;
}
