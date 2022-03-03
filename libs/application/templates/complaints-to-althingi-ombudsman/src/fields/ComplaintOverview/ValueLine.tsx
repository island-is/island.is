import React, { FC } from 'react'
import { MessageDescriptor } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

export const ValueLine: FC<{
  label: string | MessageDescriptor
  value: string | MessageDescriptor
}> = ({ label, value }) => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingY={1}>
      <Text variant="h5">{formatMessage(label)}</Text>
      <Text>{formatMessage(value)}</Text>
    </Box>
  )
}
