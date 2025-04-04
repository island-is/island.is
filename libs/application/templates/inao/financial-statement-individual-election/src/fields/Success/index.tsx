import { Box, ContentBlock, AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import format from 'date-fns/format'
import { FinancialStatementIndividualElection } from '../../lib/dataSchema'
import { m } from '../../lib/messages'

export const Success = ({ application }: FieldBaseProps) => {
  const applicationAnswers =
    application.answers as FinancialStatementIndividualElection
  const { formatMessage } = useLocale()

  const getDescriptionText = () => {
    const currentDate = format(new Date(), "dd.MM.yyyy 'kl.' kk:mm")
    return `${formatMessage(m.individualReceivedMsgFirst)} ${
      applicationAnswers.election.genitiveName
    }
      ${formatMessage(m.individualReceivedMsgSecond)} ${currentDate}`
  }

  const shouldShowDigitalSigningMessage = () => {
    if (applicationAnswers.election.incomeLimit === 'less') {
      return true
    }

    return false
  }

  return (
    <Box paddingTop={2}>
      <Box marginTop={2} marginBottom={5}>
        <ContentBlock>
          <AlertMessage
            type="success"
            title={formatMessage(m.returned)}
            message={getDescriptionText()}
          />
        </ContentBlock>
        {shouldShowDigitalSigningMessage() && (
          <Box paddingTop={2}>
            <AlertMessage
              type="info"
              title={formatMessage(m.digitalSignatureTitle)}
              message={formatMessage(m.digitalSignatureMessage, {
                email: applicationAnswers.about.email,
              })}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}
