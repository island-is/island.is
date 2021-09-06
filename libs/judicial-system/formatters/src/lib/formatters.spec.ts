import {
  CaseCustodyRestrictions,
  CaseDecision,
  CaseGender,
  CaseType,
} from '@island.is/judicial-system/types'

import * as Constants from './constants'
import {
  formatDate,
  formatRequestedCustodyRestrictions,
  capitalize,
  formatGender,
  formatCustodyRestrictions,
  formatAlternativeTravelBanRestrictions,
  formatProsecutorDemands,
  formatConclusion,
} from './formatters'

describe('formatDate', () => {
  test('should return undefined if date parameter is undefined', () => {
    // Arrange
    const date2 = undefined

    // Act
    const time2 = formatDate(date2, Constants.TIME_FORMAT)

    // Assert
    expect(time2).toBeUndefined()
  })

  test('should return the time with 24h format', () => {
    // Arrange
    const date = '2020-09-10T09:36:57.287Z'
    const date2 = '2020-09-23T23:36:57.287Z'

    // Act
    const time = formatDate(date, Constants.TIME_FORMAT)
    const time2 = formatDate(date2, Constants.TIME_FORMAT)

    // Assert
    expect(time).toEqual('09:36')
    expect(time2).toEqual('23:36')
  })

  test('should shorten the day name if shortenDayName is set to true', () => {
    // Arrange
    const date = '2020-09-10T09:36:57.287Z'

    // Act
    const formattedDate = formatDate(date, 'PPPP', true)

    // Assert
    expect(formattedDate).toEqual('fimmtud. 10. september 2020')
  })
})

describe('formatRequestedCustodyRestrictions', () => {
  test('should return a comma separated list of restrictions', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const requestedCustodyRestrictions: CaseCustodyRestrictions[] = [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.COMMUNICATION,
    ]

    // Act
    const r = formatRequestedCustodyRestrictions(
      type,
      requestedCustodyRestrictions,
    )

    // Assert
    expect(r).toEqual('B - Einangrun\nD - Bréfskoðun, símabann')
  })

  test('should return "Ekki er farið fram á takmarkanir á gæslu" if no custody restriction is supplied', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const requestedCustodyRestrictions: CaseCustodyRestrictions[] = []

    // Act
    const r = formatRequestedCustodyRestrictions(
      type,
      requestedCustodyRestrictions,
    )

    // Assert
    expect(r).toEqual('Ekki er farið fram á takmarkanir á gæslu.')
  })

  test('should return "Ekki er farið fram á takmarkanir á farbanni" if no custody restriction is supplied', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const requestedCustodyRestrictions: CaseCustodyRestrictions[] = []

    // Act
    const r = formatRequestedCustodyRestrictions(
      type,
      requestedCustodyRestrictions,
    )

    // Assert
    expect(r).toEqual('Ekki er farið fram á takmarkanir á farbanni.')
  })

  test('should return additional other restrictions', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const requestedCustodyRestrictions: CaseCustodyRestrictions[] = [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.COMMUNICATION,
    ]
    const requestedOtherRestrictions = 'The accused should stay home.'

    // Act
    const r = formatRequestedCustodyRestrictions(
      type,
      requestedCustodyRestrictions,
      requestedOtherRestrictions,
    )

    // Assert
    expect(r).toEqual(
      'B - Einangrun\nD - Bréfskoðun, símabann\nThe accused should stay home.',
    )
  })

  test('should return additional other restrictions only', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const requestedOtherRestrictions = 'The accused should stay home.'

    // Act
    const r = formatRequestedCustodyRestrictions(
      type,
      undefined,
      requestedOtherRestrictions,
    )

    // Assert
    expect(r).toEqual('The accused should stay home.')
  })
})

