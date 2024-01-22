import {
  Employer,
  RatioType,
} from '@island.is/application/templates/social-insurance-administration/old-age-pension'
import {
  getMonthNumber,
  getEmployers,
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
