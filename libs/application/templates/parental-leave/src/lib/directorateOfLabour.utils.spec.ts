import getDaysInMonth from 'date-fns/getDaysInMonth'

import {
  calculateNumberOfDaysForOnePeriod,
  calculateRemainingNumberOfDays,
  calculatePeriodLength,
  daysToMonths,
  DAYS_IN_MONTH,
  calculateMaxPercentageForPeriod,
} from './directorateOfLabour.utils'

describe('monthsToDays', () => {
  it('should return 6 months for the default period', () => {
    const months = 6
    const days = DAYS_IN_MONTH * months

    expect(daysToMonths(days)).toBe(6)
  })

  it('should return 4.5 months for the minimum period', () => {
    const months = 6
    const days = DAYS_IN_MONTH * months
    const givenDays = 45
    const sub = days - givenDays

    expect(daysToMonths(sub)).toBe(4.5)
  })

  it('should return 6.5 months for the default period and half a month more', () => {
    const months = 6
    const days = DAYS_IN_MONTH * months
    const requestedDays = 15
    const sum = days + requestedDays

    expect(daysToMonths(sum)).toBe(6.5)
  })

  it('should return 7.5 months for the maximum period available', () => {
    const months = 6
    const days = DAYS_IN_MONTH * months
    const requestedDays = 45
    const sum = days + requestedDays

    expect(daysToMonths(sum)).toBe(7.5)
  })
})

describe('calculateNumberOfDaysForOnePeriod', () => {
  it('should calculate zero days when the start and end dates are the same', () => {
    const start = new Date(2021, 3, 26)
    const end = new Date(2021, 3, 26)

    expect(calculateNumberOfDaysForOnePeriod(start, end)).toBe(0)
  })

  it('should throw an error if end date is before start date', () => {
    const start = new Date(2021, 3, 26)
    const end = new Date(2021, 3, 25)

    expect(() => {
      calculateNumberOfDaysForOnePeriod(start, end)
    }).toThrow()
  })

  it('should calculate 46 days between january 14th 2021 and february 28th 2021', () => {
    const start = new Date(2021, 0, 14)
    const end = new Date(2021, 1, 28)

    expect(calculateNumberOfDaysForOnePeriod(start, end)).toBe(46)
  })

  it('should calculate 45 days between january 14th 2020 and february 28th 2020', () => {
    const start = new Date(2020, 0, 14)
    const end = new Date(2020, 1, 28)

    expect(calculateNumberOfDaysForOnePeriod(start, end)).toBe(45)
  })

  it('should calculate 45 days between february 14th 2021 and march 31st 2021', () => {
    const start = new Date(2021, 1, 14)
    const end = new Date(2021, 2, 31)

    expect(calculateNumberOfDaysForOnePeriod(start, end)).toBe(45)
  })

  it('should calculate 46 days between february 14th 2020 and march 31st 2020', () => {
    const start = new Date(2020, 1, 14)
    const end = new Date(2020, 2, 31)

    expect(calculateNumberOfDaysForOnePeriod(start, end)).toBe(46)
  })

  it('should calculate 90 days to the start date Date(2021, 5, 20)', () => {
    const start = new Date(2021, 5, 20)
    const end = new Date(2021, 8, 20)

    expect(calculateNumberOfDaysForOnePeriod(start, end)).toBe(90)
  })

  it('should calculate 180 days to the start date Date(2021, 0, 15)', () => {
    const start = new Date(2021, 0, 15)
    const end = new Date(2021, 6, 15)

    expect(calculateNumberOfDaysForOnePeriod(start, end)).toBe(180)
  })

  it('should calculate 270 days to the start date Date(2021, 0, 1)', () => {
    const start = new Date(2021, 0, 1)
    const end = new Date(2021, 8, 31)

    expect(calculateNumberOfDaysForOnePeriod(start, end)).toBe(270)
  })

  it('should calculate periods when start month has more days than end month', () => {
    const year = 2021

    expect(
      calculateNumberOfDaysForOnePeriod(
        new Date(year, 0, 31),
        new Date(year, 1, 28),
      ),
    ).toBe(30)

    expect(
      calculateNumberOfDaysForOnePeriod(
        new Date(year, 0, 28),
        new Date(year, 1, 28),
      ),
    ).toBe(33)

    expect(
      calculateNumberOfDaysForOnePeriod(
        new Date(year, 1, 28),
        new Date(year, 2, 31),
      ),
    ).toBe(30)

    expect(
      calculateNumberOfDaysForOnePeriod(
        new Date(year, 1, 28),
        new Date(year, 3, 15),
      ),
    ).toBe(45)

    expect(
      calculateNumberOfDaysForOnePeriod(
        new Date(year, 3, 30),
        new Date(year, 5, 15),
      ),
    ).toBe(45)

    expect(
      calculateNumberOfDaysForOnePeriod(
        new Date(year, 5, 19),
        new Date(year, 7, 4),
      ),
    ).toBe(45)
  })

  it('should calculate 30 days between dates with one calendar month in between', () => {
    const year = 2021

    for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
      const daysInMonth = getDaysInMonth(new Date(year, monthIndex))
      const daysInNextMonth = getDaysInMonth(new Date(year, monthIndex + 1))

      for (let dayIndex = 1; dayIndex <= daysInMonth; dayIndex += 1) {
        if (
          daysInNextMonth < dayIndex &&
          daysInMonth <= 30 &&
          daysInNextMonth <= 30
        ) {
          expect(
            calculateNumberOfDaysForOnePeriod(
              new Date(year, monthIndex, dayIndex),
              new Date(year, monthIndex + 1, dayIndex),
            ),
          ).toBe(30)
        }
      }
    }
  })
})

