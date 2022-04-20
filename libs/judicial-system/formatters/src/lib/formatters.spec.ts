import {
  CaseAppealDecision,
  CaseCustodyRestrictions,
  Gender,
  CaseType,
} from '@island.is/judicial-system/types'

import * as Constants from '@island.is/judicial-system/consts'

import {
  formatDate,
  formatRequestedCustodyRestrictions,
  capitalize,
  formatGender,
  formatCustodyRestrictions,
  formatAppeal,
  formatNationalId,
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
    const custodyRestrictions: Array<CaseCustodyRestrictions> = []
    const isIsolation = false
    const isRuling = true

    // Act
    const res = formatCustodyRestrictions(
      custodyRestrictions,
      isIsolation,
      isRuling,
    )

    // Assert
    expect(res).toBe('')
  })

  test('should return formatted restrictions for no restrictions in custody notice', () => {
    // Arrange
    const custodyRestrictions: Array<CaseCustodyRestrictions> = []

    // Act
    const res = formatCustodyRestrictions(custodyRestrictions)

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að gæsluvarðhaldið verði án takmarkana.',
    )
  })

  test('should return formatted restrictions for isolation only', () => {
    // Arrange
    const custodyRestrictions: Array<CaseCustodyRestrictions> = []
    const isIsolation = true
    const isRuling = true

    // Act
    const res = formatCustodyRestrictions(
      custodyRestrictions,
      isIsolation,
      isRuling,
    )

    // Assert
    expect(res).toBe('')
  })

  test('should return formatted restrictions for isolation only in custody notice', () => {
    // Arrange
    const custodyRestrictions: Array<CaseCustodyRestrictions> = []
    const isIsolation = true
    const isRuling = false

    // Act
    const res = formatCustodyRestrictions(
      custodyRestrictions,
      isIsolation,
      isRuling,
    )

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að gæsluvarðhaldið verði án annarra takmarkana.',
    )
  })

  test('should return formatted restrictions for isolation and one other restriction', () => {
    // Arrange
    const custodyRestrictions = [
      CaseCustodyRestrictions.ISOLATION,
      CaseCustodyRestrictions.MEDIA,
    ]

    // Act
    const res = formatCustodyRestrictions(custodyRestrictions)

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að gæsluvarðhaldið verði með fjölmiðlabanni skv. 99. gr. laga nr. 88/2008.',
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
    const res = formatCustodyRestrictions(custodyRestrictions)

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að gæsluvarðhaldið verði með heimsóknarbanni, bréfaskoðun og símabanni og fjölmiðlabanni skv. 99. gr. laga nr. 88/2008.',
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
    const res = formatCustodyRestrictions(custodyRestrictions)

    // Assert
    expect(res).toBe(
      'Sækjandi tekur fram að gæsluvarðhaldið verði með heimsóknarbanni, bréfaskoðun og símabanni og fjölmiðlabanni skv. 99. gr. laga nr. 88/2008.',
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
    const gender = Gender.MALE

    // Act
    const r = formatGender(gender)

    // Assert
    expect(r).toBe('Karl')
  })

  test('should format female', () => {
    // Arrange
    const gender = Gender.FEMALE

    // Act
    const r = formatGender(gender)

    // Assert
    expect(r).toBe('Kona')
  })

  test('should format other', () => {
    // Arrange
    const gender = Gender.OTHER

    // Act
    const r = formatGender(gender)

    // Assert
    expect(r).toBe('Kynsegin/Annað')
  })
})

describe('formatAppeal', () => {
  test('should format appeal', () => {
    // Arrange
    const appealDecision = CaseAppealDecision.APPEAL
    const stakeholder = 'Aðili'

    // Act
    const res = formatAppeal(appealDecision, stakeholder)

    // Assert
    expect(res).toBe(
      'Aðili lýsir því yfir að hann kæri úrskurðinn til Landsréttar.',
    )
  })

  test('should format acceptance', () => {
    // Arrange
    const appealDecision = CaseAppealDecision.ACCEPT
    const stakeholder = 'Aðili'

    // Act
    const res = formatAppeal(appealDecision, stakeholder)

    // Assert
    expect(res).toBe('Aðili unir úrskurðinum.')
  })

  test('should format postponement', () => {
    // Arrange
    const appealDecision = CaseAppealDecision.POSTPONE
    const stakeholder = 'Aðilar'

    // Act
    const res = formatAppeal(appealDecision, stakeholder)

    // Assert
    expect(res).toBe(
      'Aðilar lýsa því yfir að þeir taki sér lögbundinn kærufrest.',
    )
  })
})

describe('formatNationalId', () => {
  test('should format valid national id', () => {
    // Arrange
    const nationalId = '1234567890'

    // Act
    const res = formatNationalId(nationalId)

    // Assert
    expect(res).toBe('123456-7890')
  })

  test('should not format short', () => {
    // Arrange
    const nationalId = '1234567'

    // Act
    const res = formatNationalId(nationalId)

    // Assert
    expect(res).toBe('1234567')
  })

  test('should not format long', () => {
    // Arrange
    const nationalId = '12345678900'

    // Act
    const res = formatNationalId(nationalId)

    // Assert
    expect(res).toBe('12345678900')
  })

  test('should not format non-number', () => {
    // Arrange
    const nationalId = 'ekki skráð'

    // Act
    const res = formatNationalId(nationalId)

    // Assert
    expect(res).toBe('ekki skráð')
  })
})
