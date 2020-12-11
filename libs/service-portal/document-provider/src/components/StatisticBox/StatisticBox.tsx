import React, { FC } from 'react'
import { Box, Button, Text, Inline } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { Link } from 'react-router-dom'
import { defineMessage } from 'react-intl'

interface Props {
  name: string
  value: number
}

export const StatisticBox: FC<Props> = ({ name, value }) => {
  return (
    <Box
      marginRight={1}
      paddingY={2}
      paddingX={2}
      border="standard"
      borderRadius="large"
    >
      <Box marginBottom={2}>
        <Inline alignY="bottom" space={1}>
          <Text variant="h2" as="h2" color="blue400">
            {value}
          </Text>
          <Text fontWeight="semiBold" color="dark300" lineHeight="lg">
            Þús
          </Text>
        </Inline>
      </Box>
      <Box>
        <Text fontWeight="semiBold">{name}</Text>
      </Box>
    </Box>
  )
}
