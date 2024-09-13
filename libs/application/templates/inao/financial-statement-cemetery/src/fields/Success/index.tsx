import {
  Box,
  ContentBlock,
  ActionCard,
  AlertMessage,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import format from 'date-fns/format'
import { m } from '../../lib/messages'
import { FinancialStatementCemetery } from '../../lib/dataSchema'
import {
  getCurrentUserType,
  isCemetryUnderFinancialLimit,
} from '../../utils/helpers'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

export const Success = ({ application }: PropTypes) => {
  const { answers, externalData } = application
  const applicationAnswers = application.answers as FinancialStatementCemetery
  const { formatMessage } = useLocale()

  const getDescriptionText = () => {
    const currentDate = format(new Date(), "dd.MM.yyyy 'kl.' kk:mm")
    return `${formatMessage(m.operatingYearMsgFirst)} ${
      applicationAnswers.conditionalAbout.operatingYear
    }
      ${formatMessage(m.individualReceivedMsgSecond)} ${currentDate}`
  }

  const shouldShowDigitalSigningMessage = () => {
    return isCemetryUnderFinancialLimit(answers, externalData)
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
        <Box paddingTop={2}>
          <ActionCard
            heading=""
            text={formatMessage(m.myPagesLinkText)}
            cta={{
              label: formatMessage(m.continue),
              onClick: () => window.open('/minarsidur/postholf', '_blank'),
            }}
            backgroundColor="blue"
          />
        </Box>
      </Box>
    </Box>
  )
}
