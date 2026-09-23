import {
  Box,
  GridRow,
  Stack,
  Text,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import type { Locale } from '@island.is/shared/types'
import type { CalculatorInputSection } from '@island.is/tax-calculators'

import type { ApplicableFields } from '../utils/applicability'
import { localized } from '../utils/text'
import { CalculatorField } from './CalculatorField'

interface Props {
  section: CalculatorInputSection
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
  const isGateOpen = section.gate ? toggles[section.gate.toggle] : true
  if (!isGateOpen && !section.gate?.disableOnly) return null

  const isOwnToggleOn = section.toggle ? toggles[section.toggle.key] : true

  const title = localized(section.title, locale)
  const description = localized(section.description, locale)

  const fields = section.fields.flatMap((field) => {
    const entry = applicable.get(field.key)
    return entry ? [entry] : []
  })

  if (section.fields.length > 0 && fields.length === 0 && !section.toggle) {
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
