import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { MessageDescriptor } from 'react-intl'

interface ValueLineProps {
  label: string | MessageDescriptor
  value?: string | MessageDescriptor
}

export const ValueLine: FC<ValueLineProps> = ({ label, value = '-' }) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingBottom={3}>
      <Text variant="h4" as="h4">
        {formatMessage(label)}
      </Text>
      <Text variant="default" as="p">
        {value}
      </Text>
    </Box>
  )
}
