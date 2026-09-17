import React, { FC } from 'react'
import { Application } from '@island.is/application/types'
import { Box, Text, Button } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { YES } from '@island.is/application/core'
import { parentalLeaveFormMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../lib/parentalLeaveUtils'
import {
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
} from '../../constants'
import Attachments from './review-groups/Attachments'
import BaseInformation from './review-groups/BaseInformation'
import Employment from './review-groups/Employment'
import OtherParent from './review-groups/OtherParent'
import Payments from './review-groups/Payments'
import Periods from './review-groups/Periods'
import PersonalAllowance from './review-groups/PersonalAllowance'
import Rights from './review-groups/Rights'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
}

const EditOrAddEmployersAndPeriodsReview: FC<
  React.PropsWithChildren<ReviewScreenProps>
> = ({ application, goToScreen }) => {
  const { formatMessage } = useLocale()
  const { changeEmployerFile, applicationType, employerLastSixMonths } =
    getApplicationAnswers(application.answers)

  const reviewProps = {
    application,
    goToScreen,
  }

  return (
    <>
      <Box display="flex" justifyContent="spaceBetween">
        <Box>
          <Box marginBottom={2}>
            <Text variant="h2">
              {formatMessage(parentalLeaveFormMessages.confirmation.title)}
            </Text>
          </Box>
          <Box marginBottom={10}>
            <Text variant="default">
              {formatMessage(
                parentalLeaveFormMessages.confirmation.description,
              )}
            </Text>
          </Box>
        </Box>
        <Box>
          <Button
            variant="utility"
            icon="print"
            onClick={(e) => {
              e.preventDefault()
              window.print()
            }}
          />
        </Box>
      </Box>
      <BaseInformation {...reviewProps} />
      <OtherParent {...reviewProps} />
      <Payments {...reviewProps} />
      <PersonalAllowance {...reviewProps} />
      {(applicationType === PARENTAL_LEAVE ||
        ((applicationType === PARENTAL_GRANT ||
          applicationType === PARENTAL_GRANT_STUDENTS) &&
          employerLastSixMonths === YES)) && <Employment {...reviewProps} />}
      <Rights {...reviewProps} />
      <Periods {...reviewProps} />
      {changeEmployerFile && <Attachments application={application} />}
    </>
  )
}

export default EditOrAddEmployersAndPeriodsReview
