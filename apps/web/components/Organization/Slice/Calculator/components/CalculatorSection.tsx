import {
  Box,
  GridColumn,
  GridRow,
  Stack,
  Text,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import type { Locale } from '@island.is/shared/types'
import type { CalculatorInputSection } from '@island.is/tax-calculators'
import { isInputValueField } from '@island.is/tax-calculators'

import { MarkdownText } from '../../../MarkdownText/MarkdownText'
import type { ApplicableField, ApplicableFields } from '../utils/applicability'
import { localized } from '../utils/text'
import { CalculatorField } from './CalculatorField'

type SectionRow =
  | ({ kind: 'field' } & ApplicableField)
  | { kind: 'content'; uid: string; markdown: string }

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
  const isGatingToggleOn = section.gate ? toggles[section.gate.toggle] : true
  if (!isGatingToggleOn && !section.gate?.disableOnly) return null

  const isOwnToggleOn = section.toggle ? toggles[section.toggle.key] : true

  const title = localized(section.title, locale)
  const description = localized(section.description, locale)

  const rows = section.fields.flatMap((field): SectionRow[] => {
    if (isInputValueField(field)) {
      const entry = applicable.get(field.key)
      return entry ? [{ kind: 'field', ...entry }] : []
    }
    const markdown = localized(field.content, locale)
    return markdown ? [{ kind: 'content', uid: field.uid, markdown }] : []
  })

  const hasValueFields = section.fields.some(isInputValueField)
  const hasApplicableFields = rows.some((row) => row.kind === 'field')

  if (hasValueFields && !hasApplicableFields && !section.toggle) {
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
        {rows.map((row) =>
          row.kind === 'content' ? (
            <GridColumn key={row.uid} span="12/12">
              <MarkdownText>{row.markdown}</MarkdownText>
            </GridColumn>
          ) : (
            <CalculatorField
              key={row.field.uid}
              field={row.field}
              contractField={row.contractField}
              label={row.label}
              locale={locale}
              disabled={row.disabled}
              error={errors.get(row.field.key)}
            />
          ),
        )}
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
