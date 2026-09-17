/* The inverse of `percentToRskRatio`: RSK answers with the same `tala milli 0
 * og 1` it accepts, while everything above this client reads `percentage` as a
 * whole 0-100 figure. The scale is declared by the contract, not discovered
 * from what RSK happens to send, so every percentage output passes through
 * here.
 *
 * Rounded because the multiplication is not exact in binary: `0.07 * 100` is
 * `7.000000000000001` and `0.29 * 100` is `28.999999999999996`, either of which
 * would reach the page verbatim. Six decimal places of percent is far beyond
 * any rate RSK publishes and cannot round a real value away. */
export const rskRatioToPercent = (
  value: number | null | undefined,
): number | undefined =>
  value === null || value === undefined
    ? undefined
    : Number((value * 100).toFixed(6))
