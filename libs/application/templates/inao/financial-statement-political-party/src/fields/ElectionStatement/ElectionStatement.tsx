import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { AlertBanner, Box, InputError, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { DefaultEvents, FieldBaseProps } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { useSubmitApplication } from '../../hooks/useSubmitApplication'
import { useFormContext } from 'react-hook-form'
import { FinancialStatementPoliticalParty } from '../../lib/dataSchema'
import { ELECTIONLIMIT } from '../../utils/constants'
import { formatNumber } from '../../../../shared/utils/helpers'
import { BottomBar } from '../../../../shared/components/BottomBar'
import { GREATER } from '../../../../shared/utils/constants'

export const ElectionStatement = ({
  application,
  goToScreen,
  refetch,
}: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const {
    formState: { errors },
  } = useFormContext()
  const answers = application.answers as FinancialStatementPoliticalParty
  const email = getValueViaPath(answers, 'about.email')
  const [submitApplication, { loading }] = useSubmitApplication({
    application,
    refetch,
    event: DefaultEvents.SUBMIT,
  })

  const onBackButtonClick = () => {
    const incomeLimit = getValueViaPath(answers, 'election.incomeLimit')

    if (incomeLimit === GREATER) {
      goToScreen?.('attachments.file')
    } else {
      goToScreen?.('election')
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
          ${answers.election.genitiveName}`}
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
      <Box paddingY={2}>
        <AlertBanner
          title={`${formatMessage(m.signatureTitle)}`}
          description={`${formatMessage(
            m.signatureMessage,
          )} ${email} ${formatMessage(m.signaturePossible)}`}
          variant="info"
        />
      </Box>
      {errors && getErrorViaPath(errors, 'applicationApprove') ? (
        <InputError errorMessage={formatMessage(m.errorApproval)} />
      ) : null}
      <BottomBar
        loading={loading}
        onSendButtonClick={onSendButtonClick}
        onBackButtonClick={onBackButtonClick}
        goBack={m.goBack}
        send={m.sendStatement}
      />
    </Box>
  )
}
