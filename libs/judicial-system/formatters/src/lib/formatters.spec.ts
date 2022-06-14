import { CaseAppealDecision, Gender } from '@island.is/judicial-system/types'

import * as Constants from '@island.is/judicial-system/consts'

import {
  formatDate,
  capitalize,
  formatGender,
  formatAppeal,
  formatNationalId,
  formatDOB,
  formatPhoneNumber,
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
