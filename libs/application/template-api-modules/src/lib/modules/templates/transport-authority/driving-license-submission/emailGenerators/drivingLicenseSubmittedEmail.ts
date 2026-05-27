import includes from 'lodash/includes'
import { Message } from '@island.is/email-service'
import { DrivingLicenseApplicationFor } from '@island.is/application/templates/driving-license'
import { EmailTemplateGenerator } from '../../../../../types'
import { m } from './messages'
import {
  EmailComplete,
  EmailHeader,
  EmailNextSteps,
  EmailRequirements,
} from './EmailUi'
import { getValueViaPath } from '@island.is/application/core'
import { ExternalDataNationalRegistry } from '@island.is/application/templates/iceland-health/health-insurance'

type YesOrNoAnswer = Record<string, string> | string | string[]

export const generateDrivingLicenseSubmittedEmail: EmailTemplateGenerator = (
  props,
): Message => {
  const {
    application,
    options: { email = { sender: 'Ísland.is', address: 'no-reply@island.is' } },
  } = props

  const applicationFor =
    getValueViaPath<DrivingLicenseApplicationFor>(
      application.answers,
      'applicationFor',
    ) ?? 'B-full'

  const is65RenewalRedesignEnabled =
    getValueViaPath<boolean>(
      application.answers,
      'is65RenewalRedesignEnabled',
    ) === true

  // BE and the redesigned 65+ renewal don't have any in-person document
  // handoff — photos are selected from existing biometric records, and the
  // health certificate (when required) is uploaded with the application.
  // The legacy in-person requirements / pickup footer describe a flow that
  // doesn't apply, so show the digital-flow next-steps prose instead.
  // Legacy 65+ keeps the old email until the redesign flag has been fully
  // rolled out.
  const isDigitalDocumentFlow =
    applicationFor === 'BE' ||
    (applicationFor === 'B-full-renewal-65' && is65RenewalRedesignEnabled)

  const applicantEmail =
    getValueViaPath<string>(application.answers, 'email') ||
    getValueViaPath<string>(application.externalData, 'userProfile.data.email')

  if (!applicantEmail) {
    throw new Error('Cannot compose email message - Applicant has no email')
  }

  const willBringQualityPhoto =
    includes(
      getValueViaPath<YesOrNoAnswer>(
        application.answers,
        'willBringQualityPhoto',
      ),
      'yes',
    ) || applicationFor === 'B-temp'

  const willBringHealthCert = includes(
    getValueViaPath<YesOrNoAnswer>(application.answers, 'healthDeclaration'),
    'yes',
  )

  const nationalRegistryDetails = getValueViaPath<ExternalDataNationalRegistry>(
    application.externalData,
    'nationalRegistry',
  )
  const [firstName] = nationalRegistryDetails?.data?.fullName?.split(' ') ?? []

  const deliveryMethod = getValueViaPath<string>(
    application.answers,
    'delivery.deliveryMethod',
  )
  const isHomeDelivery = deliveryMethod === 'post'

  const selectedJurisdictionId = getValueViaPath<number>(
    application.answers,
    'delivery.jurisdiction',
  )

  const jurisdictions = getValueViaPath<{ name: string; id: number }[]>(
    application.externalData,
    'jurisdictions.data',
  )

  const jurisdictionInfo = jurisdictions?.find(
    (x) => x.id == selectedJurisdictionId,
  )

  const body = isDigitalDocumentFlow
    ? [
        ...EmailHeader({ applicationFor, firstName }),
        ...EmailNextSteps(applicationFor),
      ]
    : [
        ...EmailHeader({ applicationFor, firstName }),
        ...EmailRequirements(
          applicationFor,
          willBringQualityPhoto,
          willBringHealthCert,
        ),
        ...(willBringQualityPhoto || willBringHealthCert
          ? []
          : EmailComplete({
              selectedDistrictCommissioner: jurisdictionInfo?.name,
              isHomeDelivery,
            })),
      ]

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: applicantEmail,
      },
    ],
    subject: m.drivingLicenseSubject[applicationFor],
    template: {
      title: m.drivingLicenseSubject[applicationFor],
      body,
    },
  }
}
