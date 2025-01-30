import endOfDay from 'date-fns/endOfDay'

import {
  getAppealDeadlineDate,
  getIndictmentAppealDeadlineDate,
  hasDatePassed,
} from './dates'

describe('getIndictmentAppealDeadlineDate', () => {
  test('should return fine appeal deadline', () => {
    // Arrange
    const baseDate = new Date(2024, 1, 1)
    const isFine = true

    // Act
    const actualDate = getIndictmentAppealDeadlineDate(baseDate, isFine)

    // Assert
    expect(actualDate).toStrictEqual(endOfDay(new Date(2024, 1, 4)))
  })

  test('should return verdict appeal deadline', () => {
    // Arrange
    const baseDate = new Date(2024, 1, 1)
    const isFine = false

    // Act
    const actualDate = getIndictmentAppealDeadlineDate(baseDate, isFine)

    // Assert
    expect(actualDate).toStrictEqual(endOfDay(new Date(2024, 1, 29)))
  })
})

describe('getAppealDeadlineDate', () => {
  test('should return expected appeal deadline', () => {
    // Arrange
    const date = '2024-01-04T19:50:08.033Z'
    const baseDate = new Date(date)

    // Act
    const actualDate = getAppealDeadlineDate(baseDate)

    // Assert
    expect(actualDate).toStrictEqual(new Date(2024, 0, 7, 19, 50, 8, 33))
  })
})

describe('hasDatePassed', () => {
  test('should return true for past dates', () => {
    // Arrange
    const pastDate = new Date(2024, 0, 1)

    // Act
    // Assert
    expect(hasDatePassed(pastDate)).toBe(true)
  })

  test('should return false for future dates', () => {
    // Arrange
    const futureDate = new Date(2024, 1, 1)
    const mockTodayDate = new Date(2024, 0, 1)

    // Act
    jest.useFakeTimers().setSystemTime(mockTodayDate)
    const isFutureDate = hasDatePassed(futureDate)

    // Assert
    expect(isFutureDate).toBe(false)
  })
})
