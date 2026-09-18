/* Generated `TaxBracket` fields are `bigint`, unlike every other numeric result.
 * `== null` rather than a truthiness check because `0n` is legitimate. */
export const toNumber = (
  value: bigint | number | null | undefined,
): number | undefined => (value == null ? undefined : Number(value))
