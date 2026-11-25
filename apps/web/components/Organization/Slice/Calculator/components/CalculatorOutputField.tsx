import { useId } from 'react'

import { Box, Stack, Text } from '@island.is/island-ui/core'
import type { Locale } from '@island.is/shared/types'
import type { CalculatorOutputValueField } from '@island.is/tax-calculators'
import { TaxCalculatorOutputFieldType } from '@island.is/web/graphql/schema'

import type { OutputContractField } from '../contract'
import { formatOutputValue } from '../utils/format'
import { outputSemantic } from '../utils/numberType'
import { hasItemFields } from '../utils/outputDiagnostics'
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
  const labelId = useId()
  const emphasis = field.variant === 'emphasis'

  if (hasItemFields(contractField.type)) {
    const rows =
      contractField.type === TaxCalculatorOutputFieldType.Array
        ? value.arrayValue ?? []
        : value.objectValue
        ? [value.objectValue]
        : []
    const itemFields = contractField.itemFields ?? []

    return (
      <Box role="group" aria-labelledby={labelId}>
        <Text id={labelId} variant={emphasis ? 'h4' : 'default'}>
          {label}
        </Text>
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
                outputSemantic(contractItemField, itemField.numberType),
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
                  <Box component="dt">
                    <Text>{itemLabel}</Text>
                  </Box>
                  <Box component="dd">
                    <Text fontWeight="semiBold">{formatted}</Text>
                  </Box>
                </Box>,
              ]
            })

            if (items.length === 0) return []

            return [
              <Box key={index} component="dl" paddingLeft={2}>
                {items}
              </Box>,
            ]
          })}
        </Stack>
      </Box>
    )
  }

  const formatted = formatOutputValue(
    value,
    outputSemantic(contractField, field.numberType),
    locale,
  )
  if (formatted === undefined) return null

  return (
    <Box
      component="dl"
      display="flex"
      justifyContent="spaceBetween"
      columnGap={2}
    >
      <Box component="dt">
        <Text variant={emphasis ? 'h4' : 'default'}>{label}</Text>
      </Box>
      <Box component="dd">
        <Text
          variant={emphasis ? 'h4' : 'default'}
          fontWeight={emphasis ? 'semiBold' : 'regular'}
        >
          {formatted}
        </Text>
      </Box>
    </Box>
  )
}
