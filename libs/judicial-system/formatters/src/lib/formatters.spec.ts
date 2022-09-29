import {
  CaseAppealDecision,
  CaseType,
  Gender,
  SessionArrangements,
} from '@island.is/judicial-system/types'

import * as Constants from '@island.is/judicial-system/consts'

import {
  formatDate,
  capitalize,
  formatGender,
  formatNationalId,
  formatDOB,
  formatPhoneNumber,
  displayFirstPlusRemaining,
  formatProsecutorAppeal,
  formatDefendantAppeal,
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

describe('formatPhoneNumber', () => {
  test('should format a phonenumber that does not have a hyphen', () => {
    // Arrange
    const phoneNumber = '1234567'

    // Act
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber)

    // Assert
    expect(formattedPhoneNumber).toEqual('123-4567')
  })

  test('should format a phonenumber that does have a hyphen', () => {
    // Arrange
    const phoneNumber = '123-4567'

    // Act
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber)

    // Assert
    expect(formattedPhoneNumber).toEqual('123-4567')
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

describe('formatProsecutorAppeal', () => {
  test('should format appeal', () => {
    // Arrange
    const appealDecision = CaseAppealDecision.APPEAL

    // Act
    const res = formatProsecutorAppeal(appealDecision)

    // Assert
    expect(res).toBe(
      'Sækjandi lýsir því yfir að hann kæri úrskurðinn til Landsréttar. Sækjandi kærir úrskurðinn í því skyni að úrskurðurinn verði felldur úr gildi og krafa hans verði tekin til greina.',
    )
  })

  test('should format acceptance', () => {
    // Arrange
    const appealDecision = CaseAppealDecision.ACCEPT

    // Act
    const res = formatProsecutorAppeal(appealDecision)

    // Assert
    expect(res).toBe('Sækjandi unir úrskurðinum.')
  })

  test('should format postponement', () => {
    // Arrange
    const appealDecision = CaseAppealDecision.POSTPONE

    // Act
    const res = formatProsecutorAppeal(appealDecision)

    // Assert
    expect(res).toBe(
      'Sækjandi lýsir því yfir að hann taki sér lögbundinn kærufrest.',
    )
  })
})

describe('formatDefendantAppeal', () => {
  describe('Appeal decision is APPEAL', () => {
    test('should format correctly when there is a single defendant in a custody case', () => {
      // Arrange
      const multipleDefendants = false
      const appealDecision = CaseAppealDecision.APPEAL
      const caseType = CaseType.CUSTODY
      const sessionArrangements = SessionArrangements.ALL_PRESENT

      // Act
      const res = formatDefendantAppeal(
        multipleDefendants,
        appealDecision,
        caseType,
        sessionArrangements,
      )

      // Assert
      expect(res).toBe(
        'Varnaraðili kærir úrskurðinn í því skyni að úrskurðurinn verði felldur úr gildi, en til vara að gæsluvarðhaldi verði markaður skemmri tími/ honum verði gert að sæta farbanni í stað gæsluvarðahalds.',
      )
    })

    test('should format correctly when there are multiple defendants in a custody case', () => {
      // Arrange
      const multipleDefendants = true
      const appealDecision = CaseAppealDecision.APPEAL
      const caseType = CaseType.CUSTODY
      const sessionArrangements = SessionArrangements.ALL_PRESENT

      // Act
      const res = formatDefendantAppeal(
        multipleDefendants,
        appealDecision,
        caseType,
        sessionArrangements,
      )

      // Assert
      expect(res).toBe(
        'Varnaraðilar kæra úrskurðinn í því skyni að úrskurðurinn verði felldur úr gildi, en til vara að gæsluvarðhaldi verði markaður skemmri tími/ þeim verði gert að sæta farbanni í stað gæsluvarðahalds.',
      )
    })

    test('should format correctly when there is a single defendant in a case that is not a custody case', () => {
      // Arrange
      const multipleDefendants = false
      const appealDecision = CaseAppealDecision.APPEAL
      const caseType = CaseType.SEARCH_WARRANT
      const sessionArrangements = SessionArrangements.ALL_PRESENT

      // Act
      const res = formatDefendantAppeal(
        multipleDefendants,
        appealDecision,
        caseType,
        sessionArrangements,
      )

      // Assert
      expect(res).toBe(
        'Varnaraðili kærir úrskurðinn í því skyni að úrskurðurinn verði felldur úr gildi.',
      )
    })

    test('should format correctly when there are multiple defendants in a case that is not a custody case', () => {
      // Arrange
      const multipleDefendants = true
      const appealDecision = CaseAppealDecision.APPEAL
      const caseType = CaseType.SEARCH_WARRANT
      const sessionArrangements = SessionArrangements.ALL_PRESENT

      // Act
      const res = formatDefendantAppeal(
        multipleDefendants,
        appealDecision,
        caseType,
        sessionArrangements,
      )

      // Assert
      expect(res).toBe(
        'Varnaraðilar kæra úrskurðinn í því skyni að úrskurðurinn verði felldur úr gildi.',
      )
    })

    test('should format correctly when a spokesperson appeals on behalf of the defendants', () => {
      // Arrange
      const multipleDefendants = true
      const appealDecision = CaseAppealDecision.APPEAL
      const caseType = CaseType.SEARCH_WARRANT
      const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON

      // Act
      const res = formatDefendantAppeal(
        multipleDefendants,
        appealDecision,
        caseType,
        sessionArrangements,
      )

      // Assert
      expect(res).toBe(
        'Talsmaður varnaraðila kærir úrskurðinn í því skyni að úrskurðurinn verði felldur úr gildi.',
      )
    })
  })
  describe('Appeal decision is ACCEPT', () => {
    test('should format correctly when there is a single defendant', () => {
      // Arrange
      const multipleDefendants = false
      const appealDecision = CaseAppealDecision.ACCEPT
      const caseType = CaseType.SEARCH_WARRANT
      const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON

      // Act
      const res = formatDefendantAppeal(
        multipleDefendants,
        appealDecision,
        caseType,
        sessionArrangements,
      )

      // Assert
      expect(res).toBe('Varnaraðili unir úrskurðinum.')
    })

    test('should format correctly when there are multiple defendants', () => {
      // Arrange
      const multipleDefendants = true
      const appealDecision = CaseAppealDecision.ACCEPT
      const caseType = CaseType.SEARCH_WARRANT
      const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON

      // Act
      const res = formatDefendantAppeal(
        multipleDefendants,
        appealDecision,
        caseType,
        sessionArrangements,
      )

      // Assert
      expect(res).toBe('Varnaraðilar una úrskurðinum.')
    })
  })

  describe('Appeal decision is POSTPONE', () => {
    test('should format correctly when there is a single defendant', () => {
      // Arrange
      const multipleDefendants = false
      const appealDecision = CaseAppealDecision.POSTPONE
      const caseType = CaseType.SEARCH_WARRANT
      const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON

      // Act
      const res = formatDefendantAppeal(
        multipleDefendants,
        appealDecision,
        caseType,
        sessionArrangements,
      )

      // Assert
      expect(res).toBe(
        'Varnaraðili lýsir því yfir að hann taki sér lögbundinn kærufrest.',
      )
    })

    test('should format correctly when there are multiple defendants', () => {
      // Arrange
      const multipleDefendants = true
      const appealDecision = CaseAppealDecision.POSTPONE
      const caseType = CaseType.SEARCH_WARRANT
      const sessionArrangements = SessionArrangements.ALL_PRESENT_SPOKESPERSON

      // Act
      const res = formatDefendantAppeal(
        multipleDefendants,
        appealDecision,
        caseType,
        sessionArrangements,
      )

      // Assert
      expect(res).toBe(
        'Varnaraðilar lýsa því yfir að þeir taki sér lögbundinn kærufrest.',
      )
    })
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

describe('formatDOB', () => {
  it('should format a national id string for a valid national id', () => {
    // Arrange
    const nationalId = '1234567890'
    const noNationalId = false

    // Act
    const res = formatDOB(nationalId, noNationalId)

    // Assert
    expect(res).toBe('kt. 123456-7890')
  })

  it('should format a date of birth string when "does not have a national id" parameter is set', () => {
    // Arrange
    const nationalId = '12.12.2000'
    const noNationalId = true

    // Act
    const res = formatDOB(nationalId, noNationalId)

    // Assert
    expect(res).toBe('fd. 12.12.2000')
  })

  it('should return a "-" character when nationalId is not set', () => {
    // Arrange
    const nationalId = undefined
    const noNationalId = true

    // Act
    const res = formatDOB(nationalId, noNationalId)

    // Assert
    expect(res).toBe('-')
  })
})

describe('displayFirstPlusRemaining', () => {
  test('should handle undefined', () => {
    expect(displayFirstPlusRemaining(undefined)).toBe('')
  })

  test('should handle empty list', () => {
    expect(displayFirstPlusRemaining([])).toBe('')
  })

  test('should handle list with single entry', () => {
    expect(displayFirstPlusRemaining(['apple'])).toBe('apple')
  })

  test('should return first element plus how many are left in the list', () => {
    expect(displayFirstPlusRemaining(['apple', 'pear', 'orange'])).toBe(
      'apple +2',
    )
  })
})
