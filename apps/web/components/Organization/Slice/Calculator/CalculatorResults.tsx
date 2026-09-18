import { AccordionCard, Box, Stack, Text } from '@island.is/island-ui/core'
import type { Locale } from '@island.is/shared/types'
import type {
  CalculatorConfig,
  CalculatorOutputSection,
} from '@island.is/tax-calculators'
import { TaxCalculatorOutputFieldType } from '@island.is/web/graphql/schema'
import { MarkdownText } from '@island.is/web/components'

import { CalculatorOutputField } from './CalculatorOutputField'
import type { OutputFieldContract } from './contract'
import { formatOutputValue } from './format'
import type { OutputValues } from './outputValues'
import { localized } from './text'

interface Props {
  config: CalculatorConfig
  contract: OutputFieldContract
  values: OutputValues
  locale: Locale
}

/* Every omission a result row can suffer, resolved before rendering so that a
 * section left with nothing to show can be dropped whole rather than leaving a
 * heading standing over an empty box. Each is silent here on purpose -- the
 * unlabelled and stale warnings are emitted once from the diagnostics effect. */
const visibleRows = (
  section: CalculatorOutputSection,
  contract: OutputFieldContract,
  values: OutputValues,
  locale: Locale,
) =>
  section.fields.flatMap((field) => {
    const contractField = contract.get(field.key)
    if (!contractField) return []

    /* A raw key must never reach the public page. */
    const label = localized(field.label, locale)
    if (!label) return []

    /* A key RSK returned nothing for is absent from `values` entirely. */
    const value = values.get(field.key)
    if (!value) return []

    /* An array field renders its own emptiness; a scalar that formatted to
     * nothing has no row to render at all. Branched on the contract rather than
     * on whether the response happens to carry `arrayValue`, because that is
     * what `CalculatorOutputField` branches on -- reading the two differently
     * is how a row survives here and then renders nothing. */
    if (
      contractField.type !== TaxCalculatorOutputFieldType.Array &&
      formatOutputValue(value, contractField.semantic, locale) === undefined
    ) {
      return []
    }

    return [{ field, contractField, label, value }]
  })

/* Exported because the caller has to know whether there is anything to show
 * before it renders a heading and a box around this component -- a result area
 * standing empty is the same defect as a section heading over no rows, one
 * level up. */
export const collectVisibleSections = (
  config: CalculatorConfig,
  contract: OutputFieldContract,
  values: OutputValues,
  locale: Locale,
) =>
  config.outputSections.flatMap((section) => {
    const rows = visibleRows(section, contract, values, locale)
    const content = localized(section.content, locale)

    /* A section authored as prose alone stands on its own; one whose every row
     * was omitted does not. */
    if (rows.length === 0 && !content) return []

    return [{ section, rows, content }]
  })

/* Renders the calculation through `config.outputSections`: the CMS owns order,
 * labels, grouping and prose, and the response only supplies values. */
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
      {sections.map(({ section, rows, content }) => {
        const title = localized(section.title, locale)

        const body = (
          <Stack space={2}>
            {content && <MarkdownText>{content}</MarkdownText>}
            {rows.map(({ field, contractField, label, value }) => (
              <CalculatorOutputField
                key={field.uid}
                field={field}
                contractField={contractField}
                label={label}
                value={value}
                locale={locale}
              />
            ))}
          </Stack>
        )

        /* The config schema requires a title on an accordion section, so the
         * fallback below is unreachable -- but `localized` returns
         * `string | undefined` and `label` is a required string. */
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
