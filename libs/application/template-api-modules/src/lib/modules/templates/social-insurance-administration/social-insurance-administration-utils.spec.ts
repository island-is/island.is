import {
  Employer,
  RatioType,
} from '@island.is/application/templates/social-insurance-administration/old-age-pension'
import {
  ApplicationWithAttachments as Application,
  ApplicationStatus,
  ApplicationTypes,
  ExternalData,
  FormValue,
} from '@island.is/application/types'
import { NO, YES } from '@island.is/application/core'
import {
  getMonthNumber,
  getEmployers,
  transformApplicationToOldAgePensionDTO,
} from './social-insurance-administration-utils'

describe('Old age pesion utils', () => {
  it('should return 3 for March', () => {
    expect(getMonthNumber('March')).toBe(3)
  })
})

describe('getEmployers', () => {
  it('should return ratio and ratioMonthly as numbers, only phoneNumber if there is any and only the months that where put in in ratioMontly', () => {
    const employersAnswers: Employer[] = [
      {
        email: 'vinnuveitandi@mail.is',
        rawIndex: 0,
        ratioType: RatioType.YEARLY,
        phoneNumber: '',
        ratioYearly: '23',
        ratioMonthly: {},
      },
      {
        email: 'vinna@mail.is',
        rawIndex: 0,
        ratioType: RatioType.YEARLY,
        phoneNumber: '7777777',
        ratioYearly: '10',
        ratioMonthly: {},
      },
      {
        email: 'fajefja@bs.is',
        ratioType: RatioType.MONTHLY,
        phoneNumber: '8888888',
        ratioYearly: '',
        ratioMonthly: {
          april: '12',
          march: '12',
          january: '12',
          february: '12',
        },
        ratioMonthlyAvg: '4',
      },
    ]

    const employerInfo = [
      {
        email: 'vinnuveitandi@mail.is',
        ratio: 23,
      },
      {
        email: 'vinna@mail.is',
        phoneNumber: '7777777',
        ratio: 10,
      },
      {
        email: 'fajefja@bs.is',
        phoneNumber: '8888888',
        ratio: 4,
        ratioMonthly: {
          january: 12,
          february: 12,
          march: 12,
          april: 12,
        },
      },
    ]

    const res = getEmployers(employersAnswers)

    expect(res).toEqual(employerInfo)
  })
})

describe('transformApplicationToOldAgePensionDTO', () => {
  const buildApplication = (answers: FormValue): Application => ({
    id: '12345',
    assignees: [],
    applicant: '0101307789',
    typeId: ApplicationTypes.OLD_AGE_PENSION,
    created: new Date(),
    modified: new Date(),
    attachments: {},
    applicantActors: [],
    answers: {
      period: { year: '2026', month: 'January' },
      ...answers,
    },
    state: 'draft',
    externalData: {} as ExternalData,
    status: ApplicationStatus.IN_PROGRESS,
  })

  it('should omit awarenessOfIncomeDeclaration when the income plan was skipped', () => {
    // A single yearly payment skips the income plan screens, so the applicant
    // is never asked to declare anything about other income.
    const application = buildApplication({
      onePaymentPerYear: { question: YES },
      incomePlanTable: [],
    })

    const res = transformApplicationToOldAgePensionDTO(application, [])

    expect(res.hasOneTimePayment).toBe(true)
    expect(res.incomePlan.incomeTypes).toEqual([])
    expect(res).not.toHaveProperty('awarenessOfIncomeDeclaration')
  })

  it('should send awarenessOfIncomeDeclaration when an all-zero income plan was filled in', () => {
    const application = buildApplication({
      onePaymentPerYear: { question: NO },
      incomePlanTable: [
        {
          incomeCategory: 'Atvinnutekjur',
          incomeType: 'Launatekjur',
          income: 'yearly',
          incomePerYear: '0',
          currency: 'ISK',
        },
      ],
      incomePlan: { noOtherIncomeConfirmation: YES },
    })

    const res = transformApplicationToOldAgePensionDTO(application, [])

    expect(res.hasOneTimePayment).toBe(false)
    expect(res.awarenessOfIncomeDeclaration).toBe(true)
  })
})
