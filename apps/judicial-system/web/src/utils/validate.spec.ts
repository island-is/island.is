import { validate } from './validate'

describe('Validate police casenumber format', () => {
  test('should fail if not in correct form', () => {
    // Arrange
    const value = 'INCORRECT FORMAT'

    // Act
    const r = validate([[value, ['police-casenumber-format']]])

    // Assert
    expect(r.isValid).toEqual(false)
    expect(r.errorMessage).toEqual('Dæmi: 012-3456-7890')
  })
})

describe('Validate time format', () => {
  test('should fail if time is not within the 24 hour clock', () => {
    // Arrange
    const time = '99:00'

    // Act
    const r = validate([[time, ['time-format']]])

    // Assert
    expect(r.isValid).toEqual(false)
    expect(r.errorMessage).toEqual('Dæmi: 12:34 eða 1:23')
  })

  test('should be valid if with the hour part is one digit within the 24 hour clock', () => {
    // Arrange
    const time = '1:00'

    // Act
    const r = validate([[time, ['time-format']]])

    // Assert
    expect(r.isValid).toEqual(true)
  })
})

describe('Validate national id format', () => {
  test('should be valid if all digits filled in', () => {
    // Arrange
    // eslint-disable-next-line local-rules/disallow-kennitalas
    const nid = '999999-9999'

    // Act
    const r = validate([[nid, ['national-id']]])

    // Assert
    expect(r.isValid).toEqual(true)
  })

  test('should not be valid given just the first six digits', () => {
    // Arrange
    const nid = '010101'

    // Act
    const r = validate([[nid, ['national-id']]])

    // Assert
    expect(r.isValid).toEqual(false)
    expect(r.errorMessage).toEqual('Dæmi: 000000-0000')
  })

  test('should not be valid given too few digits', () => {
    // Arrange
    const nid = '99120'

    // Act
    const r = validate([[nid, ['national-id']]])

    // Assert
    expect(r.isValid).toEqual(false)
    expect(r.errorMessage).toEqual('Dæmi: 000000-0000')
  })

  test('should not be valid given invalid number of digits', () => {
    // Arrange
    const nid = '991201-22'

    // Act
    const r = validate([[nid, ['national-id']]])

    // Assert
    expect(r.isValid).toEqual(false)
    expect(r.errorMessage).toEqual('Dæmi: 000000-0000')
  })
})

describe('Validate email format', () => {
  test('should not be valid if @ is missing', () => {
    // Arrange
    const invalidEmail = 'testATtest.is'

    // Act
    const validation = validate([[invalidEmail, ['email-format']]])

    // Assert
    expect(validation.isValid).toEqual(false)
    expect(validation.errorMessage).toEqual('Netfang ekki á réttu formi')
  })

  test('should not be valid if the ending is less than two characters', () => {
    // Arrange
    const invalidEmail = 'testATtest.i'

    // Act
    const validation = validate([[invalidEmail, ['email-format']]])

    // Assert
    expect(validation.isValid).toEqual(false)
    expect(validation.errorMessage).toEqual('Netfang ekki á réttu formi')
  })

  test('should be valid if email is empty', () => {
    // Arrange

    // Act
    const validation = validate([['', ['email-format']]])

    // Assert
    expect(validation.isValid).toEqual(true)
  })

  test('should be valid if email contains - and . characters', () => {
    // Arrange
    const validEmail = 'garfield.lasagne-lover@garfield.io'

    // Act
    const validation = validate([[validEmail, ['email-format']]])

    // Assert
    expect(validation.isValid).toEqual(true)
  })

  test('should be valid if email is valid', () => {
    // Arrange
    const validEmail = 'garfield@garfield.io'

    // Act
    const validation = validate([[validEmail, ['email-format']]])

    // Assert
    expect(validation.isValid).toEqual(true)
  })

  test('should be valid if email contains + characters', () => {
    // Arrange
    const validEmail = 'garfield+test@garfield.io'

    // Act
    const validation = validate([[validEmail, ['email-format']]])

    // Assert
    expect(validation.isValid).toEqual(true)
  })
})

describe('Validate phonenumber format', () => {
  test('should fail if not in correct form', () => {
    // Arrange
    const phonenumber = '00292'

    // Act
    const r = validate([[phonenumber, ['phonenumber']]])

    // Assert
    expect(r.isValid).toEqual(false)
    expect(r.errorMessage).toEqual('Dæmi: 555-5555')
  })

  test('should pass if in correct form', () => {
    // Arrange
    const phonenumber = '555-5555'

    // Act
    const r = validate([[phonenumber, ['phonenumber']]])

    // Assert
    expect(r.isValid).toEqual(true)
  })
})

describe('Validate court case number', () => {
  beforeAll(() => {
    jest.useFakeTimers({ now: new Date('2020-01-01') })
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  test.each`
    courtCaseNumber
    ${'R-1/2019'}
    ${'R-22/2022'}
    ${'R-7536/1993'}
    ${'R-333/3333'}
    ${'R-12345/2014'}
  `(
    'should pass when case as correct format $R-case-number',
    ({ courtCaseNumber }) => {
      const result = validate([[courtCaseNumber, ['R-case-number']]])
      expect(result.isValid).toEqual(true)
    },
  )

  test.each`
    courtCaseNumber
    ${'2019'}
    ${'r-1/2019'}
    ${'R.1/2019'}
    ${'R/1/2019'}
    ${'R/1-2019'}
    ${'R/1-2019'}
    ${'R-1-2019'}
    ${'R-1/201'}
    ${'R-1/201'}
  `(
    'should fail if case number as wrong format $R-case-number',
    ({ courtCaseNumber }) => {
      const result = validate([[courtCaseNumber, ['R-case-number']]])
      expect(result.isValid).toEqual(false)
      expect(result.errorMessage).toEqual('Dæmi: R-1234/2020')
    },
  )

  test.each`
    courtCaseNumber
    ${'S-1/2019'}
    ${'S-22/2022'}
    ${'S-7536/1993'}
    ${'S-333/3333'}
    ${'S-12345/2014'}
  `(
    'should pass when case as correct format $S-case-number',
    ({ courtCaseNumber }) => {
      const result = validate([[courtCaseNumber, ['S-case-number']]])
      expect(result.isValid).toEqual(true)
    },
  )

  test.each`
    courtCaseNumber
    ${'2019'}
    ${'s-1/2019'}
    ${'S.1/2019'}
    ${'S/1/2019'}
    ${'S/1-2019'}
    ${'S/1-2019'}
    ${'S-1-2019'}
    ${'S-1/201'}
    ${'S-1/201'}
  `(
    'should fail if case number as wrong format $S-case-number',
    ({ courtCaseNumber }) => {
      const result = validate([[courtCaseNumber, ['S-case-number']]])
      expect(result.isValid).toEqual(false)
      expect(result.errorMessage).toEqual('Dæmi: S-1234/2020')
    },
  )
})
