import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { formatText } from '@island.is/application/core'
import { getValueViaPath } from '@island.is/application/core'
import { institutionApplicationMessages as m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

const ReviewScreen: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  application,
}) => {
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

  const robotContraint = getValueViaPath(
    application.answers,
    'constraints.hasRobot',
  ) as string

  const legacyContraint = getValueViaPath(
    application.answers,
    'constraints.hasLegacy',
  ) as string

  const applyConstraintsText = getValueViaPath(
    application.answers,
    'constraints.apply',
  ) as string

  const myPagesConstraintsText = getValueViaPath(
    application.answers,
    'constraints.myPages',
  ) as string

  const certConstraintsText = getValueViaPath(
    application.answers,
    'constraints.cert',
  ) as string

  const legacyConstraintsText = getValueViaPath(
    application.answers,
    'constraints.legacy',
  ) as string

  const consultConstraintsText = getValueViaPath(
    application.answers,
    'constraints.consult',
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
  robotContraint &&
    servicesTextArr.push(
      formatText(
        m.constraints.constraintRobotLabel,
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

  legacyContraint &&
    servicesTextArr.push(
      formatText(
        m.constraints.constraintLegacyLabel,
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

  const getServiceDescriptionStack = (
    title: string,
    serviceName: string,
    description: string,
  ) => {
    return (
      <>
        <Box>
          {/* constraints information */}
          <Text variant="h5">
            {title} - {serviceName}
          </Text>
          <Text>{description}</Text>
        </Box>
        <Divider />
      </>
    )
  }

  const getServicesTextOutput = (): string => {
    let text = ''
    for (let i = 0; i < servicesTextArr?.length; i++) {
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
              {
                getValueViaPath(
                  application.answers,
                  'applicant.institutionEmail',
                ) as string
              }
            </Text>
          </Box>
          <Divider />
          <Box>
            <Text variant="h5">
              {formatText(
                m.review.sectionNameLabel,
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
                m.review.sectionEmailLabel,
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
                m.review.sectionPhoneLabel,
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
              <Text variant="h4">
                {formatText(
                  m.applicant.secondaryContactSubtitle,
                  application,
                  formatMessage,
                )}
              </Text>
              {secondaryContactName && (
                <>
                  <Text variant="h5">
                    {formatText(
                      m.review.sectionNameLabel,
                      application,
                      formatMessage,
                    )}
                  </Text>
                  <Text>{secondaryContactName}</Text>

                  <Divider />
                </>
              )}
              {secondaryContactEmail && (
                <>
                  <Box>
                    <Text variant="h5">
                      {formatText(
                        m.review.sectionEmailLabel,
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
                        m.review.sectionPhoneLabel,
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
          {servicesTextArr?.length > 0 && (
            <>
              <Box>
                {/* constraints information */}
                <Text variant="h5">
                  {formatText(
                    m.review.sectionServicesLabel,
                    application,
                    formatMessage,
                  )}
                </Text>

                <Text>{getServicesTextOutput()}</Text>
              </Box>
              <Divider />
            </>
          )}
          {applyConstraintsText?.length > 0 &&
            getServiceDescriptionStack(
              formatText(
                m.constraints.constraintsApplyingPlaceholder,
                application,
                formatMessage,
              ),
              formatText(
                m.constraints.constraintsApplyingLabel,
                application,
                formatMessage,
              ),
              applyConstraintsText,
            )}
          {myPagesConstraintsText?.length > 0 &&
            getServiceDescriptionStack(
              formatText(
                m.constraints.constraintsmyPagesPlaceholder,
                application,
                formatMessage,
              ),
              formatText(
                m.constraints.constraintsmyPagesLabel,
                application,
                formatMessage,
              ),
              myPagesConstraintsText,
            )}
          {certConstraintsText?.length > 0 &&
            getServiceDescriptionStack(
              formatText(
                m.constraints.constraintsCertPlaceholder,
                application,
                formatMessage,
              ),
              formatText(
                m.constraints.constraintsCertLabel,
                application,
                formatMessage,
              ),
              certConstraintsText,
            )}
          {legacyConstraintsText?.length > 0 &&
            getServiceDescriptionStack(
              formatText(
                m.constraints.constraintLegacyPlaceholder,
                application,
                formatMessage,
              ),
              formatText(
                m.constraints.constraintLegacyLabel,
                application,
                formatMessage,
              ),
              legacyConstraintsText,
            )}
          {consultConstraintsText?.length > 0 &&
            getServiceDescriptionStack(
              formatText(
                m.constraints.constraintsConsultPlaceholder,
                application,
                formatMessage,
              ),
              formatText(
                m.constraints.constraintsConsultLabel,
                application,
                formatMessage,
              ),
              consultConstraintsText,
            )}
          <Box>
            {/* terms of service*/}
            <Text variant="h5">
              {formatText(
                m.review.termsOfServiceLabel,
                application,
                formatMessage,
              )}
            </Text>
            <Text>
              {formatText(
                m.review.termsOfServiceText,
                application,
                formatMessage,
              )}
            </Text>
          </Box>
          {application?.state === 'approved' && <Box marginBottom={8} />}
        </Stack>
      </Stack>
    </Box>
  )
}
export default ReviewScreen
