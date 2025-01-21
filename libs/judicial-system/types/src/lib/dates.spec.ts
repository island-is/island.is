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
    const actualDate = getIndictmentAppealDeadlineDate({ baseDate, isFine })

    // Assert
    expect(actualDate).toStrictEqual(new Date(2024, 1, 4, 23, 59, 59, 999))
  })

  test('should return verdict appeal deadline', () => {
    // Arrange
    const baseDate = new Date(2024, 1, 1)
    const isFine = false

    // Act
    const actualDate = getIndictmentAppealDeadlineDate({ baseDate, isFine })

    // Assert
    expect(actualDate).toStrictEqual(new Date(2024, 1, 29, 23, 59, 59, 999))
  })
})

describe('getAppealDeadlineDate', () => {
  test('should return expected appeal deadline', () => {
    // Arrange
    const baseDate = new Date(2024, 1, 1)

    // Act
    const actualDate = getAppealDeadlineDate({ baseDate })

    // Assert
    expect(actualDate).toStrictEqual(new Date(2024, 1, 4, 23, 59, 59, 999))
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

    jest.useFakeTimers().setSystemTime(mockTodayDate)

    // Act
    // Assert
    expect(hasDatePassed(futureDate)).toBe(false)
  })
})
