/** Thrown from Firestore when payment > product.remainingBalance (must match UI copy). */
export const PAYMENT_EXCEEDS_BALANCE_MESSAGE = 'Payment exceeds remaining balance';

export function isPaymentExceedsBalanceError(message: string): boolean {
  return message === PAYMENT_EXCEEDS_BALANCE_MESSAGE;
}
