import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { overview } from '../lib/messages'

export const ComplaintOverview: FC<FieldBaseProps> = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Text marginTop={2}>
        {formatMessage(overview.general.pageDescription)}
      </Text>
    </Box>
  )
}
