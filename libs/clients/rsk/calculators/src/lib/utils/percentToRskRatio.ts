/* RSK documents its ratio parameters as `gefið sem tala milli 0 og 1`, while the
 * public boundary above this client carries whole percent -- 37 rather than
 * 0.37 -- because a form asking for `0.37` beside a `%` sign reads worse. The
 * two meet here.
 *
 * `=== undefined` rather than `== null` because the input is caller-authored:
 * `WithholdingTaxInput` types these fields as `?: number`, so `null` cannot
 * reach this. The guard exists for the absent case alone, which must stay
 * absent -- `undefined / 100` is `NaN`, and the query mapper's contract is that
 * an unset input emits an unset RSK parameter. */
export const percentToRskRatio = (
  value: number | undefined,
): number | undefined => (value === undefined ? undefined : value / 100)
