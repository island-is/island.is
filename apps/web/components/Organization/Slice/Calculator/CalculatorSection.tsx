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
  /* A section renders exactly the fields that would be submitted. */
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
  /* A `disableOnly` section renders its fields while they stay inapplicable,
   * which is why the two are asked separately. */
  const isGateOpen = section.gate ? toggles[section.gate.toggle] : true
  if (!isGateOpen && !section.gate?.disableOnly) return null

  const isOwnToggleOn = section.toggle ? toggles[section.toggle.key] : true

  const title = localized(section.title, locale)
  const description = localized(section.description, locale)

  /* Resolved before rendering so a section whose fields are all omitted can be
   * dropped whole rather than leaving a heading over nothing. */
  const fields = section.fields.flatMap((field) => {
    const entry = applicable.get(field.key)
    return entry ? [entry] : []
  })

  /* A section authored with no fields is text-only and stands on its own; one
   * whose every field was omitted does not. Only while the body is shown --
   * dropping a toggled-off section would take its toggle with it. */
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
        /* Unreachable: the schema requires the label. Present only because
         * `localized` returns `string | undefined`. */
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
