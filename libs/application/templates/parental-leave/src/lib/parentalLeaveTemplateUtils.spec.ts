import getDaysInMonth from 'date-fns/getDaysInMonth'
import { calculatePLBetweenDates } from './parentalLeaveTemplateUtils'

describe('calculatePLBetweenDates', () => {
  it('should calculate zero days when the start and end dates are the same', () => {
    const start = new Date(2021, 3, 26)
    const end = new Date(2021, 3, 26)

    expect(calculatePLBetweenDates(start, end)).toBe(0)
  })

  it('should throw an error if end date is before start date', () => {
    const start = new Date(2021, 3, 26)
    const end = new Date(2021, 3, 25)

    expect(() => {
      calculatePLBetweenDates(start, end)
    }).toThrow()
  })

  it('should calculate 46 days between january 14th 2021 and february 28th 2021', () => {
    const start = new Date(2021, 0, 14)
    const end = new Date(2021, 1, 28)

    expect(calculatePLBetweenDates(start, end)).toBe(46)
  })

  it('should calculate 45 days between january 14th 2020 and february 28th 2020', () => {
    const start = new Date(2020, 0, 14)
    const end = new Date(2020, 1, 28)

    expect(calculatePLBetweenDates(start, end)).toBe(45)
  })

  it('should calculate 45 days between february 14th 2021 and march 31st 2021', () => {
    const start = new Date(2021, 1, 14)
    const end = new Date(2021, 2, 31)

    expect(calculatePLBetweenDates(start, end)).toBe(45)
  })

  it('should calculate 46 days between february 14th 2020 and march 31st 2020', () => {
    const start = new Date(2020, 1, 14)
    const end = new Date(2020, 2, 31)

    expect(calculatePLBetweenDates(start, end)).toBe(46)
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
            calculatePLBetweenDates(
              new Date(year, monthIndex, dayIndex),
              new Date(year, monthIndex + 1, dayIndex),
            ),
          ).toBe(30)
        }
      }
    }
  })
})

// describe('addPLDays', () => {
//   it('should ', () => {
//     expect(addPLDays()).toBe(1)
//   })

// it('previous month longer than next month, what happens if you want to take one month')

// it('length of month is less than 30 days, what happens if you add 30 days to 31st of previous month')

// })
