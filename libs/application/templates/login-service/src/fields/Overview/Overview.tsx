import { MessageDescriptor } from '@formatjs/intl'
import { formatText } from '@island.is/application/core'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { LoginService } from '../../lib/dataSchema'
import { applicant, technicalAnnouncements, terms } from '../../lib/messages'

interface ValueLineProps {
  title?: MessageDescriptor
  value: string
  hasDivider?: boolean
}

const ValueLine = ({ title, value, hasDivider = true }: ValueLineProps) => {
  const { formatMessage } = useLocale()
  return (
    <>
      {title && (
        <Text variant="h5" marginBottom={1}>
          {formatMessage(title)}
        </Text>
      )}
      <Text>{value}</Text>
      {hasDivider && (
        <Box paddingY={3}>
          <Divider />
        </Box>
      )}
    </>
  )
}

export const Overview = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()
  const answers = application.answers as LoginService

  return (
    <>
      <Text variant="h2" marginBottom={3}>
        {formatMessage(terms.general.pageTitle)}
      </Text>
      <ValueLine
        title={terms.labels.termsAgreementApprovalForOverview}
        value={formatMessage(terms.labels.yesLabel)}
      />
      <Text variant="h2" marginBottom={3}>
        {formatText(applicant.general.pageTitle, application, formatMessage)}
      </Text>
      <ValueLine
        title={applicant.labels.nameDescription}
        value={answers.applicant.name}
      />
      <ValueLine
        title={applicant.labels.nationalId}
        value={answers.applicant.nationalId}
      />
      <ValueLine
        title={applicant.labels.typeOfOperation}
        value={answers.applicant.typeOfOperation}
      />
      <Text variant="h4" marginTop={3} marginBottom={2}>
        {formatText(
          applicant.labels.responsiblePartyTitle,
          application,
          formatMessage,
        )}
      </Text>
      <ValueLine
        title={applicant.labels.responsiblePartyName}
        value={answers.applicant.responsiblePartyName}
      />
      <ValueLine
        title={applicant.labels.responsiblePartyEmail}
        value={answers.applicant.responsiblePartyEmail}
      />
      <ValueLine
        title={applicant.labels.responsiblePartyTel}
        value={answers.applicant.responsiblePartyTel}
      />
      <Text variant="h2" marginTop={3} marginBottom={3}>
        {formatText(
          technicalAnnouncements.general.pageTitle,
          application,
          formatMessage,
        )}
      </Text>
      {answers.technicalAnnouncements.email && (
        <ValueLine
          title={technicalAnnouncements.labels.email}
          value={answers.technicalAnnouncements.email}
        />
      )}
      {answers.technicalAnnouncements.phoneNumber && (
        <ValueLine
          title={technicalAnnouncements.labels.tel}
          value={answers.technicalAnnouncements.phoneNumber}
        />
      )}
      {answers.technicalAnnouncements.type && (
        <ValueLine
          title={technicalAnnouncements.labels.type}
          value={answers.technicalAnnouncements.type}
        />
      )}
    </>
  )
}
