import { Box, Stack, Text } from '@island.is/island-ui/core'
import type { Locale } from '@island.is/shared/types'
import type { CalculatorOutputValueField } from '@island.is/tax-calculators'
import { TaxCalculatorOutputFieldType } from '@island.is/web/graphql/schema'

import type { OutputContractField } from './contract'
import { formatOutputValue } from './format'
import { itemValue, type OutputValue } from './outputValues'
import { localized } from './text'

interface Props {
  field: CalculatorOutputValueField
  contractField: OutputContractField
  /* The section drops a row the editor left unlabelled, so this never has to
   * represent that case. */
  label: string
  value: OutputValue
  locale: Locale
}

/* An array field is this same row repeated, one group per row RSK returned. */
export const CalculatorOutputField = ({
  field,
  contractField,
  label,
  value,
  locale,
}: Props) => {
  const emphasis = field.variant === 'emphasis'

  const heading = <Text variant={emphasis ? 'h4' : 'default'}>{label}</Text>

  if (contractField.type === TaxCalculatorOutputFieldType.Array) {
    /* An empty list is a result, not a missing value, so the label stands alone
     * rather than the field disappearing. */
    const rows = value.arrayValue ?? []
    const itemFields = contractField.itemFields ?? []

    return (
      <Box>
        {heading}
        <Stack space={2}>
          {rows.flatMap((row, index) => {
            /* Built before the box so a fully omitted row takes its padding
             * with it. */
            const items = (field.itemFields ?? []).flatMap((itemField) => {
              const itemLabel = localized(itemField.label, locale)
              if (!itemLabel) return []

              const contractItemField = itemFields.find(
                (candidate) => candidate.key === itemField.key,
              )
              if (!contractItemField) return []

              const scalar = itemValue(row, itemField.key)
              if (!scalar) return []

              const formatted = formatOutputValue(
                scalar,
                contractItemField.semantic,
                locale,
              )
              if (formatted === undefined) return []

              return [
                <Box
                  key={itemField.uid}
                  display="flex"
                  justifyContent="spaceBetween"
                  columnGap={2}
                >
                  <Text>{itemLabel}</Text>
                  <Text fontWeight="semiBold">{formatted}</Text>
                </Box>,
              ]
            })

            if (items.length === 0) return []

            return [
              /* Rows carry no identity; RSK's order is all that distinguishes
               * them. */
              <Box key={index} paddingLeft={2}>
                <Stack space={0}>{items}</Stack>
              </Box>,
            ]
          })}
        </Stack>
      </Box>
    )
  }

  const formatted = formatOutputValue(value, contractField.semantic, locale)
  /* Unreachable: the section only renders rows whose value formatted. */
  if (formatted === undefined) return null

  return (
    <Box display="flex" justifyContent="spaceBetween" columnGap={2}>
      {heading}
      <Text
        variant={emphasis ? 'h4' : 'default'}
        fontWeight={emphasis ? 'semiBold' : 'regular'}
      >
        {formatted}
      </Text>
    </Box>
  )
}
