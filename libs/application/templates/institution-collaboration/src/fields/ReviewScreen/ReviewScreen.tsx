import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'

import { FC } from 'react'
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
    'constraints.hasMail',
  ) as string
  const loginConstraints = getValueViaPath(
    application.answers,
    'constraints.hasLogin',
  ) as string
  const straumurConstraints = getValueViaPath(
    application.answers,
    'constraints.hasStraumur',
  ) as string
  const websiteConstraints = getValueViaPath(
    application.answers,
    'constraints.hasWebsite',
  ) as string
  const applyConstraints = getValueViaPath(
    application.answers,
    'constraints.hasApply',
  ) as string
  const myPageConstraints = getValueViaPath(
    application.answers,
    'constraints.hasMyPages',
  ) as string
  const certConstraint = getValueViaPath(
    application.answers,
    'constraints.hasCert',
  ) as string
  const consultContraint = getValueViaPath(
    application.answers,
    'constraints.hasConsult',
  ) as string

  //#region Services Text
  const servicesTextArr: string[] = []
  mailConstraints &&
    servicesTextArr.push(
      formatText(
        m.constraints.constraintsMailLabel,
        application,
        formatMessage,
      ),
    )
  loginConstraints &&
    servicesTextArr.push(
      formatText(
        m.constraints.constraintsLoginLabel,
        application,
        formatMessage,
      ),
    )
  straumurConstraints &&
    servicesTextArr.push(
      formatText(
        m.constraints.constraintsStraumurLabel,
        application,
        formatMessage,
      ),
    )
  websiteConstraints &&
    servicesTextArr.push(
      formatText(
        m.constraints.constraintsWebsiteLabel,
        application,
        formatMessage,
      ),
    )
  applyConstraints &&
    servicesTextArr.push(
      formatText(
        m.constraints.constraintsApplyingLabel,
        application,
        formatMessage,
      ),
    )
  myPageConstraints &&
    servicesTextArr.push(
      formatText(
        m.constraints.constraintsmyPagesLabel,
        application,
        formatMessage,
      ),
    )
  certConstraint &&
    servicesTextArr.push(
      formatText(
        m.constraints.constraintsCertLabel,
        application,
        formatMessage,
      ),
    )
  consultContraint &&
    servicesTextArr.push(
      formatText(
        m.constraints.constraintsConsultLabel,
        application,
        formatMessage,
      ),
    )

  //#endregion Services Text

  console.log(servicesTextArr)

  function getServicesTextOutput(): string {
    let text = ''
    for (let i = 0; i < servicesTextArr.length; i++) {
      text += servicesTextArr[i]
      if (i !== servicesTextArr.length - 1) {
        text += ', '
      }
    }
    return text
  }

  return (
    <Box marginTop={4}>
      <Stack space={7}>
        <Stack space={3}>
          {/* contact information */}
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
          <Box>
            <Text variant="h5">
              {formatText(
                m.applicant.contactInstitutionEmailLabel,
                application,
                formatMessage,
              )}
            </Text>
            <Text>
              {getValueViaPath(application.answers, 'contact.institutionEmail') as string}
            </Text>
          </Box>
          <Divider />
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
          <Divider />
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

        {servicesTextArr.length > 0 && (
          <Stack space={3}>
            {/* constraints information */}
            <Text variant="h5">
              {formatText(
                m.constraints.sectionTitle,
                application,
                formatMessage,
              )}
            </Text>
            <Box>
              <Text>{getServicesTextOutput()}</Text>
            </Box>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}
export default ReviewScreen
