import React, { FC } from 'react'
import { Application } from '@island.is/application/types'
import {
  Box,
  Text,
  AlertMessage,
  ContentBlock,
  Button,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { parentalLeaveFormMessages } from '../../lib/messages'
import Periods from './review-groups/Periods'
import Employers from './review-groups/Employers'
import Attachments from './review-groups/Attachments'
import { getApplicationAnswers } from '../../lib/parentalLeaveUtils'
import { YES } from '@island.is/application/core'

interface ReviewScreenProps {
  application: Application
  goToScreen?: (id: string) => void
}

const EditOrAddEmployersAndPeriodsReview: FC<
  React.PropsWithChildren<ReviewScreenProps>
> = ({ application, goToScreen }) => {
  const { formatMessage } = useLocale()
  const { addEmployer, addPeriods, changeEmployerFile } = getApplicationAnswers(
    application.answers,
  )

  const childProps = {
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
      <Employers {...childProps} />
      <Periods {...childProps} />
      {changeEmployerFile && <Attachments {...childProps} />}
    </>
  )
}

export default EditOrAddEmployersAndPeriodsReview
