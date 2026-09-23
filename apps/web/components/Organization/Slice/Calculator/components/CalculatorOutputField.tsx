import { Box, Stack, Text } from '@island.is/island-ui/core'
import type { Locale } from '@island.is/shared/types'
import type { CalculatorOutputValueField } from '@island.is/tax-calculators'
import { TaxCalculatorOutputFieldType } from '@island.is/web/graphql/schema'

import type { OutputContractField } from '../contract'
import { formatOutputValue } from '../utils/format'
import { itemValue, type OutputValue } from '../utils/outputValues'
import { localized } from '../utils/text'

interface Props {
  field: CalculatorOutputValueField
  contractField: OutputContractField
  label: string
  value: OutputValue
  locale: Locale
}

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
    const rows = value.arrayValue ?? []
    const itemFields = contractField.itemFields ?? []

    return (
      <Box>
        {heading}
        <Stack space={2}>
          {rows.flatMap((row, index) => {
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
