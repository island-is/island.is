import { formatCourtCaseNumber, formatProsecutorDemands } from './formatters'

describe('formatProsecutorDemands', () => {
  test('should format prosecutor demands with isolation', () => {
    // Arrange
    const accusedNationalId = '010101-0000'
    const accusedName = 'Glanni Glæpur'
    const court = 'Héraðsdómur Reykjavíkur'
    const requestedCustodyEndDate = new Date('2020-11-16T19:30:08.000Z')
    const isolation = true

    // Act
    const res = formatProsecutorDemands(
      accusedNationalId,
      accusedName,
      court,
      requestedCustodyEndDate,
      isolation,
    )

    // Assert
    expect(res).toBe(
      'Þess er krafist að Glanni Glæpur 010101-0000 verði með úrskurði Héraðsdóms Reykjavíkur gert að sæta gæsluvarðhaldi til mánudagsins 16. nóvember 2020 kl. 19:30 og verði gert að sæta einangrun meðan á gæsluvarðhaldi stendur.',
    )
  })

  test('should format prosecutor demands without isolation', () => {
    // Arrange
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const court = 'Héraðsdómur Reykjavíkur'
    const requestedCustodyEndDate = new Date('2020-11-16T19:30:08.000Z')
    const isolation = false

    // Act
    const res = formatProsecutorDemands(
      accusedNationalId,
      accusedName,
      court,
      requestedCustodyEndDate,
      isolation,
    )

    // Assert
    expect(res).toBe(
      'Þess er krafist að Glanni Glæpur 010101-0000 verði með úrskurði Héraðsdóms Reykjavíkur gert að sæta gæsluvarðhaldi til mánudagsins 16. nóvember 2020 kl. 19:30.',
    )
  })
})

describe('formatCourtCaseNumber', () => {
  test('should return formatted court case number', () => {
    // Arrange
    const court = 'Héraðsdómur Reykjavíkur'
    const courtCaseNumber = 'R-5/2020'

    // Act
    const res = formatCourtCaseNumber(court, courtCaseNumber)

    // Assert
    expect(res).toBe('Málsnúmer Héraðsdóms Reykjavíkur R-5/2020')
  })
})
