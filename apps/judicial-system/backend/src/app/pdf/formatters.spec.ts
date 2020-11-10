import {
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
} from '@island.is/judicial-system/types'

import {
  formatConclusion,
  formatCourtCaseNumber,
  formatCustodyProvisions,
  formatProsecutorDemands,
  formatRestrictions,
} from './formatters'

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

describe('formatCustodyProvisions', () => {
  test('should format custody provisions when no provisions are selected', () => {
    // Arrange
    const custodyProvisions = []

    // Act
    const res = formatCustodyProvisions(custodyProvisions)

    // Assert
    expect(res).toBe('')
  })

  test('should format custody provisions when some provisions are selected', () => {
    // Arrange
    const custodyProvisions = [
      CaseCustodyProvisions._95_1_A,
      CaseCustodyProvisions._95_1_B,
      CaseCustodyProvisions._95_1_C,
      CaseCustodyProvisions._95_1_D,
      CaseCustodyProvisions._95_2,
      CaseCustodyProvisions._99_1_B,
    ]

    // Act
    const res = formatCustodyProvisions(custodyProvisions)

    // Assert
    expect(res).toBe(
      'a-lið 1. mgr. 95. gr.\nb-lið 1. mgr. 95. gr.\nc-lið 1. mgr. 95. gr.\nd-lið 1. mgr. 95. gr.\n2. mgr. 95. gr.\nb-lið 1. mgr. 99. gr.',
    )
  })

  test('should sort provisions when formatting custody provisions', () => {
    // Arrange
    const custodyProvisions = [
      CaseCustodyProvisions._95_1_C,
      CaseCustodyProvisions._95_1_D,
      CaseCustodyProvisions._95_1_A,
      CaseCustodyProvisions._95_2,
      CaseCustodyProvisions._99_1_B,
      CaseCustodyProvisions._95_1_B,
    ]

    // Act
    const res = formatCustodyProvisions(custodyProvisions)

    // Assert
    expect(res).toBe(
      'a-lið 1. mgr. 95. gr.\nb-lið 1. mgr. 95. gr.\nc-lið 1. mgr. 95. gr.\nd-lið 1. mgr. 95. gr.\n2. mgr. 95. gr.\nb-lið 1. mgr. 99. gr.',
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

describe('formatConclusion', () => {
  test('should format conclusion for a rejected case', () => {
    // Arrange
    const rejecting = true

    // Act
    const res = formatConclusion(null, null, rejecting, null, null)

    // Assert
    expect(res).toBe('Beiðni um gæsluvarðhald hafnað.')
  })

  test('should format conclusion for an accepted case without isolation', () => {
    // Arrange
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const rejecting = false
    const custodyEndDate = new Date('2020-12-22T11:23')
    const isolation = false

    // Act
    const res = formatConclusion(
      accusedNationalId,
      accusedName,
      rejecting,
      custodyEndDate,
      isolation,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur 010101-0000 skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020 kl. 11:23.',
    )
  })

  test('should format conclusion for an accepted case with isolation', () => {
    // Arrange
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const rejecting = false
    const custodyEndDate = new Date('2020-12-22T11:23')
    const isolation = true

    // Act
    const res = formatConclusion(
      accusedNationalId,
      accusedName,
      rejecting,
      custodyEndDate,
      isolation,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur 010101-0000 skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020 kl. 11:23. Kærði skal sæta einangrun meðan á gæsluvarðhaldi stendur.',
    )
  })
})

describe('formatRestrictions', () => {
  test('should return formatted restrictions for no restrictions', () => {
    // Arrange
    const custodyRestrictions = []

    // Act
    const res = formatRestrictions(custodyRestrictions)

    // Assert
    expect(res).toBe('Sækjandi tekur fram að gæsluvarðhaldið sé án takmarkana.')
  })

  test('should return formatted restrictions for isolation only', () => {
    // Arrange
    const custodyRestrictions = [CaseCustodyRestrictions.ISOLATION]

    // Act
    const res = formatRestrictions(custodyRestrictions)

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að kærði skuli sæta einangrun meðan á gæsluvarðhaldi stendur.',
    )
  })

  test('should return formatted restrictions for isolation and one other restriction', () => {
    // Arrange
    const custodyRestrictions = [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.MEDIA,
    ]

    // Act
    const res = formatRestrictions(custodyRestrictions)

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að kærði skuli sæta einangrun meðan á gæsluvarðhaldi stendur og að gæsluvarðhaldið verði með fjölmiðlabanni skv. 99. gr. laga nr. 88/2008.',
    )
  })

  test('should return formatted restrictions for all but isolation', () => {
    // Arrange
    const custodyRestrictions = [
      CaseCustodyRestrictions.COMMUNICATION,
      CaseCustodyRestrictions.MEDIA,
      CaseCustodyRestrictions.VISITAION,
    ]

    // Act
    const res = formatRestrictions(custodyRestrictions)

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að gæsluvarðhaldið verði með bréfaskoðun og símabanni, fjölmiðlabanni og heimsóknarbanni skv. 99. gr. laga nr. 88/2008.',
    )
  })

  test('should order non-isolation restrictions', () => {
    // Arrange
    const custodyRestrictions = [
      CaseCustodyRestrictions.MEDIA,
      CaseCustodyRestrictions.VISITAION,
      CaseCustodyRestrictions.COMMUNICATION,
    ]

    // Act
    const res = formatRestrictions(custodyRestrictions)

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að gæsluvarðhaldið verði með bréfaskoðun og símabanni, fjölmiðlabanni og heimsóknarbanni skv. 99. gr. laga nr. 88/2008.',
    )
  })
})
