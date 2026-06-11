/**
 * Spacing tokens for SDF field blocks vs legacy `libs/application/ui-fields`
 * (`TextFormField`, `SelectFormField`, `FormMultiField`, etc.).
 *
 * **SDF_FIELD_CONTROL_PADDING_TOP** — Matches the inner `<Box paddingTop={2}>`
 * that wraps `InputController` / `SelectController` / etc. after optional
 * `FieldDescription` in legacy form fields.
 *
 * **SDF_FIELD_BLOCK_MARGIN_BOTTOM** — Legacy `TextFormField` outer `Box` only
 * applies bottom margin when the field defines `marginBottom`; default is no
 * extra gap between stacked fields. `0` matches that default. Increase here
 * only if SDF screens need looser vertical rhythm than legacy defaults.
 */
export const SDF_FIELD_CONTROL_PADDING_TOP = 2

export const SDF_FIELD_BLOCK_MARGIN_BOTTOM = 0
