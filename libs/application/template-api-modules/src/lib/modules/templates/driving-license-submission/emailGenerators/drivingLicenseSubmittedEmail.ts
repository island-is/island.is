import includes from 'lodash/includes'
import { Message } from '@island.is/email-service'
import { DrivingLicenseApplicationType } from '@island.is/api/domains/driving-license'
import { EmailTemplateGenerator } from '../../../../types'
import { m } from './messages'
import { EmailComplete, EmailHeader, EmailRequirements } from './EmailUi'
import { getValueViaPath } from '@island.is/application/core'
import { ExternalDataNationalRegistry } from '../types'

type YesOrNoAnswer = Record<string, string> | string | string[]

export const generateDrivingLicenseSubmittedEmail: EmailTemplateGenerator = (
  props,
): Message => {
  const {
    application,
    options: { email = { sender: 'Ísland.is', address: 'no-reply@island.is' } },
  } = props

  const applicationFor: DrivingLicenseApplicationType =
    (application.answers?.applicationFor as DrivingLicenseApplicationType) ??
    'B-full'

  const applicantEmail =
    getValueViaPath(application.answers, 'email') ||
    getValueViaPath(application.externalData, 'userProfile.data.email')

  const willBringQualityPhoto =
    includes(
      application.answers?.willBringQualityPhoto as YesOrNoAnswer,
      'yes',
    ) || applicationFor === 'B-temp'

  const willBringHealthCert = includes(
    application.answers?.healthDeclaration as YesOrNoAnswer,
    'yes',
  )

  const firstName = (application.externalData
    ?.nationalRegistry as ExternalDataNationalRegistry).data?.fullName?.split(
    ' ',
  )[0]

  const selectedJuristictionId = getValueViaPath<number>(
    application.answers,
    'juristiction',
  )

  const juristictions = getValueViaPath<{ name: string; id: number }[]>(
    application.externalData,
    'juristictions.data',
  )

  if (!juristictions || !selectedJuristictionId) {
    throw new Error(
      'no juristiction or selected juristication ID - not handled',
    )
  }

  const juristictionInfo = juristictions.find(
    (x) => x.id == selectedJuristictionId,
  )

  return {
    from: {
      name: email.sender,
      address: email.address,
    },
    to: [
      {
        name: '',
        address: applicantEmail as string,
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
              selectedDistrictCommissioner: juristictionInfo?.name,
            })),
      ],
    },
  }
}
