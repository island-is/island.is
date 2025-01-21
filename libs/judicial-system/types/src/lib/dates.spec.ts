import { getAppealDeadlineDate, getIndictmentAppealDeadlineDate } from './dates'

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
  
