import type { BoxProps } from '@island.is/island-ui/core/types'

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

type SdfBoxMargin = BoxProps['marginBottom']

/**
 * Resolves the outer `<Box>` margins for an SDF field. Every field forwards its
 * (optional) `marginTop` / `marginBottom` to its outermost component so a
 * template can override the vertical spacing per field. When a value is unset,
 * `marginBottom` falls back to the shared `SDF_FIELD_BLOCK_MARGIN_BOTTOM`
 * default and `marginTop` to none, keeping a single consistent rhythm across
 * stacked fields. Spread the result onto the field's outer `<Box>`:
 * `<Box {...getSdfFieldMargins(component)} ...>`.
 */
export const getSdfFieldMargins = (component: {
  marginTop?: number
  marginBottom?: number
}): { marginTop: SdfBoxMargin; marginBottom: SdfBoxMargin } => ({
  marginTop: component.marginTop as SdfBoxMargin,
  marginBottom: (component.marginBottom ??
    SDF_FIELD_BLOCK_MARGIN_BOTTOM) as SdfBoxMargin,
})