describe('calculateRemainingNumberOfDays', () => {
  const mockUser = {
    applicationId: 'applicationId',
    applicant: '1234567890',
    otherParentId: '1234567891',
    expectedDateOfBirth: '2016-10-19',
    dateOfBirth: '2016-10-18',
    email: 'email@gmail.com',
    phoneNumber: 'phoneNumber',
    paymentInfo: {
      bankAccount: 'bankAccount',
      personalAllowance: 0,
      personalAllowanceFromSpouse: 0,
      union: { id: 'ID', name: 'Union' },
      pensionFund: { id: 'ID', name: 'Pension fund' },
      privatePensionFund: {
        id: 'ID',
        name: 'privatePensionFund',
      },
      privatePensionFundRatio: 0,
    },
    employers: [{ email: null, nationalRegistryId: 'nationalRegistryId' }],
    status: 'In Process',
    rightsCode: null,
  }

  const parentalLeaves = [
    {
      ...mockUser,
      expectedDateOfBirth: '2016-10-19',
      dateOfBirth: '2016-10-18',
      periods: [
        {
          from: '2016-10-01',
          to: '2016-10-31',
          ratio: 100,
          approved: true,
          paid: true,
        },
        {
          from: '2016-11-01',
          to: '2016-11-30',
          ratio: 100,
          approved: true,
          paid: true,
        },
        {
          from: '2016-12-01',
          to: '2016-12-31',
          ratio: 100,
          approved: true,
          paid: true,
        },
        {
          from: '2017-03-01',
          to: '2017-03-31',
          ratio: 100,
          approved: true,
          paid: true,
        },
        {
          from: '2017-04-01',
          to: '2017-04-30',
          ratio: 100,
          approved: true,
          paid: true,
        },
      ],
    },
    {
      ...mockUser,
      expectedDateOfBirth: '2017-10-02',
      dateOfBirth: '2017-10-06',
      periods: [
        {
          from: '2017-10-01',
          to: '2017-10-31',
          ratio: 100,
          approved: true,
          paid: true,
        },
        {
          from: '2017-11-01',
          to: '2017-11-30',
          ratio: 100,
          approved: true,
          paid: false,
        },
        {
          from: '2017-12-01',
          to: '2017-12-31',
          ratio: 100,
          approved: true,
          paid: false,
        },
        {
          from: '2018-01-01',
          to: '2018-01-31',
          ratio: 100,
          approved: true,
          paid: false,
        },
        {
          from: '2018-02-01',
          to: '2018-02-28',
          ratio: 100,
          approved: true,
          paid: false,
        },
        {
          from: '2018-03-01',
          to: '2018-03-31',
          ratio: 100,
          approved: true,
          paid: false,
        },
      ],
    },
    {
      ...mockUser,
      expectedDateOfBirth: '2019-02-03',
      dateOfBirth: '2019-02-06',
      periods: [
        {
          from: '2019-05-01',
          to: '2019-05-31',
          ratio: 50,
          approved: true,
          paid: true,
        },
        {
          from: '2019-06-01',
          to: '2019-06-30',
          ratio: 50,
          approved: true,
          paid: false,
        },
        {
          from: '2019-07-01',
          to: '2019-07-31',
          ratio: 50,
          approved: true,
          paid: false,
        },
      ],
    },
  ]

  const availableRights = { independentMonths: 6, transferableMonths: 1.5 }
  const unavailableRights = { independentMonths: 0, transferableMonths: 0 }
  const firstDob = '2016-10-18'
  const secondDob = '2017-10-06'
  const thirdDob = '2019-02-06'

  it('should return 0 days when the date of birth is null', () => {
    expect(
      calculateRemainingNumberOfDays(null, parentalLeaves, availableRights),
    ).toBe(0)
  })

  it('should return 0 days when there is no independentMonths rights available', () => {
    expect(
      calculateRemainingNumberOfDays(
        firstDob,
        parentalLeaves,
        unavailableRights,
      ),
    ).toBe(0)
  })

  it('should return 30 days for the first date of birth when the amount of days for each period are not equal to the maximum amount of days available', () => {
    expect(
      calculateRemainingNumberOfDays(firstDob, parentalLeaves, availableRights),
    ).toBe(30)
  })

  it('should return 0 days for the second date of birth when the amount of days for each periods is already equal to the maximum of days available', () => {
    expect(
      calculateRemainingNumberOfDays(
        secondDob,
        parentalLeaves,
        availableRights,
      ),
    ).toBe(0)
  })

  it('should return 135 days for the third date of birth when existing periods have been taken with ratio', () => {
    expect(
      calculateRemainingNumberOfDays(thirdDob, parentalLeaves, availableRights),
    ).toBe(135)
  })
})