describe('formatCustodyRestrictions', () => {
  test('should return formatted restrictions for no restrictions', () => {
    // Arrange
    const accusedGender = CaseGender.MALE
    const custodyRestrictions: Array<CaseCustodyRestrictions> = []
    const validToDate = new Date('2021-07-22T11:23')

    // Act
    const res = formatCustodyRestrictions(
      accusedGender,
      custodyRestrictions,
      validToDate,
    )

    // Assert
    expect(res).toBe('Sækjandi tekur fram að gæsluvarðhaldið sé án takmarkana.')
  })

  test('should return formatted restrictions for isolation only', () => {
    // Arrange
    const accusedGender = CaseGender.MALE
    const custodyRestrictions = [CaseCustodyRestrictions.ISOLATION]
    const validToDate = new Date('2021-07-22T11:23')
    const isolationToDate = new Date('2021-07-22T11:23')

    // Act
    const res = formatCustodyRestrictions(
      accusedGender,
      custodyRestrictions,
      validToDate,
      isolationToDate,
    )

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að kærði skuli sæta einangrun á meðan á gæsluvarðhaldinu stendur.',
    )
  })

  test('should return formatted restrictions for isolation and one other restriction', () => {
    // Arrange
    const accusedGender = CaseGender.MALE
    const custodyRestrictions = [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.MEDIA,
    ]
    const validToDate = new Date('2021-07-22T11:23')
    const isolationToDate = new Date('2021-07-22T11:23')

    // Act
    const res = formatCustodyRestrictions(
      accusedGender,
      custodyRestrictions,
      validToDate,
      isolationToDate,
    )

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að kærði skuli sæta einangrun á meðan á gæsluvarðhaldinu stendur og að gæsluvarðhaldið verði með fjölmiðlabanni skv. 99. gr. laga nr. 88/2008.',
    )
  })

  test('should return formatted restrictions for all but isolation', () => {
    // Arrange
    const accusedGender = CaseGender.MALE
    const custodyRestrictions = [
      CaseCustodyRestrictions.COMMUNICATION,
      CaseCustodyRestrictions.MEDIA,
      CaseCustodyRestrictions.VISITAION,
    ]
    const validToDate = new Date('2021-07-22T11:23')

    // Act
    const res = formatCustodyRestrictions(
      accusedGender,
      custodyRestrictions,
      validToDate,
    )

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að gæsluvarðhaldið verði með bréfaskoðun og símabanni, fjölmiðlabanni og heimsóknarbanni skv. 99. gr. laga nr. 88/2008.',
    )
  })

  test('should order non-isolation restrictions', () => {
    // Arrange
    const accusedGender = CaseGender.MALE
    const custodyRestrictions = [
      CaseCustodyRestrictions.MEDIA,
      CaseCustodyRestrictions.VISITAION,
      CaseCustodyRestrictions.COMMUNICATION,
    ]
    const validToDate = new Date('2021-07-22T11:23')

    // Act
    const res = formatCustodyRestrictions(
      accusedGender,
      custodyRestrictions,
      validToDate,
    )

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að gæsluvarðhaldið verði með bréfaskoðun og símabanni, fjölmiðlabanni og heimsóknarbanni skv. 99. gr. laga nr. 88/2008.',
    )
  })

  test('should return formatted restrictions for isolation shorter than custody', () => {
    // Arrange
    const accusedGender = CaseGender.MALE
    const custodyRestrictions = [CaseCustodyRestrictions.ISOLATION]
    const validToDate = new Date('2021-07-22T11:23')
    const isolationToDate = new Date('2021-06-30T16:00')

    // Act
    const res = formatCustodyRestrictions(
      accusedGender,
      custodyRestrictions,
      validToDate,
      isolationToDate,
    )

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að kærði skuli sæta einangrun ekki lengur en til miðvikudagsins 30. júní 2021, kl. 16:00.',
    )
  })
})

describe('formatAlternativeTravelBanRestrictions', () => {
  test('should return formatted restrictions for no restrictions', () => {
    // Arrange
    const accusedGender = CaseGender.MALE
    const custodyRestrictions: Array<CaseCustodyRestrictions> = []

    // Act
    const res = formatAlternativeTravelBanRestrictions(
      accusedGender,
      custodyRestrictions,
    )

    // Assert
    expect(res).toBe('Sækjandi tekur fram að farbannið sé án takmarkana.')
  })

  test('should return formatted restrictions for one restriction', () => {
    // Arrange
    const accusedGender = CaseGender.FEMALE
    const custodyRestrictions = [
      CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT,
    ]

    // Act
    const res = formatAlternativeTravelBanRestrictions(
      accusedGender,
      custodyRestrictions,
    )

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að farbannið verði með takmörkunum. Að kærðu verði gert að afhenda vegabréfið sitt.',
    )
  })

  test('should return formatted restrictions for all restrictions', () => {
    // Arrange
    const accusedGender = CaseGender.OTHER
    const custodyRestrictions = [
      CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT,
      CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
    ]

    // Act
    const res = formatAlternativeTravelBanRestrictions(
      accusedGender,
      custodyRestrictions,
    )

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að farbannið verði með takmörkunum. Að kærða verði gert að tilkynna sig. Að kærða verði gert að afhenda vegabréfið sitt.',
    )
  })

  test('should return formatted restrictions with other restrictions', () => {
    // Arrange
    const accusedGender = CaseGender.OTHER
    const custodyRestrictions = [
      CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT,
      CaseCustodyRestrictions.ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION,
    ]
    const otherRestrictions = 'Stay in town.'

    // Act
    const res = formatAlternativeTravelBanRestrictions(
      accusedGender,
      custodyRestrictions,
      otherRestrictions,
    )

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að farbannið verði með takmörkunum. Að kærða verði gert að tilkynna sig. Að kærða verði gert að afhenda vegabréfið sitt.\nStay in town.',
    )
  })

  test('should return formatted restrictions with other restrictions only', () => {
    // Arrange
    const accusedGender = CaseGender.OTHER
    const otherRestrictions = 'Stay in town.'

    // Act
    const res = formatAlternativeTravelBanRestrictions(
      accusedGender,
      undefined,
      otherRestrictions,
    )

    // Assert
    expect(res).toBe('Stay in town.')
  })
})

