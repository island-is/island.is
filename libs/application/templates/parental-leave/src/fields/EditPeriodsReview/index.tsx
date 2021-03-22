import React, { FC } from 'react'

import { Application } from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'

import { useLocale } from '@island.is/localization'

import Timeline from '../components/Timeline'
import { formatPeriods, getExpectedDateOfBirth } from '../../parentalLeaveUtils'
import { Period } from '../../types'

import { parentalLeaveFormMessages } from '../../lib/messages'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
  editable?: boolean
}

const Review: FC<ReviewScreenProps> = ({ application }) => {
  const { formatMessage } = useLocale()

  const dob = getExpectedDateOfBirth(application)

  if (!dob) {
    return null
  }

  const dobDate = new Date(dob)

  return (
    <div>
      <Box marginTop={[2, 2, 4]} marginBottom={[0, 0, 6]}>
        <Box paddingY={4}>
          <Timeline
            initDate={dobDate}
            title={formatMessage(
              parentalLeaveFormMessages.shared.expectedDateOfBirthTitle,
            )}
            titleSmall={formatMessage(
              parentalLeaveFormMessages.shared.dateOfBirthTitle,
            )}
            // TODO: Once we have the data, add the otherParentPeriods here.
            //  periods={formatPeriods(
            //   application.answers.periods as Period[],
            //   otherParentPeriods,
            // )}
            periods={formatPeriods(application.answers.periods as Period[])}
          />
        </Box>
      </Box>
    </div>
  )
}

export default Review
