import React, { FC } from 'react'
import { Box, Text, Inline } from '@island.is/island-ui/core'

interface Props {
  name: string
  value: number
}

export const StatisticBox: FC<Props> = ({ name, value }) => {
  return (
    <Box padding={2} border="standard" borderRadius="large">
      <Box>
        <Box>
          <Text variant={'eyebrow'}>{name}</Text>
        </Box>
        <Inline alignY="bottom" space={1}>
          <Text variant="h2" as="h2">
            {value}
          </Text>
          <Text variant={'eyebrow'}>Þús</Text>
        </Inline>
      </Box>
    </Box>
  )
}
