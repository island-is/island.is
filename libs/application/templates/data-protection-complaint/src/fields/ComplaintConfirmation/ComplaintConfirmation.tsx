import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { confirmation } from '../../lib/messages/confirmation'
import { CompanyIllustration } from '../Illustrations/CompanyIllustration'

export const ComplaintConfirmation: FC = () => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={3}>
      <Text>{formatMessage(confirmation.labels.bulletOne)}</Text>
      <Box marginTop={[3, 5, 12]}>
        <CompanyIllustration />
      </Box>
    </Box>
  )
}
