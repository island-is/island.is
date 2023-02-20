import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../lib/parentalLeaveUtils'


const DateField: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const { residenceGrant } = getApplicationAnswers(application.answers)
  return (
    <Box>
      <Text>
        {formatMessage(
          parentalLeaveFormMessages.residenceGrantMessage
          .residenceGrantDateDescription,
          {
            dateFrom: residenceGrant.dateFrom,
            dateTo: residenceGrant.dateTo
          }
        )}
      </Text>
    </Box>
  )
}

export default DateField