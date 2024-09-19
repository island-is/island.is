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
import { FinancialStatementPoliticalParty } from '../../lib/dataSchema'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

export const Success = ({ application }: PropTypes) => {
  const applicationAnswers =
    application.answers as FinancialStatementPoliticalParty
  const { formatMessage } = useLocale()

  const getDescriptionText = () => {
    const currentDate = format(new Date(), "dd.MM.yyyy 'kl.' kk:mm")
    return `${formatMessage(m.operatingYearMsgFirst)} ${
      applicationAnswers.conditionalAbout.operatingYear
    }
      ${formatMessage(m.individualReceivedMsgSecond)} ${currentDate}`
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
