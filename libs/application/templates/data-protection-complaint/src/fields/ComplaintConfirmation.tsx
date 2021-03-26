import { Box, Bullet, Button, Stack } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React, { FC } from 'react'
import { confirmation } from '../lib/messages/confirmation'
import { CompanyIllustration } from './Illustrations/CompanyIllustration'

export const ComplaintConfirmation: FC = () => {
  const { formatMessage } = useLocale()

  return (
    <Box marginTop={3}>
      <Stack space={3}>
        <Bullet>{formatMessage(confirmation.labels.bulletOne)}</Bullet>
        <Bullet>{formatMessage(confirmation.labels.bulletTwo)}</Bullet>
      </Stack>
      <Box marginTop={[3, 5, 6]} marginBottom={[5, 6, 8]}>
        <Button variant="ghost" icon="open" iconType="outline">
          {formatMessage(confirmation.labels.pdfButton)}
        </Button>
      </Box>
      <CompanyIllustration />
    </Box>
  )
}
