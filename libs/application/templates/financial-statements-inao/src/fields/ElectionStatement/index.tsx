import React from 'react'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { Box, InputError, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { format as formatNationalId } from 'kennitala'
import { useSubmitApplication } from '../../hooks/useSubmitApplication'
import { ELECTIONLIMIT, GREATER } from '../../lib/constants'
import { formatNumber } from '../../lib/utils/helpers'
import BottomBar from '../../components/BottomBar'
import { useFormContext } from 'react-hook-form'

export const ElectionStatement = ({
  application,
  goToScreen,
  refetch,
}: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const { errors } = useFormContext()
  const answers = application.answers as FinancialStatementsInao

  const [submitApplication] = useSubmitApplication({
    application,
    refetch,
    event: DefaultEvents.SUBMIT,
  })

  const onBackButtonClick = () => {
    const incomeLimit = getValueViaPath(answers, 'election.incomeLimit')

    if (incomeLimit === GREATER) {
      goToScreen && goToScreen('attachments.file')
    } else {
      goToScreen && goToScreen('election')
    }
  }

  const onSendButtonClick = () => {
    submitApplication()
  }

  return (
    <Box>
      <Box paddingBottom={2}>
        <Text>
          {`${answers.about.fullName},
          ${formatMessage(m.nationalId)}: ${formatNationalId(
            answers.about.nationalId,
          )}, ${formatMessage(m.participated)} 
          ${answers.election.electionName}`}
        </Text>
      </Box>
      <Box paddingY={2}>
        <Text>{`${formatMessage(m.electionDeclare)} ${formatNumber(
          ELECTIONLIMIT,
        )}`}</Text>
      </Box>
      <Box paddingY={2}>
        <Text>{formatMessage(m.electionStatementLaw)}</Text>
      </Box>
      {errors && getErrorViaPath(errors, 'applicationApprove') ? (
        <InputError errorMessage={formatMessage(m.errorApproval)} />
      ) : null}
      <BottomBar
        onSendButtonClick={onSendButtonClick}
        onBackButtonClick={onBackButtonClick}
      />
    </Box>
  )
}
