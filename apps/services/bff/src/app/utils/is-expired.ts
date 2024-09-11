/**
 * Check if unix timestamp is expired
 */
export const isExpired = (unixTimestamp: number) => {
  return unixTimestamp < Date.now() / 1000
}
