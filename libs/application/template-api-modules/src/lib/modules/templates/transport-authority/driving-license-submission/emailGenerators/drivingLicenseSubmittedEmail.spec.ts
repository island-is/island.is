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

  it('sends the 65+ wording product asked for', () => {
    // The tests around this one compare against EmailHeader/EmailNextSteps
    // themselves, so they pass whatever the copy says. This pins the text.
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
    const body = result?.template?.body ?? []
    const copy = (text: string, bold = false) => ({
      component: 'Copy',
      context: {
        copy: text,
        align: 'left',
        small: true,
        ...(bold ? { style: 'bold' } : {}),
      },
    })

    expect(body[1]).toMatchObject({
      component: 'Heading',
      context: {
        copy: 'Umsókn þín um endurnýjun ökuskírteinis hefur verið móttekin',
        eyebrow: 'Góðan dag Jón',
      },
    })
    expect(body.slice(2)).toEqual([
      copy('Yfirferð læknisvottorðs', true),
      copy(
        'Fylgi læknisvottorð umsókninni verður það yfirfarið og uppfylli það ekki skilyrði gæti umsókninni verið hafnað.',
      ),
      copy(
        'Sé umsókninni hafnað þarf að óska eftir endurgreiðslu með því að senda tölvupóst á endurgreidsla@island.is og gera svo aðra umsókn þar sem gild gögn fylgja með.',
      ),
      copy('Pöntun og afhending ökuskírteinis', true),
      copy(
        'Þegar umsóknin hefur verið samþykkt verður ökuskírteinið pantað. Afhending fer eftir því sem valið er í umsóknarferlinu.',
      ),
      {
        component: 'List',
        context: {
          items: [
            'Skírteinið verður sent til þín, eða',
            'þú sækir það á þann afgreiðslustað sem þú valdir.',
          ],
        },
      },
    ])
  })

  it('keeps the shared greeting for BE', () => {
    const result = generateDrivingLicenseSubmittedEmail({
      application: {
        ...application,
        answers: { ...application.answers, applicationFor: 'BE' },
      },
      options,
    })

    expect(result?.template?.body?.[1]).toMatchObject({
      context: { eyebrow: 'Góðan daginn Jón' },
    })
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
