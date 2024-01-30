import React, { FC } from 'react'
import { Application } from '@island.is/application/types'
import {
  Box,
  Text,
  AlertMessage,
  ContentBlock,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'
import Periods from './Periods'
import Employers from './Employers'
import { PrintButton } from '../PrintButton'
import { getApplicationAnswers } from '../../lib/parentalLeaveUtils'
import {
  PARENTAL_GRANT,
  PARENTAL_GRANT_STUDENTS,
  PARENTAL_LEAVE,
  YES,
} from '../../constants'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
}

const EditOrAddEmployersAndPeriodsReview: FC<
  React.PropsWithChildren<ReviewScreenProps>
> = ({ application, goToScreen }) => {
  const { formatMessage } = useLocale()
  const {
    employers,
    addEmployer,
    addPeriods,
    applicationType,
    isReceivingUnemploymentBenefits,
    isSelfEmployed,
    employerLastSixMonths,
  } = getApplicationAnswers(application.answers)

  const childProps = {
    application,
    goToScreen,
  }

  const hasEmployer =
    (applicationType === PARENTAL_LEAVE &&
      isReceivingUnemploymentBenefits !== YES &&
      isSelfEmployed !== YES) ||
    ((applicationType === PARENTAL_GRANT ||
      applicationType === PARENTAL_GRANT_STUDENTS) &&
      employerLastSixMonths === YES)

  return (
    <>
      <Box>
        <PrintButton />
        <Box marginBottom={2}>
          <Text variant="h2">
            {formatMessage(parentalLeaveFormMessages.confirmation.title)}
          </Text>
        </Box>
        <Box marginBottom={10}>
          <Text variant="default">
            {formatMessage(parentalLeaveFormMessages.confirmation.description)}
          </Text>
        </Box>
      </Box>
      {addEmployer !== YES && addPeriods !== YES && (
        <Box marginBottom={3}>
          <ContentBlock>
            <AlertMessage
              type="warning"
              title={formatMessage(
                parentalLeaveFormMessages.shared.editPeriodsReviewAlertTitle,
              )}
              message={formatMessage(
                parentalLeaveFormMessages.shared.editPeriodsReviewAlertMessage,
              )}
            />
          </ContentBlock>
        </Box>
      )}
      {hasEmployer && employers.length !== 0 && <Employers {...childProps} />}
      <Periods {...childProps} />
    </>
  )
}

export default EditOrAddEmployersAndPeriodsReview
