import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import React, { FC } from 'react'

import { Attachments } from './attachments'
import { FieldBaseProps } from '@island.is/application/types'
import { formatText } from '@island.is/application/core'
import { getValueViaPath } from '@island.is/application/core'
import { institutionApplicationMessages as m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

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

  const mailConstraints = getValueViaPath(
    application.answers,
    'constraints.mail',
  ) as string
  const loginConstraints = getValueViaPath(
    application.answers,
    'constraints.login',
  ) as string
  const straumurConstraints = getValueViaPath(
    application.answers,
    'constraints.straumur',
  ) as string
  const websiteConstraints = getValueViaPath(
    application.answers,
    'constraints.website',
  ) as string
  const applyConstraints = getValueViaPath(
    application.answers,
    'constraints.apply',
  ) as string
  const myPageConstraints = getValueViaPath(
    application.answers,
    'constraints.myPages',
  ) as string

  const hasConstraints = [
    mailConstraints,
    loginConstraints,
    straumurConstraints,
    websiteConstraints,
    applyConstraints,
    myPageConstraints,
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
                  'applicant.institution.label',
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
            {mailConstraints && (
              <>
                <Box>
                  <Text variant="h5">
                    {formatText(
                      m.constraints.constraintsMailLabel,
                      application,
                      formatMessage,
                    )}
                  </Text>
                  <Text>{mailConstraints}</Text>
                </Box>
                <Divider />
              </>
            )}
            {loginConstraints && (
              <>
                <Box>
                  <Text variant="h5">
                    {formatText(
                      m.constraints.constraintsLoginLabel,
                      application,
                      formatMessage,
                    )}
                  </Text>
                  <Text>{loginConstraints}</Text>
                </Box>
                <Divider />
              </>
            )}
            {straumurConstraints && (
              <>
                <Box>
                  <Text variant="h5">
                    {formatText(
                      m.constraints.constraintsStraumurLabel,
                      application,
                      formatMessage,
                    )}
                  </Text>
                  <Text>{straumurConstraints}</Text>
                </Box>
                <Divider />
              </>
            )}
            {websiteConstraints && (
              <>
                <Box>
                  <Text variant="h5">
                    {formatText(
                      m.constraints.constraintsWebsiteLabel,
                      application,
                      formatMessage,
                    )}
                  </Text>
                  <Text>{websiteConstraints}</Text>
                </Box>
                <Divider />
              </>
            )}
            {applyConstraints && (
              <>
                <Box>
                  <Text variant="h5">
                    {formatText(
                      m.constraints.constraintsApplyingLabel,
                      application,
                      formatMessage,
                    )}
                  </Text>
                  <Text>{applyConstraints}</Text>
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
