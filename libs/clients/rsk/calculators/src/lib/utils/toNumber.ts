export const toNumber = (
  value: bigint | number | null | undefined,
): number | undefined => (value == null ? undefined : Number(value))