describe('calculatePeriodLength', () => {
  it('should calculate a whole year correctly', () => {
    expect(
      calculatePeriodLength(new Date(2022, 2, 14), new Date(2023, 2, 13)),
    ).toBe(360)
  })

  it('should handle multiple collected edge cases', () => {
    expect(
      calculatePeriodLength(
        new Date(2022, 2, 14),
        new Date(2023, 2, 13),
        0.983,
      ),
    ).toBe(349)

    expect(
      calculatePeriodLength(new Date(2022, 2, 14), new Date(2023, 2, 13), 0.99),
    ).toBe(360)

    expect(
      calculatePeriodLength(new Date(2022, 2, 14), new Date(2023, 2, 13), 0.04),
    ).toBe(13)

    expect(
      calculatePeriodLength(new Date(2022, 2, 14), new Date(2023, 2, 13), 0.02),
    ).toBe(11)

    expect(
      calculatePeriodLength(new Date(2022, 4, 14), new Date(2023, 0, 2), 0.53),
    ).toBe(122)

    expect(
      calculatePeriodLength(new Date(2021, 1, 12), new Date(2022, 2, 13), 0.42),
    ).toBe(169)

    expect(
      calculatePeriodLength(new Date(2021, 0, 15), new Date(2021, 5, 7), 0.69),
    ).toBe(100)

    expect(
      calculatePeriodLength(new Date(2022, 2, 14), new Date(2023, 2, 13), 0.5),
    ).toBe(181)

    expect(
      calculatePeriodLength(
        new Date(2022, 2, 14),
        new Date(2023, 2, 13),
        0.499999999,
      ),
    ).toBe(179)
  })
})

describe('calculateMaxPercentageForPeriod', () => {
  it('should calculate 100% for 6 months with full normal rights', () => {
    const fullRights = 30 * 6

    expect(
      calculateMaxPercentageForPeriod(
        new Date(2022, 2, 14),
        new Date(2022, 2 + 6, 13),
        fullRights,
      ),
    ).toBe(1)
  })

  it('should calculate 100% for 7.5 months with full normal rights plus 45 requested days', () => {
    const fullRightsWithMaxRequestedDays = 30 * 6 + 45

    expect(
      calculateMaxPercentageForPeriod(
        new Date(2022, 2, 14),
        new Date(2022, 2 + 6, 28),
        fullRightsWithMaxRequestedDays,
      ),
    ).toBe(1)
  })

  it('should calculate 49% for full year with a full normal rights', () => {
    const fullRights = 30 * 6

    expect(
      calculateMaxPercentageForPeriod(
        new Date(2022, 2, 14),
        new Date(2023, 2, 13),
        fullRights,
      ),
    ).toBe(0.49)
  })

  it('should calculate 61% for full year with a full normal rights', () => {
    const fullRightsWithMaxRequestedDays = 30 * 6 + 45

    expect(
      calculateMaxPercentageForPeriod(
        new Date(2022, 2, 14),
        new Date(2023, 2, 13),
        fullRightsWithMaxRequestedDays,
      ),
    ).toBe(0.61)
  })
})
