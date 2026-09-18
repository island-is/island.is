import {
  Box,
  GridRow,
  Stack,
  Text,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import type { Locale } from '@island.is/shared/types'
import type { CalculatorInputSection } from '@island.is/tax-calculators'

import type { ApplicableFields } from './applicability'
import { CalculatorField } from './CalculatorField'
import { localized } from './text'

interface Props {
  section: CalculatorInputSection
  /* Computed once, above the whole form. A section renders exactly the fields
   * that would be submitted -- so nothing can render enabled and then be left
   * out of the request. */
  applicable: ApplicableFields
  locale: Locale
  toggles: Record<string, boolean>
  errors: Map<string, string>
  onToggle: (key: string, checked: boolean) => void
}

export const CalculatorSection = ({
  section,
  applicable,
  locale,
  toggles,
  errors,
  onToggle,
}: Props) => {
  /* An unmet gate removes the section outright, unless the editor asked for it
   * to stay visible with its controls dead. In that case the fields render but
   * are not applicable, which is why the two are asked separately. */
  const isGateOpen = section.gate ? toggles[section.gate.toggle] : true
  if (!isGateOpen && !section.gate?.disableOnly) return null

  const isOwnToggleOn = section.toggle ? toggles[section.toggle.key] : true

  const title = localized(section.title, locale)
  const description = localized(section.description, locale)

  /* Resolved before rendering so that a section whose fields are ALL omitted
   * can be dropped whole, rather than leaving a heading standing over an empty
   * row. A field in a shut `disableOnly` section is in this set too, carrying
   * `disabled` -- it renders, it just does not submit. */
  const fields = section.fields.flatMap((field) => {
    const entry = applicable.get(field.key)
    return entry ? [entry] : []
  })

  /* A section the editor authored with no fields at all is text-only and stands
   * on its own; one whose every field was omitted is not.
   *
   * Only while the body is actually shown, though: a section whose own toggle
   * is off has no applicable fields by definition, and dropping it here would
   * take the toggle that turns it back on with it. */
  if (section.fields.length > 0 && fields.length === 0 && isOwnToggleOn) {
    return null
  }

  const body = (
    <Stack space={2}>
      {(title || description) && (
        <Stack space={1}>
          {title && (
            <Text variant="h4" as="h3">
              {title}
            </Text>
          )}
          {description && <Text>{description}</Text>}
        </Stack>
      )}
      <GridRow rowGap={2}>
        {fields.map(({ field, contractField, label, disabled }) => (
          <CalculatorField
            key={field.uid}
            field={field}
            contractField={contractField}
            label={label}
            locale={locale}
            disabled={disabled}
            error={errors.get(field.key)}
          />
        ))}
      </GridRow>
    </Stack>
  )

  if (!section.toggle) return body

  return (
    <Stack space={2}>
      <ToggleSwitchCheckbox
        /* `sectionToggleSchema.label` is required and `localized` falls back
         * en -> is, so the fallback is unreachable -- but the label prop is a
         * required string and `localized` returns `string | undefined`. */
        label={localized(section.toggle.label, locale) ?? ''}
        checked={isOwnToggleOn}
        onChange={(checked) =>
          section.toggle && onToggle(section.toggle.key, checked)
        }
      />
      {isOwnToggleOn && (
        <Box background="white" borderRadius="large" padding={[3, 3, 4]}>
          {body}
        </Box>
      )}
    </Stack>
  )
}
