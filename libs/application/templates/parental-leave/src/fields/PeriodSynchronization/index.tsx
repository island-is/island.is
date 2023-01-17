import React from 'react'
import { Box } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'

const PeriodSynchronization = () => {
  const { formatMessage } = useLocale()
  return (
    <Box>
      <FieldDescription
        description={formatMessage(
          parentalLeaveFormMessages.attachmentScreen.genericTitle,
        )}
      />
    </Box>
  )
}

export default PeriodSynchronization
