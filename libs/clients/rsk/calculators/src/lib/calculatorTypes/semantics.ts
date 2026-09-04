import { z } from 'zod'

/* What a numeric input *means*, beyond being a number.
 *
 * RSK's OpenAPI spec types every numeric parameter as either `integer int32`
 * or `number double` and declares no bounds anywhere -- no `minimum`,
 * `maximum`, `pattern` or `multipleOf` on any parameter. So a field's
 * semantic cannot be derived from the spec: it is authored here, one builder
 * per field, and read back off the zod type by `propFromZodType`.
 *
 * The builders exist so the semantic and its validation are declared in one
 * place and cannot drift apart, and so the marker string is never hand-typed
 * at a call site.
 *
 * They own zod's `description` outright. It is a single-valued channel, so a
 * field cannot carry both a marker and a human-readable note -- calling
 * `.describe()` again overwrites the marker and drops the field back to
 * `number`. Anything else worth saying about a field goes in a comment. */
const NUMERIC_SEMANTICS = [
  'currency',
  'percentage',
  'year',
  'month',
  'count',
] as const

/* Derived from the array rather than declared alongside it. Two independent
 * declarations would let a sixth semantic be added to one and forgotten in the
 * other, which compiles cleanly and silently degrades that field to `number`
 * -- a wrong control, not an error. */
export type NumericSemantic = typeof NUMERIC_SEMANTICS[number]

export const isNumericSemantic = (
  value: string | undefined,
): value is NumericSemantic =>
  NUMERIC_SEMANTICS.some((semantic) => semantic === value)

/* Amounts in krónur. `.int()` is not a guess -- every money parameter is
 * `integer int32` in the spec, so this regenerates rather than drifts. No
 * lower bound: negative deductions and adjustments are plausible and nothing
 * says otherwise. */
export const currency = () => z.number().int().describe('currency')

/* A ratio given as a number between 0 and 1. The five ratio fields are the
 * only `number double` parameters in the spec; everything else is
 * `integer int32`.
 *
 * The 0-1 rule is documented in `clientConfig.json` -- every one of these
 * parameters carries "gefið sem tala milli 0 og 1" in its description -- but
 * it is prose, not a machine-declared `minimum`/`maximum`, so it does not
 * regenerate. Note nothing currently calls `.parse()` on these schemas: the
 * bound documents the contract for the renderer today, and becomes real
 * enforcement the day an input is parsed. That is the point of keeping it,
 * because a `25` meant as 25% is the one error RSK has no declared bound to
 * reject. */
export const percentage = () => z.number().min(0).max(1).describe('percentage')

export const year = () => z.number().int().describe('year')

/* Deliberately unbounded. Whether RSK counts months from 0 or from 1 is
 * stated nowhere -- not in the spec, not in the field docs -- so a 1-12 range
 * here would be invented, and would reject a valid month if the convention
 * turns out to be 0-based. */
export const month = () => z.number().int().describe('month')

/* `.min(0)` is definitional rather than a mirror of RSK's rules, and likewise
 * not spec-derived: a count of children is non-negative because of what a
 * count is. */
export const count = () => z.number().int().min(0).describe('count')
