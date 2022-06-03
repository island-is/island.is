import React from 'react'
import { useIntl } from 'react-intl'

import { AlertMessage, Box } from '@island.is/island-ui/core'
import { copyUrl, spouseAlert } from '../../../lib/messages'
import { CopyUrl } from '../..'

interface Props {
  showCopyUrl: boolean
}

const SpouseAlert = ({ showCopyUrl }: Props) => {
  const { formatMessage } = useIntl()

  return (
    <Box marginBottom={[4, 4, 5]}>
      <AlertMessage
        type="warning"
        title={formatMessage(spouseAlert.title)}
        message={
          showCopyUrl
            ? formatMessage(spouseAlert.messageCopyUrl)
            : formatMessage(spouseAlert.message)
        }
      />
      {showCopyUrl && (
        <Box marginTop={2}>
          <CopyUrl
            inputLabel={formatMessage(copyUrl.inputLabel)}
            buttonLabel={formatMessage(copyUrl.buttonLabel)}
            successMessage={formatMessage(copyUrl.successMessage)}
          />
        </Box>
      )}
    </Box>
  )
}

export default SpouseAlert
