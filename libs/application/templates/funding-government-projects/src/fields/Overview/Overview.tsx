import { MessageDescriptor } from '@formatjs/intl'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { project, informationAboutInstitution } from '../../lib/messages'
import { FundingGovernmentProjects } from '../../lib/dataSchema'

interface ValueLineProps {
  title?: MessageDescriptor | string
  value: string | number
  hasDivider?: boolean
}

const ValueLine = ({ title, value, hasDivider = true }: ValueLineProps) => {
  const { formatMessage } = useLocale()
  return (
    <>
      {title && (
        <Text variant="h5" marginBottom={1}>
          {typeof title == 'string' ? title : formatMessage(title)}
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
  const answers = application.answers as FundingGovernmentProjects
  const contactAnswer = answers.contacts
  const projectAnswer = answers.project
  return (
    <>
      <ValueLine
        title={
          informationAboutInstitution.general.infoInstitutionTextFieldTitle
        }
        value={answers.organizationOrInstitutionName}
      />
      {contactAnswer?.map((contact, index) => {
        return (
          <Box paddingBottom={3}>
            <Text marginBottom={1} variant="h5" key={`contact-${index}`}>
              {`${formatMessage(informationAboutInstitution.labels.contact)}
              ${index + 1}`}
            </Text>
            <Box marginBottom={3} key={`box-${index}`}>
              <Stack space={1}>
                <Text variant="h5">
                  {formatMessage(
                    informationAboutInstitution.labels.contactName,
                  )}
                </Text>
                <Text truncate key={`contactName-${index}`}>
                  {formatMessage(contact.name)}
                </Text>
                <Text variant="h5">
                  {formatMessage(
                    informationAboutInstitution.labels.contactEmail,
                  )}
                </Text>
                <Text key={`contactEmail-${index}`}>
                  {formatMessage(contact.email)}
                </Text>
                <Text variant="h5">
                  {formatMessage(
                    informationAboutInstitution.labels.contactPhoneNumber,
                  )}
                </Text>
                <Text key={`contactPhoneNumber-${index}`}>
                  {formatMessage(contact.phoneNumber)}
                </Text>
              </Stack>
            </Box>
            <Divider />
          </Box>
        )
      })}
      <Text variant="h5" marginBottom={3}>
        {formatMessage(project.general.pageTitle)}
      </Text>
      <ValueLine title={project.labels.title} value={projectAnswer.title} />
      <ValueLine title={project.labels.cost} value={projectAnswer.cost} />
      <ValueLine
        title={project.labels.years}
        value={projectAnswer.refundableYears}
      />
      <Text variant="h5" marginBottom={1}>
        {formatMessage(project.labels.attachments)}
      </Text>
      {projectAnswer.attachments.map((attachment) => {
        return (
          <>
            <Text>{attachment.name}</Text>
            <Box paddingY={3}>
              <Divider />
            </Box>
          </>
        )
      })}
    </>
  )
}
