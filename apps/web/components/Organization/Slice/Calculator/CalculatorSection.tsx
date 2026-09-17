import {
  Box,
  GridRow,
  Stack,
  Text,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import type { Locale } from '@island.is/shared/types'
import type { CalculatorInputSection } from '@island.is/tax-calculators'

import { CalculatorField } from './CalculatorField'
import type { InputFieldContract } from './contract'
import { localized } from './text'

interface Props {
  section: CalculatorInputSection
  contract: InputFieldContract
  locale: Locale
  toggles: Record<string, boolean>
  onToggle: (key: string, checked: boolean) => void
}

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

  /* Resolved before rendering so that a section whose fields are ALL omitted
   * can be dropped whole, rather than leaving a heading standing over an empty
   * row. Both omissions are silent here on purpose -- the warning for each is
   * emitted once from the diagnostics effect, where StrictMode's double render
   * cannot repeat it. */
  const fields = section.fields.flatMap((field) => {
    const contractField = contract.get(field.key)
    if (!contractField) return []

    /* A raw key must never reach the public page, so an unlabelled field is
     * dropped rather than labelled with its key. */
    const label = localized(field.label, locale)
    if (!label) return []

    return [{ field, contractField, label }]
  })

  /* A section the editor authored with no fields at all is text-only and stands
   * on its own; one whose every field was omitted is not. */
  if (section.fields.length > 0 && fields.length === 0) return null

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
        {fields.map(({ field, contractField, label }) => (
          <CalculatorField
            key={field.uid}
            field={field}
            contractField={contractField}
            contract={contract}
            label={label}
            locale={locale}
            disabled={!isGateOpen}
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
