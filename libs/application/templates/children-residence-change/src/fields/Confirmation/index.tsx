import React from 'react'
import { useIntl } from 'react-intl'
import { Box } from '@island.is/island-ui/core'
import { confirmation, copyUrl } from '../../lib/messages'
import { DescriptionText, CopyUrl } from '../components'

const Confirmation = () => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Box marginTop={3}>
        <DescriptionText
          text={confirmation.general.description}
          format={{ applicationNumber: '12345' }}
        />
      </Box>
      <Box marginTop={5}>
        <CopyUrl
          title={formatMessage(copyUrl.title)}
          inputLabel={formatMessage(copyUrl.inputLabel)}
          buttonLabel={formatMessage(copyUrl.buttonLabel)}
          successMessage={formatMessage(copyUrl.successMessage)}
        />
      </Box>
    </>
  )
}

export default Confirmation
