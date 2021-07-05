import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

const FileUploadDisclaimer = () => {
  const { formatMessage } = useLocale()

  return (
    <Box paddingLeft={5} marginBottom={2}>
      <Text variant="small">
        {formatMessage(m.fileUpload.includePapersDisclaimerPt1)}
      </Text>
      <Text variant="small">
        {formatMessage(m.fileUpload.includePapersDisclaimerPt2)}
      </Text>
      <Text variant="small">
        {formatMessage(m.fileUpload.includePapersDisclaimerPt3)}
      </Text>
    </Box>
  )
}

export default FileUploadDisclaimer
