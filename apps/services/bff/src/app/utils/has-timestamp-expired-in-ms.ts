/**
 * Check if a Unix timestamp (in milliseconds) has expired
 */
export const hasTimestampExpiredInMS = (unixTimestampMs: number): boolean => {
  return unixTimestampMs < Date.now()
}
