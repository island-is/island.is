import includes from 'lodash/includes'
import { Message } from '@island.is/email-service'
import { DrivingLicenseApplicationFor } from '@island.is/application/templates/driving-license'
import { EmailTemplateGenerator } from '../../../../../types'
import { m } from './messages'
import { EmailComplete, EmailHeader, EmailRequirements } from './EmailUi'
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
      body: [
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
      ],
    },
  }
}
