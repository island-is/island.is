export const calculatePruneAt = (daysUntilApplicationPrune: number): Date => {
  return new Date(Date.now() + daysUntilApplicationPrune * 24 * 60 * 60 * 1000)
}
