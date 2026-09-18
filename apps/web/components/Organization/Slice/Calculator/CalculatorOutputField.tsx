import { Box, Stack, Text } from '@island.is/island-ui/core'
import type { Locale } from '@island.is/shared/types'
import type { CalculatorOutputSectionField } from '@island.is/tax-calculators'
import { TaxCalculatorOutputFieldType } from '@island.is/web/graphql/schema'

import type { OutputContractField } from './contract'
import { formatOutputValue } from './format'
import { itemValue, type OutputValue } from './outputValues'
import { localized } from './text'

interface Props {
  field: CalculatorOutputSectionField
  contractField: OutputContractField
  /* Resolved by the section, which drops the row outright when the editor
   * authored no label -- so this component never has to represent that case. */
  label: string
  value: OutputValue
  locale: Locale
}

/* One row of a result: its authored label and the value the calculation
 * produced, formatted from the contract's semantic. An array field is the same
 * row repeated, one group per row RSK returned. */
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
    /* An empty list is a result, not a missing value: RSK ran the calculation
     * and it produced no rows. The label stands alone rather than the whole
     * field disappearing, so the visitor can tell the two apart. */
    const rows = value.arrayValue ?? []
    const itemFields = contractField.itemFields ?? []

    return (
      <Box>
        {heading}
        <Stack space={2}>
          {rows.flatMap((row, index) => {
            /* Built before the row's own box, so a row whose every item field
             * was omitted takes its padding with it rather than leaving an
             * empty block behind. */
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
              /* Rows carry no identity of their own and RSK's order is the only
               * thing that distinguishes them, so the index is the key. */
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
  /* Unreachable in practice -- the section only renders a row whose value
   * formatted to something -- but the row must not render half of itself if
   * that ever stops holding. */
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
