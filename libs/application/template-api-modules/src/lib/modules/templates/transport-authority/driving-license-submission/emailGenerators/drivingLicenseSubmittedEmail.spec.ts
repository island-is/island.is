import type { User } from '@island.is/auth-nest-tools'
import {
  ApplicationStatus,
  ApplicationTypes,
} from '@island.is/application/types'
import { createApplication } from '@island.is/application/testing'
import { createCurrentUser } from '@island.is/testing/fixtures'
import { faker } from '@island.is/shared/mocking'

import { generateDrivingLicenseSubmittedEmail } from './drivingLicenseSubmittedEmail'
import {
  EmailComplete,
  EmailHeader,
  EmailNextSteps,
  EmailRequirements,
} from './EmailUi'
import { EmailTemplateGeneratorProps } from '../../../../../types'

describe('driving license submission', () => {
  let user: User
  let application: ReturnType<typeof createApplication>
  let options: EmailTemplateGeneratorProps['options']

  beforeEach(() => {
    user = createCurrentUser()

    application = createApplication({
      answers: {
        certificate: 'yes',
        willBringQualityPhoto: 'yes',
        delivery: {
          jurisdiction: 1,
        },
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
      id: 'test-application-id',
      state: '',
      typeId: ApplicationTypes.DRIVING_LICENSE,
      name: '',
      status: ApplicationStatus.IN_PROGRESS,
    })

    options = {
      clientLocationOrigin: 'http://localhost',
      locale: 'is',
      email: {
        address: 'no-reply@island.is',
        sender: 'Ísland.is',
      },
    }
  })

  afterEach(() => {
    // Clean up references to prevent memory leaks
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user = null as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    application = null as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options = null as any
  })

  it('should generate an email template', () => {
    const result = generateDrivingLicenseSubmittedEmail({
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

    const willBringQualityPhoto = false
    const willBringHealthCert = true

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

  it('generates a BE email with next-steps prose and no in-person requirements', () => {
    const result = generateDrivingLicenseSubmittedEmail({
      application: {
        ...application,
        answers: {
          ...application.answers,
          applicationFor: 'BE',
        },
      },
      options,
    })

    const generated = [
      ...EmailHeader({ applicationFor: 'BE', firstName: 'Jón' }),
      ...EmailNextSteps('BE'),
    ]

    expect(result?.template?.body).toEqual(generated)
  })

  it('generates a redesigned 65+ renewal email with next-steps prose', () => {
    const result = generateDrivingLicenseSubmittedEmail({
      application: {
        ...application,
        answers: {
          ...application.answers,
          applicationFor: 'B-full-renewal-65',
          is65RenewalRedesignEnabled: true,
        },
      },
      options,
    })

    const generated = [
      ...EmailHeader({
        applicationFor: 'B-full-renewal-65',
        firstName: 'Jón',
      }),
      ...EmailNextSteps('B-full-renewal-65'),
    ]

    expect(result?.template?.body).toEqual(generated)
  })

  it('keeps the legacy 65+ renewal email without next-steps prose', () => {
    const result = generateDrivingLicenseSubmittedEmail({
      application: {
        ...application,
        answers: {
          ...application.answers,
          applicationFor: 'B-full-renewal-65',
          is65RenewalRedesignEnabled: false,
        },
      },
      options,
    })

    const willBringQualityPhoto = true
    const willBringHealthCert = true

    const generated = [
      ...EmailHeader({
        applicationFor: 'B-full-renewal-65',
        firstName: 'Jón',
      }),
      ...EmailRequirements(
        'B-full-renewal-65',
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
