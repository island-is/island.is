import React, { FC } from 'react'
import { Box, Text, Inline } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { formatNumber } from '../../lib/utils'

interface Props {
  name: string
  value: number
}

export const StatisticBox: FC<React.PropsWithChildren<Props>> = ({
  name,
  value,
}) => {
  const { formatMessage } = useLocale()

  let displayValue = formatNumber(value)
  let displayText = ''

  if (value > 1000000) {
    displayValue = formatNumber(Number((value / 1000000).toFixed(1)))
    displayText = formatMessage(m.statisticsBoxMillions)
  } else if (value > 10000) {
    displayValue = formatNumber(Number((value / 1000).toFixed(0)))
    displayText = formatMessage(m.statisticsBoxThousands)
  }

  return (
    <Box padding={2} border="standard" borderRadius="large">
      <Box>
        <Box>
          <Text variant="eyebrow">{name}</Text>
        </Box>
        <Inline alignY="bottom" space={1}>
          <Text variant="h2" as="h2">
            {displayValue}
          </Text>
          <Text variant="eyebrow">{displayText}</Text>
        </Inline>
      </Box>
    </Box>
  )
}
