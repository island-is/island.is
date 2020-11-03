import { formatCourtCaseNumber } from './formatters'

describe('formatCourtCaseNumber', () => {
  test('should return formatted court case number', () => {
    // Arrange
    const court = 'Héraðsdómur Reykjavíkur'
    const courtCaseNumber = 'R-5/2020'

    // Act
    const c = formatCourtCaseNumber(court, courtCaseNumber)

    // Assert
    expect(c).toBe('Málsnúmer Héraðsdóms Reykjavíkur R-5/2020')
  })
})
