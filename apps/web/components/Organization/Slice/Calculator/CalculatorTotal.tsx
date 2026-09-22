import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import type { Locale } from '@island.is/shared/types'
import type { CalculatorConfig } from '@island.is/tax-calculators'

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

export const resolveTotal = (
  config: CalculatorConfig,
  contract: OutputFieldContract,
  values: OutputValues,
  locale: Locale,
) => {
  const { outputTotal } = config

  const contractField = contract.get(outputTotal.key)
  if (!contractField) return undefined

  const label = localized(outputTotal.label, locale)
  if (!label) return undefined

  const value = values.get(outputTotal.key)
  if (!value) return undefined

  const formatted = formatOutputValue(value, contractField.semantic, locale)
  if (formatted === undefined) return undefined

  return { label, formatted }
}

export const CalculatorTotal = ({
  config,
  contract,
  values,
  locale,
}: Props) => {
  const total = resolveTotal(config, contract, values, locale)

  if (!total) return null

  return (
    <Stack space={2}>
      <Box>
        <Stack space={1}>
          <Text variant="h5" as="h2">
            {total.label}
          </Text>
          <Text variant="h1" as="p">
            {total.formatted}
          </Text>
        </Stack>
      </Box>
      <Divider />
    </Stack>
  )
}
