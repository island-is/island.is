export const rskRatioToPercent = (
  value: number | null | undefined,
): number | undefined =>
  value === null || value === undefined
    ? undefined
    : Number((value * 100).toFixed(6))
