export const calculatePruneAt = (daysToLive: number): Date => {
  const days =
    typeof daysToLive === 'number' &&
    Number.isFinite(daysToLive) &&
    daysToLive >= 1
      ? daysToLive
      : 30
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}
