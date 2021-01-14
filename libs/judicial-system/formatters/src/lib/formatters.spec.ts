import {
  CaseCustodyRestrictions,
  CaseGender,
} from '@island.is/judicial-system/types'

import * as Constants from './constants'
import {
  formatDate,
  formatRequestedCustodyRestrictions,
  capitalize,
  formatGender,
  formatCustodyRestrictions,
  formatAlternativeTravelBanRestrictions,
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
    const time = formatDate(date, 'PPP', true)

    // Assert
    expect(time).toEqual('09:36')
  })
})

describe('formatRequestedCustodyRestrictions', () => {
  test('should return a comma separated list of restrictions', () => {
    // Arrange
    const restrictions: CaseCustodyRestrictions[] = [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.COMMUNICATION,
    ]

    // Act
    const r = formatRequestedCustodyRestrictions(restrictions)

    // Assert
    expect(r).toEqual('B - Einangrun, D - Bréfskoðun, símabann')
  })

  test('should return "Ekki er farið fram á takmarkanir á gæslu" if no custody restriction is supplyed', () => {
    // Arrange
    const restrictions: CaseCustodyRestrictions[] = []

    // Act
    const r = formatRequestedCustodyRestrictions(restrictions)

    // Assert
    expect(r).toEqual('Ekki er farið fram á takmarkanir á gæslu')
  })
})

describe('formatCustodyRestrictions', () => {
  test('should return formatted restrictions for no restrictions', () => {
    // Arrange
    const accusedGender = CaseGender.MALE
    const custodyRestrictions: Array<CaseCustodyRestrictions> = []

    // Act
    const res = formatCustodyRestrictions(accusedGender, custodyRestrictions)

    // Assert
    expect(res).toBe('Sækjandi tekur fram að gæsluvarðhaldið sé án takmarkana.')
  })

  test('should return formatted restrictions for isolation only', () => {
    // Arrange
    const accusedGender = CaseGender.MALE
    const custodyRestrictions = [CaseCustodyRestrictions.ISOLATION]

    // Act
    const res = formatCustodyRestrictions(accusedGender, custodyRestrictions)

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

    // Act
    const res = formatCustodyRestrictions(accusedGender, custodyRestrictions)

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

    // Act
    const res = formatCustodyRestrictions(accusedGender, custodyRestrictions)

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

    // Act
    const res = formatCustodyRestrictions(accusedGender, custodyRestrictions)

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að gæsluvarðhaldið verði með bréfaskoðun og símabanni, fjölmiðlabanni og heimsóknarbanni skv. 99. gr. laga nr. 88/2008.',
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

describe('formatGender', () => {
  test('should format male', () => {
    // Arrange
    const gender = CaseGender.MALE

    // Act
    const r = formatGender(gender)

    // Assert
    expect(r).toBe('karl')
  })

  test('should format female', () => {
    // Arrange
    const gender = CaseGender.FEMALE

    // Act
    const r = formatGender(gender)

    // Assert
    expect(r).toBe('kona')
  })

  test('should format other', () => {
    // Arrange
    const gender = CaseGender.OTHER

    // Act
    const r = formatGender(gender)

    // Assert
    expect(r).toBe('annað')
  })
})
