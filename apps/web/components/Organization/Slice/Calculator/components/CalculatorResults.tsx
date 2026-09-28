import { AccordionCard, Box, Stack, Text } from '@island.is/island-ui/core'
import type { Locale } from '@island.is/shared/types'
import type {
  CalculatorConfig,
  CalculatorOutputContentField,
  CalculatorOutputSection,
  CalculatorOutputValueField,
} from '@island.is/tax-calculators'
import { TaxCalculatorOutputFieldType } from '@island.is/web/graphql/schema'

import { MarkdownText } from '../../../MarkdownText/MarkdownText'
import type { OutputContractField, OutputFieldContract } from '../contract'
import { formatOutputValue } from '../utils/format'
import type { OutputValue, OutputValues } from '../utils/outputValues'
import { localized } from '../utils/text'
import { CalculatorOutputField } from './CalculatorOutputField'

interface Props {
  config: CalculatorConfig
  contract: OutputFieldContract
  values: OutputValues
  locale: Locale
}

export type VisibleRow =
  | { kind: 'content'; field: CalculatorOutputContentField; markdown: string }
  | {
      kind: 'value'
      field: CalculatorOutputValueField
      contractField: OutputContractField
      label: string
      value: OutputValue
    }

const visibleRows = (
  section: CalculatorOutputSection,
  contract: OutputFieldContract,
  values: OutputValues,
  locale: Locale,
): VisibleRow[] =>
  section.fields.flatMap((field): VisibleRow[] => {
    if (field.kind === 'content') {
      const markdown = localized(field.content, locale)
      if (!markdown) return []
      return [{ kind: 'content', field, markdown }]
    }

    const contractField = contract.get(field.key)
    if (!contractField) return []

    const label = localized(field.label, locale)
    if (!label) return []

    const value = values.get(field.key)
    if (!value) return []

    if (
      contractField.type !== TaxCalculatorOutputFieldType.Array &&
      formatOutputValue(value, contractField.semantic, locale) === undefined
    ) {
      return []
    }

    return [{ kind: 'value', field, contractField, label, value }]
  })

export const collectVisibleSections = (
  config: CalculatorConfig,
  contract: OutputFieldContract,
  values: OutputValues,
  locale: Locale,
) =>
  config.outputSections.flatMap((section) => {
    const rows = visibleRows(section, contract, values, locale)

    if (rows.length === 0) return []

    return [{ section, rows }]
  })

export const CalculatorResults = ({
  config,
  contract,
  values,
  locale,
}: Props) => {
  const sections = collectVisibleSections(config, contract, values, locale)

  if (sections.length === 0) return null

  return (
    <Stack space={3} dividers>
      {sections.map(({ section, rows }) => {
        const title = localized(section.title, locale)

        const body = (
          <Stack space={2}>
            {rows.map((row) =>
              row.kind === 'content' ? (
                <MarkdownText key={row.field.uid}>{row.markdown}</MarkdownText>
              ) : (
                <CalculatorOutputField
                  key={row.field.uid}
                  field={row.field}
                  contractField={row.contractField}
                  label={row.label}
                  value={row.value}
                  locale={locale}
                />
              ),
            )}
          </Stack>
        )

        if (section.variant === 'accordion') {
          return (
            <AccordionCard
              key={section.key}
              id={`calculator-output-${section.key}`}
              label={title ?? ''}
            >
              {body}
            </AccordionCard>
          )
        }

        return (
          <Box key={section.key}>
            <Stack space={2}>
              {title && (
                <Text variant="h4" as="h3">
                  {title}
                </Text>
              )}
              {body}
            </Stack>
          </Box>
        )
      })}
    </Stack>
  )
}
