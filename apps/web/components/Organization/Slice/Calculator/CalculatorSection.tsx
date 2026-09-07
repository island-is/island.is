import {
  Box,
  GridColumn,
  GridRow,
  Stack,
  Text,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import type { Locale } from '@island.is/shared/types'
import type {
  CalculatorFieldSection,
  CalculatorLocalizedText,
} from '@island.is/tax-calculators'
import { TaxCalculatorField } from '@island.is/web/graphql/schema'

import { CalculatorField } from './CalculatorField'
import { localized } from './text'

interface Props {
  section: CalculatorFieldSection
  contract: Map<string, TaxCalculatorField>
  locale: Locale
  toggles: Record<string, boolean>
  onToggle: (key: string, checked: boolean) => void
}

/* `span` is a number 1-12 in the config, but GridColumn takes the fraction as a
 * string literal, so the two are bridged by position rather than interpolation. */
const TWELFTHS = [
  '1/12',
  '2/12',
  '3/12',
  '4/12',
  '5/12',
  '6/12',
  '7/12',
  '8/12',
  '9/12',
  '10/12',
  '11/12',
  '12/12',
] as const

export const CalculatorSection = ({
  section,
  contract,
  locale,
  toggles,
  onToggle,
}: Props) => {
  /* An unmet gate removes the section outright, unless the editor asked for it
   * to stay visible with its controls dead. */
  const isGateOpen = section.gate ? toggles[section.gate.toggle] : true
  if (!isGateOpen && !section.gate?.disableOnly) return null

  const isOwnToggleOn = section.toggle ? toggles[section.toggle.key] : true

  const title = localized(section.title, locale)
  const description = localized(section.description, locale)

  const body = (
    <Stack space={2}>
      {(title || description) && (
        <Stack space={1}>
          {title && <Text variant="h4">{title}</Text>}
          {description && <Text>{description}</Text>}
        </Stack>
      )}
      <GridRow rowGap={2}>
        {section.fields.map((field) => {
          const contractField = contract.get(field.key)
          if (!contractField) return null

          return (
            <GridColumn
              key={field.uid}
              span={['1/1', '1/1', TWELFTHS[field.span - 1] ?? '12/12']}
            >
              <CalculatorField
                field={field}
                contractField={contractField}
                locale={locale}
                disabled={!isGateOpen}
              />
            </GridColumn>
          )
        })}
      </GridRow>
    </Stack>
  )

  if (!section.toggle) return body

  return (
    <Stack space={2}>
      <ToggleSwitchCheckbox
        label={localized(section.toggle.label, locale) ?? section.toggle.key}
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
