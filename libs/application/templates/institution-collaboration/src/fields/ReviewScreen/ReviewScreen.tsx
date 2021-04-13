import React, { FC } from 'react'
import { FieldBaseProps, formatText } from '@island.is/application/core'
import { Box, Stack, Text, Divider } from '@island.is/island-ui/core'
import { getValueViaPath } from '@island.is/application/core'
import { useLocale } from '@island.is/localization'
import { institutionApplicationMessages as m } from '../../lib/messages'
import { Attachments } from './attachments'

const ReviewScreen: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const secondaryContactName = getValueViaPath(
    application.answers,
    'secondaryContact.name',
  ) as string
  const secondaryContactPhone = getValueViaPath(
    application.answers,
    'secondaryContact.phoneNumber',
  ) as string
  const secondaryContactEmail = getValueViaPath(
    application.answers,
    'secondaryContact.email',
  ) as string
  const hasSecondaryContact = [
    secondaryContactName,
    secondaryContactEmail,
    secondaryContactPhone,
  ].some((x) => !!x)

  const technicalConstraints = getValueViaPath(
    application.answers,
    'constraints.technical',
  ) as string
  const financialConstraints = getValueViaPath(
    application.answers,
    'constraints.financial',
  ) as string
  const timeConstraints = getValueViaPath(
    application.answers,
    'constraints.time',
  ) as string
  const shoppingConstraints = getValueViaPath(
    application.answers,
    'constraints.shopping',
  ) as string
  const moralConstraints = getValueViaPath(
    application.answers,
    'constraints.moral',
  ) as string
  const otherConstraints = getValueViaPath(
    application.answers,
    'constraints.other',
  ) as string

  const hasConstraints = [
    technicalConstraints,
    financialConstraints,
    timeConstraints,
    shoppingConstraints,
    moralConstraints,
    otherConstraints,
  ].some((x) => !!x)

  return (
    <Box marginTop={4}>
      <Stack space={7}>
        <Stack space={3}>
          {/* contact information */}
          <Text variant="h2">
            {formatText(m.applicant.sectionTitle, application, formatMessage)}
          </Text>
          <Box>
            <Text variant="h5">
              {formatText(
                m.applicant.institutionLabel,
                application,
                formatMessage,
              )}
            </Text>
            <Text>
              {
                getValueViaPath(
                  application.answers,
                  'applicant.institution',
                ) as string
              }
            </Text>
          </Box>
          <Divider />
          <Text variant="h4">
            {formatText(
              m.applicant.contactSubtitle,
              application,
              formatMessage,
            )}
          </Text>
          <Box>
            <Text variant="h5">
              {formatText(
                m.applicant.contactNameLabel,
                application,
                formatMessage,
              )}
            </Text>
            <Text>
              {getValueViaPath(application.answers, 'contact.name') as string}
            </Text>
          </Box>
          <Divider />
          <Box>
            <Text variant="h5">
              {formatText(
                m.applicant.contactEmailLabel,
                application,
                formatMessage,
              )}
            </Text>
            <Text>
              {getValueViaPath(application.answers, 'contact.email') as string}
            </Text>
          </Box>
          <Divider />
          <Box>
            <Text variant="h5">
              {formatText(
                m.applicant.contactPhoneLabel,
                application,
                formatMessage,
              )}
            </Text>
            <Text>
              {
                getValueViaPath(
                  application.answers,
                  'contact.phoneNumber',
                ) as string
              }
            </Text>
          </Box>
          {hasSecondaryContact && (
            <>
              <Divider />
              <Text variant="h4">
                {formatText(
                  m.applicant.secondaryContactSubtitle,
                  application,
                  formatMessage,
                )}
              </Text>
              {secondaryContactName && (
                <>
                  <Box>
                    <Text variant="h5">
                      {formatText(
                        m.applicant.contactNameLabel,
                        application,
                        formatMessage,
                      )}
                    </Text>
                    <Text>{secondaryContactName}</Text>
                  </Box>
                  <Divider />
                </>
              )}
              {secondaryContactEmail && (
                <>
                  <Box>
                    <Text variant="h5">
                      {formatText(
                        m.applicant.contactEmailLabel,
                        application,
                        formatMessage,
                      )}
                    </Text>
                    <Text>{secondaryContactEmail}</Text>
                  </Box>
                  <Divider />
                </>
              )}
              {secondaryContactPhone && (
                <>
                  <Box>
                    <Text variant="h5">
                      {formatText(
                        m.applicant.contactPhoneLabel,
                        application,
                        formatMessage,
                      )}
                    </Text>
                    <Text>{secondaryContactPhone}</Text>
                  </Box>
                  <Divider />
                </>
              )}
            </>
          )}
        </Stack>
        <Stack space={3}>
          {/* project information */}
          <Text variant="h2">
            {formatText(m.project.sectionTitle, application, formatMessage)}
          </Text>
          <Box>
            <Text variant="h5">
              {formatText(m.project.nameLabel, application, formatMessage)}
            </Text>
            <Text>
              {getValueViaPath(application.answers, 'project.name') as string}
            </Text>
          </Box>
          <Divider />
          <Box>
            <Text variant="h5">
              {formatText(
                m.project.backgroundLabel,
                application,
                formatMessage,
              )}
            </Text>
            <Text>
              {
                getValueViaPath(
                  application.answers,
                  'project.background',
                ) as string
              }
            </Text>
          </Box>
          <Divider />
          <Box>
            <Text variant="h5">
              {formatText(m.project.goalsLabel, application, formatMessage)}
            </Text>

            <Text>
              {getValueViaPath(application.answers, 'project.goals') as string}
            </Text>
          </Box>
          <Divider />
          <Box>
            <Text variant="h5">
              {formatText(m.project.scopeLabel, application, formatMessage)}
            </Text>
            <Text>
              {getValueViaPath(application.answers, 'project.scope') as string}
            </Text>
          </Box>
          <Divider />
          <Box>
            <Text variant="h5">
              {formatText(m.project.financeLabel, application, formatMessage)}
            </Text>
            <Text>
              {
                getValueViaPath(
                  application.answers,
                  'project.finance',
                ) as string
              }
            </Text>
          </Box>
        </Stack>
        {hasConstraints && (
          <Stack space={3}>
            {/* constraints information */}
            <Text variant="h2">
              {formatText(
                m.constraints.sectionTitle,
                application,
                formatMessage,
              )}
            </Text>
            {technicalConstraints && (
              <>
                <Box>
                  <Text variant="h5">
                    {formatText(
                      m.constraints.constraintsTechicalLabel,
                      application,
                      formatMessage,
                    )}
                  </Text>
                  <Text>{technicalConstraints}</Text>
                </Box>
                <Divider />
              </>
            )}
            {financialConstraints && (
              <>
                <Box>
                  <Text variant="h5">
                    {formatText(
                      m.constraints.constraintsFinancialLabel,
                      application,
                      formatMessage,
                    )}
                  </Text>
                  <Text>{financialConstraints}</Text>
                </Box>
                <Divider />
              </>
            )}
            {moralConstraints && (
              <>
                <Box>
                  <Text variant="h5">
                    {formatText(
                      m.constraints.constraintsMoralLabel,
                      application,
                      formatMessage,
                    )}
                  </Text>
                  <Text>{moralConstraints}</Text>
                </Box>
                <Divider />
              </>
            )}
            {timeConstraints && (
              <>
                <Box>
                  <Text variant="h5">
                    {formatText(
                      m.constraints.constraintsTimeLabel,
                      application,
                      formatMessage,
                    )}
                  </Text>
                  <Text>{timeConstraints}</Text>
                </Box>
                <Divider />
              </>
            )}
            {otherConstraints && (
              <>
                <Box>
                  <Text variant="h5">
                    {formatText(
                      m.constraints.constraintsOtherLabel,
                      application,
                      formatMessage,
                    )}
                  </Text>
                  <Text>{otherConstraints}</Text>
                </Box>
                <Divider />
              </>
            )}
          </Stack>
        )}
        <Stack space={3}>
          {/* stakeholders information */}
          <Text variant="h2">
            {formatText(
              m.stakeholders.sectionTitle,
              application,
              formatMessage,
            )}
          </Text>
          <Box>
            <Text variant="h5">
              {formatText(
                m.stakeholders.stakeholdersLabel,
                application,
                formatMessage,
              )}
            </Text>
            <Text>
              {getValueViaPath(application.answers, 'stakeholders') as string}
            </Text>
          </Box>
          <Divider />
          <Box>
            <Text variant="h5">
              {formatText(m.stakeholders.roleLabel, application, formatMessage)}
            </Text>
            <Text>
              {getValueViaPath(application.answers, 'role') as string}
            </Text>
          </Box>
          <Divider />
          <Box>
            <Text variant="h5">
              {formatText(
                m.stakeholders.otherRolesLabel,
                application,
                formatMessage,
              )}
            </Text>
            <Text>
              {getValueViaPath(application.answers, 'otherRoles') as string}
            </Text>
          </Box>
          <Divider />
          <Attachments application={application} />
        </Stack>
      </Stack>
    </Box>
  )
}
export default ReviewScreen
