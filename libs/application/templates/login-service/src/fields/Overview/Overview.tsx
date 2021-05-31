import { MessageDescriptor } from '@formatjs/intl'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Divider, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { LoginService } from '../../lib/dataSchema'
import { applicant, technicalContact, technicalInfo } from '../../lib/messages'

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
          technicalContact.general.pageTitle,
          application,
          formatMessage,
        )}
      </Text>
      {answers.technicalContact.name && (
        <ValueLine
          title={technicalContact.labels.name}
          value={answers.technicalContact.name}
        />
      )}
      {answers.technicalContact.email && (
        <ValueLine
          title={technicalContact.labels.email}
          value={answers.technicalContact.email}
        />
      )}
      {answers.technicalContact.phoneNumber && (
        <ValueLine
          title={technicalContact.labels.tel}
          value={answers.technicalContact.phoneNumber}
        />
      )}
      <ValueLine
        title={technicalContact.labels.techAnnouncementsEmail}
        value={answers.technicalContact.techAnnouncementsEmail}
      />
      <Text variant="h2" marginTop={3} marginBottom={3}>
        {formatText(
          technicalInfo.general.pageTitle,
          application,
          formatMessage,
        )}
      </Text>
      <ValueLine
        title={technicalInfo.labels.type}
        value={answers.technicalInfo.type}
      />
      {answers.technicalInfo.devReturnUrl && (
        <ValueLine
          title={technicalInfo.labels.devReturnUrl}
          value={answers.technicalInfo.devReturnUrl}
        />
      )}
      {answers.technicalInfo.stagingReturnUrl && (
        <ValueLine
          title={technicalInfo.labels.stagingReturnUrl}
          value={answers.technicalInfo.stagingReturnUrl}
        />
      )}
      <ValueLine
        title={technicalInfo.labels.prodReturnUrl}
        value={answers.technicalInfo.prodReturnUrl}
      />
    </>
  )
}
