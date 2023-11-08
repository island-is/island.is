import React, { FC } from 'react'

import { Application } from '@island.is/application/types'
import { Box, GridRow, Text, GridColumn } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { Timeline } from '../components/Timeline/Timeline'
import {
  formatPeriods,
  getExpectedDateOfBirthOrAdoptionDate,
} from '../../lib/parentalLeaveUtils'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { ReviewGroup, Label } from '@island.is/application/ui-components'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
}

const Periods: FC<React.PropsWithChildren<ReviewScreenProps>> = ({
  application,
  goToScreen,
}) => {
  const { formatMessage } = useLocale()
  const dob = getExpectedDateOfBirthOrAdoptionDate(application)
  const dobDate = dob ? new Date(dob) : null

  return (
    <ReviewGroup
      isEditable
      editAction={() => goToScreen?.('addPeriods')}
      isLast
    >
      <GridRow>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12']}>
          <Label>
            {formatMessage(parentalLeaveFormMessages.shared.periodReview)}
          </Label>
          <Box paddingTop={3}>
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
        </GridColumn>
      </GridRow>
    </ReviewGroup>
  )
}

export default Periods
