import type { User } from '@island.is/auth-nest-tools'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { createApplication } from '@island.is/application/testing'
import { Message } from '@island.is/email-service'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { faker } from '@island.is/shared/mocking'

import { generateDrivingLicenseSubmittedEmail } from './drivingLicenseSubmittedEmail'
import { EmailComplete, EmailHeader, EmailRequirements } from './EmailUi'
import { EmailTemplateGeneratorProps } from '../../../../types'

let id = 0

const user: User = createCurrentUser()

const application = createApplication({
  answers: {
    certificate: 'yes',
    willBringQualityPhoto: 'yes',
    jurisdiction: 1,
    healthDeclaration: {
      a: 'no',
      b: 'yes',
    },
    email: faker.internet.email(),
  },
  applicant: user.nationalId,
  assignees: [],
  applicantActors: [],
  attachments: {},
  created: new Date(),
  modified: new Date(),
  externalData: {
    jurisdictions: {
      status: 'success',
      date: new Date(),
      data: [{ id: 1, zip: '101', name: 'Sýslumaðurinn' }],
    },
    nationalRegistry: {
      status: 'success',
      date: new Date(),
      data: {
        fullName: 'Jón Jónsson',
      },
    },
  },
  id: (id++).toString(),
  state: '',
  typeId: ApplicationTypes.DRIVING_LICENSE,
  name: '',
  status: ApplicationStatus.IN_PROGRESS,
})

describe('driving license submission', () => {
  let willBringQualityPhoto: boolean
  let willBringHealthCert: boolean
  let result: Message
  let options: EmailTemplateGeneratorProps['options']

  beforeEach(() => {
    options = {
      clientLocationOrigin: 'http://localhost',
      locale: 'is',
      email: {
        address: 'no-reply@island.is',
        sender: 'Ísland.is',
      },
    }
  })

  it('should generate an email template', () => {
    result = generateDrivingLicenseSubmittedEmail({
      application: {
        ...application,
        answers: {
          ...application.answers,
          willBringQualityPhoto: 'no',
          jurisdiction: 1,
          healthDeclaration: {
            a: 'yes',
            b: 'no',
          },
        },
      },
      options,
    })

    willBringQualityPhoto = false
    willBringHealthCert = true

    const generated = [
      ...EmailHeader({ firstName: 'Jón' }),
      ...EmailRequirements(
        'B-full',
        willBringQualityPhoto,
        willBringHealthCert,
      ),
      ...(willBringQualityPhoto || willBringHealthCert
        ? []
        : EmailComplete({ selectedDistrictCommissioner: 'Sýslumaðurinn' })),
    ]

    expect(result?.template?.body).toEqual(generated)
  })
})
