import { env } from "~/env.mjs";

export function isUserActive(status: string, paymentStatus: string): boolean {
  // The user is active if their status is 'active' and their paymentStatus is 'paid'
  return status === "active" && paymentStatus === "paid";
}

export function getPlanName(priceId: string) {
  switch (priceId) {
    case env.STARTER_MONTHLY_PRICE_ID:
      return "Starter Monthly";
    case env.GROWTH_MONTHLY_PRICE_ID:
      return "Growth Monthly";
    case env.DOUBLE_GROWTH_MONTHLY_PRICE_ID:
      return "Double Growth Monthly";
    case env.STARTER_YEARLY_PRICE_ID:
      return "Starter Yearly";
    case env.GROWTH_YEARLY_PRICE_ID:
      return "Growth Yearly";
    case env.DOUBLE_GROWTH_YEARLY_PRICE_ID:
      return "Double Growth Yearly";
  }
}

export function getPlanCredits(priceId: string) {
  switch (priceId) {
    case env.STARTER_MONTHLY_PRICE_ID:
    case env.STARTER_YEARLY_PRICE_ID:
      return 16;
    case env.GROWTH_MONTHLY_PRICE_ID:
    case env.GROWTH_YEARLY_PRICE_ID:
      return 31;
    case env.DOUBLE_GROWTH_MONTHLY_PRICE_ID:
    case env.DOUBLE_GROWTH_YEARLY_PRICE_ID:
      return 62;
    default:
      return 0;
  }
}
