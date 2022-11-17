import React from 'react'
import { Box, ContentBlock, AlertMessage } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { CustomField, FieldBaseProps } from '@island.is/application/types'
import format from 'date-fns/format'
import { m } from '../../lib/messages'
import { getCurrentUserType } from '../../lib/utils/helpers'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { FSIUSERTYPE } from '../../types'

interface PropTypes extends FieldBaseProps {
  field: CustomField
}

export const Success = ({ application }: PropTypes): JSX.Element => {
  const { answers, externalData } = application
  const applicationAnswers = application.answers as FinancialStatementsInao
  const userType = getCurrentUserType(answers, externalData)
  const { formatMessage } = useLocale()

  const getDescriptionText = () => {
    const currentDate = format(new Date(), "dd.MM.yyyy 'kl.' kk:mm")
    if (userType === FSIUSERTYPE.INDIVIDUAL) {
      return `${formatMessage(m.individualReceivedMsgFirst)} ${
        applicationAnswers.election.electionName
      }
      ${formatMessage(m.individualReceivedMsgSecond)} ${currentDate}`
    } else {
      return `${formatMessage(m.operatingYearMsgFirst)} ${
        applicationAnswers.conditionalAbout.operatingYear
      }
      ${formatMessage(m.individualReceivedMsgSecond)} ${currentDate}`
    }
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
      </Box>
    </Box>
  )
}
