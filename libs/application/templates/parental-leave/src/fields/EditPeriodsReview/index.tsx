import React, { FC } from 'react'

import { Application } from '@island.is/application/types'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { Timeline } from '../components/Timeline/Timeline'
import {
  formatPeriods,
  getExpectedDateOfBirthOrAdoptionDate,
} from '../../lib/parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../lib/messages'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
  editable?: boolean
}

const EditPeriodsReview: FC<React.PropsWithChildren<ReviewScreenProps>> = ({
  application,
}) => {
  const { formatMessage } = useLocale()
  const dob = getExpectedDateOfBirthOrAdoptionDate(application)
  const dobDate = dob ? new Date(dob) : null

  return (
    <div>
      <Box marginTop={[2, 2, 4]} marginBottom={[0, 0, 6]}>
        <Box paddingY={4}>
          {(dobDate && (
            <Timeline
              initDate={dobDate}
              title={formatMessage(
                parentalLeaveFormMessages.shared.expectedDateOfBirthTitle,
              )}
              titleSmall={formatMessage(
                parentalLeaveFormMessages.shared.dateOfBirthTitle,
              )}
              periods={formatPeriods(application, formatMessage)}
            />
          )) || (
            <Text>
              {formatMessage(
                parentalLeaveFormMessages.shared.dateOfBirthNotAvailable,
              )}
            </Text>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default EditPeriodsReview