describe('capitalize', () => {
  test('should return empty string if text is empty', () => {
    // Arrange
    const text = (undefined as unknown) as string

    // Act
    const r = capitalize(text)

    // Assert
    expect(r).toBe('')
  })
})

describe('formatProsecutorDemands', () => {
  test('should format prosecutor demands with isolation', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '010101-0000'
    const accusedName = 'Glanni Glæpur'
    const court = 'Héraðsdómur Reykjavíkur'
    const requestedValidToDate = new Date('2020-11-16T19:30:08.000Z')
    const isolation = true
    const isExtension = false

    // Act
    const res = formatProsecutorDemands(
      type,
      accusedNationalId,
      accusedName,
      court,
      requestedValidToDate,
      isolation,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Þess er krafist að Glanni Glæpur, kt. 010101-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til mánudagsins 16. nóvember 2020, kl. 19:30, og verði gert að sæta einangrun á meðan á varðhaldi stendur.',
    )
  })

  test('should format prosecutor demands without isolation', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const court = 'Héraðsdómur Reykjavíkur'
    const requestedValidToDate = new Date('2020-11-16T19:30:08.000Z')
    const isolation = false
    const isExtension = false

    // Act
    const res = formatProsecutorDemands(
      type,
      accusedNationalId,
      accusedName,
      court,
      requestedValidToDate,
      isolation,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Þess er krafist að Glanni Glæpur, kt. 010101-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Reykjavíkur, til mánudagsins 16. nóvember 2020, kl. 19:30.',
    )
  })

  test('should format extended prosecutor demands', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '011101-0000'
    const accusedName = 'Siggi Sýra'
    const court = 'Héraðsdómur Kjósarskarðs'
    const requestedValidToDate = new Date('2020-11-16T19:30:08.000Z')
    const isolation = false
    const isExtension = true
    const previousDecision = CaseDecision.ACCEPTING

    // Act
    const res = formatProsecutorDemands(
      type,
      accusedNationalId,
      accusedName,
      court,
      requestedValidToDate,
      isolation,
      isExtension,
      previousDecision,
    )

    // Assert
    expect(res).toBe(
      'Þess er krafist að Siggi Sýra, kt. 011101-0000, sæti áframhaldandi gæsluvarðhaldi með úrskurði Héraðsdóms Kjósarskarðs, til mánudagsins 16. nóvember 2020, kl. 19:30.',
    )
  })

  test('should format extended prosecutor demands when previous travel ban', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '011101-0000'
    const accusedName = 'Siggi Sýra'
    const court = 'Héraðsdómur Kjósarskarðs'
    const requestedValidToDate = new Date('2020-11-16T19:30:08.000Z')
    const isolation = false
    const isExtension = true
    const previousDecision = CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN

    // Act
    const res = formatProsecutorDemands(
      type,
      accusedNationalId,
      accusedName,
      court,
      requestedValidToDate,
      isolation,
      isExtension,
      previousDecision,
    )

    // Assert
    expect(res).toBe(
      'Þess er krafist að Siggi Sýra, kt. 011101-0000, sæti gæsluvarðhaldi með úrskurði Héraðsdóms Kjósarskarðs, til mánudagsins 16. nóvember 2020, kl. 19:30.',
    )
  })

  test('should format prosecutor demands for travel ban', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const court = 'Héraðsdómur Reykjavíkur'
    const requestedValidToDate = new Date('2020-11-16T19:30:08.000Z')
    const isolation = false
    const isExtension = false

    // Act
    const res = formatProsecutorDemands(
      type,
      accusedNationalId,
      accusedName,
      court,
      requestedValidToDate,
      isolation,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Þess er krafist að Glanni Glæpur, kt. 010101-0000, sæti farbanni með úrskurði Héraðsdóms Reykjavíkur, til mánudagsins 16. nóvember 2020, kl. 19:30.',
    )
  })
})

