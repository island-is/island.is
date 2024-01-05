import * as Constants from '@island.is/judicial-system/consts'
import {
  CaseAppealDecision,
  Gender,
  IndictmentSubtype,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'

import {
  capitalize,
  displayFirstPlusRemaining,
  formatAppeal,
  formatDate,
  formatDOB,
  formatGender,
  formatNationalId,
  formatPhoneNumber,
  indictmentSubtypes,
  readableIndictmentSubtypes,
  sanitize,
  splitStringByComma,
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
    const text = undefined as unknown as string

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

describe('splitStringByComma', () => {
  test('should handle "apple" as input', () => {
    expect(splitStringByComma('apple')).toEqual(['apple'])
  })

  test.each(['apple, pear', 'apple pear', 'apple,pear'])(
    'should handle "%s" as input',
    (input) => {
      const result = splitStringByComma(input)

      expect(result).toHaveLength(2)
      expect(result).toEqual(['apple', 'pear'])
    },
  )
  test.each(['apple, pear, orange', 'apple pear orange'])(
    'should handle %s as input',
    (input) => {
      const result = splitStringByComma(input)

      expect(result).toHaveLength(3)
      expect(result).toEqual(['apple', 'pear', 'orange'])
    },
  )
})

describe('readableIndictmentSubtypes', () => {
  test('should return an empty list if no policeCaseNumber is provided', () => {
    const policeCaseNumbers: string[] = []
    const rawIndictmentSubtypes: IndictmentSubtypeMap = {
      '220-2020-202': [IndictmentSubtype.MAJOR_ASSAULT],
    }

    expect(
      readableIndictmentSubtypes(policeCaseNumbers, rawIndictmentSubtypes),
    ).toEqual([])
  })

  test('should return an empty list if rawIndictmentSubtype is not provided', () => {
    const policeCaseNumbers: string[] = ['220-2020-202']
    const rawIndictmentSubtypes = undefined

    expect(
      readableIndictmentSubtypes(policeCaseNumbers, rawIndictmentSubtypes),
    ).toEqual([])
  })

  test('should return a array of readable indictment subtypes if policeCaseNumbers and rawIndictmentSubtypes are provided', () => {
    const policeCaseNumbers: string[] = ['220-2020-202']
    const rawIndictmentSubtypes: IndictmentSubtypeMap = {
      '220-2020-202': [IndictmentSubtype.RAPE, IndictmentSubtype.THEFT],
    }

    expect(
      readableIndictmentSubtypes(policeCaseNumbers, rawIndictmentSubtypes),
    ).toEqual([
      indictmentSubtypes[IndictmentSubtype.RAPE],
      indictmentSubtypes[IndictmentSubtype.THEFT],
    ])
  })

  test('should remove duplicates from indictment subtypes', () => {
    const policeCaseNumbers: string[] = ['220-2020-202', '220-2020-203']
    const rawIndictmentSubtypes: IndictmentSubtypeMap = {
      '220-2020-202': [IndictmentSubtype.RAPE, IndictmentSubtype.THEFT],
      '220-2020-203': [IndictmentSubtype.RAPE, IndictmentSubtype.THEFT],
    }

    expect(
      readableIndictmentSubtypes(policeCaseNumbers, rawIndictmentSubtypes),
    ).toEqual([
      indictmentSubtypes[IndictmentSubtype.RAPE],
      indictmentSubtypes[IndictmentSubtype.THEFT],
    ])
  })
})

describe('sanitize', () => {
  test('should return empty string if text is empty', () => {
    // Arrange
    const text = ``

    // Act
    const r = sanitize(text)

    // Assert
    expect(r).toBe('')
  })

  test('should work with one instance of "', () => {
    // Arrange
    const text = `bla"bla.pdf`

    // Act
    const r = sanitize(text)

    // Assert
    expect(r).toBe('blabla.pdf')
  })

  test('should work with multiple instances of "', () => {
    // Arrange
    const text = `bla"bl"a.pdf`

    // Act
    const r = sanitize(text)

    // Assert
    expect(r).toBe('blabla.pdf')
  })
})
