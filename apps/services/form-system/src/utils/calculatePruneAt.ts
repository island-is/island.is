export const calculatePruneAt = (daysUntilApplicationPrune: number): Date => {
  const days =
    typeof daysUntilApplicationPrune === 'number' &&
    Number.isFinite(daysUntilApplicationPrune) &&
    daysUntilApplicationPrune >= 1
      ? daysUntilApplicationPrune
      : 30
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}