describe('formatGender', () => {
  test('should format male', () => {
    // Arrange
    const gender = CaseGender.MALE

    // Act
    const r = formatGender(gender)

    // Assert
    expect(r).toBe('Karl')
  })

  test('should format female', () => {
    // Arrange
    const gender = CaseGender.FEMALE

    // Act
    const r = formatGender(gender)

    // Assert
    expect(r).toBe('Kona')
  })

  test('should format other', () => {
    // Arrange
    const gender = CaseGender.OTHER

    // Act
    const r = formatGender(gender)

    // Assert
    expect(r).toBe('Kynsegin/Annað')
  })
})

describe('formatConclusion', () => {
  test('should format conclusion for a rejected case', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.REJECTING
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = false
    const isExtension = false

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Kröfu um að kærði, Glanni Glæpur, kt. 010101-0000, sæti gæsluvarðhaldi er hafnað.',
    )
  })

  test('should format conclusion for an accepted case without isolation', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = false
    const isExtension = false

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  test('should format conclusion for an accepted case with isolation', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = true
    const isExtension = false

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23. Kærði skal sæta einangrun á meðan á gæsluvarðhaldinu stendur.',
    )
  })

  test('should format conclusion for an accepted case with isolation and the isolation ends before the custody does', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = true
    const isExtension = false
    const isolationToDate = new Date('2020-12-20T15:39')

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      undefined,
      isolationToDate,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23. Kærði skal sæta einangrun ekki lengur en til sunnudagsins 20. desember 2020, kl. 15:39.',
    )
  })

  test('should format conclusion for a case where custody is rejected, but alternative travel ban accepted', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
    const validToDate = new Date('2021-01-29T13:03')
    const isolation = false
    const isExtension = false

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta farbanni, þó ekki lengur en til föstudagsins 29. janúar 2021, kl. 13:03.',
    )
  })

  test('should format conclusion for rejected extension', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.REJECTING
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = false
    const isExtension = true
    const previousDecision = CaseDecision.ACCEPTING

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      previousDecision,
    )

    // Assert
    expect(res).toBe(
      'Kröfu um að kærði, Glanni Glæpur, kt. 010101-0000, sæti áframhaldandi gæsluvarðhaldi er hafnað.',
    )
  })

  test('should format conclusion for rejected extension when previous ruling was travel ban', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.REJECTING
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = false
    const isExtension = true
    const previousDecision = CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      previousDecision,
    )

    // Assert
    expect(res).toBe(
      'Kröfu um að kærði, Glanni Glæpur, kt. 010101-0000, sæti gæsluvarðhaldi er hafnað.',
    )
  })

  test('should format conclusion for accepted extension', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = false
    const isExtension = true
    const previousDecision = CaseDecision.ACCEPTING

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      previousDecision,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta áframhaldandi gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  test('should format conclusion for accepted extension when previous ruling was travel ban', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = false
    const isExtension = true
    const previousDecision = CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      previousDecision,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta gæsluvarðhaldi, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  test('should format conclusion for rejected extension when alternative travel ban accepted', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = false
    const isExtension = true
    const previousDecision = CaseDecision.ACCEPTING

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      previousDecision,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta farbanni, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })

  test('should format conclusion for rejected extension when alternative travel ban accepted and previous ruling was travel ban', () => {
    // Arrange
    const type = CaseType.CUSTODY
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = false
    const isExtension = true
    const previousDecision = CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      previousDecision,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta áframhaldandi farbanni, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })
  test('should format conclusion for a rejected travel ban', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.REJECTING
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = false
    const isExtension = false

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Kröfu um að kærði, Glanni Glæpur, kt. 010101-0000, sæti farbanni er hafnað.',
    )
  })

  test('should format conclusion for an accepted case without isolation', () => {
    // Arrange
    const type = CaseType.TRAVEL_BAN
    const accusedNationalId = '0101010000'
    const accusedName = 'Glanni Glæpur'
    const accusedGender = CaseGender.MALE
    const decision = CaseDecision.ACCEPTING
    const validToDate = new Date('2020-12-22T11:23')
    const isolation = false
    const isExtension = false

    // Act
    const res = formatConclusion(
      type,
      accusedNationalId,
      accusedName,
      accusedGender,
      decision,
      validToDate,
      isolation,
      isExtension,
      undefined,
    )

    // Assert
    expect(res).toBe(
      'Kærði, Glanni Glæpur, kt. 010101-0000, skal sæta farbanni, þó ekki lengur en til þriðjudagsins 22. desember 2020, kl. 11:23.',
    )
  })
})
