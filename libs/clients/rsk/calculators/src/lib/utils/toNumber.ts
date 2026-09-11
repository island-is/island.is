/* Generated `TaxBracket` fields are `bigint` while every other numeric value in
 * the six results is a `number`. `== null` rather than a truthiness check
 * because `0n` is a legitimate bracket value. */
export const toNumber = (
  value: bigint | number | null | undefined,
): number | undefined => (value == null ? undefined : Number(value))
