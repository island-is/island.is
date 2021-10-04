import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { RequiredField } from '@island.is/judicial-system-web/src/types'
import { CaseTransition, CaseGender } from '@island.is/judicial-system/types'
import { getShortGender, isDirty, isNextDisabled } from './stepHelper'
import { validate } from './validate'

import * as formatters from './formatters'

describe('Formatters utils', () => {
  describe('Parse array', () => {
    test('given a property name and an array of strings should parse correctly into JSON', () => {
      // Arrange
      const property = 'test'
      const array = ['lorem', 'ipsum']

      // Act
      const parsedArray = formatters.parseArray(property, array)

      // Assert
      expect(parsedArray).not.toEqual(null)
      expect(parsedArray).toEqual({ test: ['lorem', 'ipsum'] })
    })
  })

  describe('Parse string', () => {
    test('given a property name and a value should parse correctly into JSON', () => {
      // Arrange
      const property = 'test'
      const value = 'lorem'

      // Act
      const parsedString = formatters.parseString(property, value)

      // Assert
      expect(parsedString).toEqual({ test: 'lorem' })
    })

    test('given a value with special characters should parse correctly into JSON', () => {
      //Arrange
      const property = 'test'
      const value = `lorem
ipsum`

      // Act
      const parsedString = formatters.parseString(property, value)

      // Assert
      expect(parsedString).toEqual({
        test: 'lorem\nipsum',
      })
    })
  })

  describe('Parse transition', () => {
    test('given a last modified timestamp and a transition should parse correnctly into JSON', () => {
      // Arrange
      const modified = 'timestamp'
      const transition = CaseTransition.SUBMIT

      // Act
      const parsedTransition = formatters.parseTransition(modified, transition)

      // Assert
      expect(parsedTransition).toEqual({
        modified: 'timestamp',
        transition: CaseTransition.SUBMIT,
      })
    })
  })

  describe('Parse time', () => {
    test('should return a valid date with time given a valid date and time', () => {
      // Arrange
      const date = '2020-10-24T12:25:00Z'
      const time = '13:37'

      // Act
      const d = formatters.parseTime(date, time)

      // Assert
      expect(d).toEqual('2020-10-24T13:37:00Z')
    })

    test('should return the date given a valid date and an invalid time', () => {
      // Arrange
      const date = '2020-10-24T12:25:00Z'
      const time = '99:00'
      const time2 = ''

      // Act
      const d = formatters.parseTime(date, time)
      const dd = formatters.parseTime(date, time2)

      // Assert
      expect(d).toEqual('2020-10-24')
      expect(dd).toEqual('2020-10-24')
    })
  })

  describe('padTimeWithZero', () => {
    test('should pad a time with single hour value with a zero', () => {
      // Arrange
      const val = '1:15'

      // Act
      const result = formatters.padTimeWithZero(val)

      // Assert
      expect(result).toEqual('01:15')
    })

    test('should return the input value if the value is of lenght 5', () => {
      // Arrange
      const val = '01:15'

      // Act
      const result = formatters.padTimeWithZero(val)

      // Assert
      expect(result).toEqual('01:15')
    })
  })

  describe('replaceTabsOnChange', () => {
    test('should not call replaceTabs if called with a string that does not have a tab character', async () => {
      // Arrange
      const spy = jest.spyOn(formatters, 'replaceTabs')
      render(<input onChange={(evt) => formatters.replaceTabsOnChange(evt)} />)

      // Act
      userEvent.type(await screen.findByRole('textbox'), 'Lorem ipsum')

      // Assert
      expect(spy).not.toBeCalled()
    })
  })
})

describe('Validation', () => {
  describe('Validate police casenumber format', () => {
    test('should fail if not in correct form', () => {
      // Arrange
      const LOKE = 'INCORRECT FORMAT'

      // Act
      const r = validate(LOKE, 'police-casenumber-format')

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
      const r = validate(time, 'time-format')

      // Assert
      expect(r.isValid).toEqual(false)
      expect(r.errorMessage).toEqual('Dæmi: 12:34 eða 1:23')
    })

    test('should be valid if with the hour part is one digit within the 24 hour clock', () => {
      // Arrange
      const time = '1:00'

      // Act
      const r = validate(time, 'time-format')

      // Assert
      expect(r.isValid).toEqual(true)
    })
  })

  describe('Validate national id format', () => {
    test('should be valid if all digits filled in', () => {
      // Arrange
      const nid = '999999-9999'

      // Act
      const r = validate(nid, 'national-id')

      // Assert
      expect(r.isValid).toEqual(true)
    })

    test('should be valid given just the first six digits', () => {
      // Arrange
      const nid = '010101'

      // Act
      const r = validate(nid, 'national-id')

      // Assert
      expect(r.isValid).toEqual(true)
      expect(r.errorMessage).toEqual('')
    })

    test('should not be valid given too few digits', () => {
      // Arrange
      const nid = '99120'

      // Act
      const r = validate(nid, 'national-id')

      // Assert
      expect(r.isValid).toEqual(false)
      expect(r.errorMessage).toEqual('Dæmi: 000000-0000')
    })

    test('should not be valid given invalid number of digits', () => {
      // Arrange
      const nid = '991201-22'

      // Act
      const r = validate(nid, 'national-id')

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
      const validation = validate(invalidEmail, 'email-format')

      // Assert
      expect(validation.isValid).toEqual(false)
      expect(validation.errorMessage).toEqual('Netfang ekki á réttu formi')
    })

    test('should not be valid if the ending is less than two characters', () => {
      // Arrange
      const invalidEmail = 'testATtest.i'

      // Act
      const validation = validate(invalidEmail, 'email-format')

      // Assert
      expect(validation.isValid).toEqual(false)
      expect(validation.errorMessage).toEqual('Netfang ekki á réttu formi')
    })

    test('should be valid if email is empty', () => {
      // Arrange

      // Act
      const validation = validate('', 'email-format')

      // Assert
      expect(validation.isValid).toEqual(true)
    })

    test('should be valid if email contains - and . characters', () => {
      // Arrange
      const validEmail = 'garfield.lasagne-lover@garfield.io'

      // Act
      const validation = validate(validEmail, 'email-format')

      // Assert
      expect(validation.isValid).toEqual(true)
    })

    test('should be valid if email is valid', () => {
      // Arrange
      const validEmail = 'garfield@garfield.io'

      // Act
      const validation = validate(validEmail, 'email-format')

      // Assert
      expect(validation.isValid).toEqual(true)
    })
  })

  describe('Validate phonenumber format', () => {
    test('should fail if not in correct form', () => {
      // Arrange
      const phonenumber = '00292'

      // Act
      const r = validate(phonenumber, 'phonenumber')

      // Assert
      expect(r.isValid).toEqual(false)
      expect(r.errorMessage).toEqual('Dæmi: 555-5555')
    })

    test('should pass if in correct form', () => {
      // Arrange
      const phonenumber = '555-5555'

      // Act
      const r = validate(phonenumber, 'phonenumber')

      // Assert
      expect(r.isValid).toEqual(true)
    })
  })
})

describe('Step helper', () => {
  describe('insertAt', () => {
    test('should insert a string at a certain position into another string', () => {
      // Arrange
      const str = 'Lorem ipsum dolum kara'
      const insertion = ' lara'

      // Act
      const result = formatters.insertAt(str, insertion, 5)

      // Assert
      expect(result).toEqual('Lorem lara ipsum dolum kara')
    })
  })

  describe('isNextDisabled', () => {
    test('should return true if the only validation does not pass', () => {
      // Arrange
      const rf: RequiredField[] = [{ value: '', validations: ['empty'] }]

      // Act
      const ind = isNextDisabled(rf)

      // Assert
      expect(ind).toEqual(true)
    })

    test('should return true if the one validation does not pass and another one does', () => {
      // Arrange
      const rf: RequiredField[] = [
        { value: '', validations: ['empty'] },
        { value: '13:37', validations: ['empty', 'time-format'] },
      ]

      // Act
      const ind = isNextDisabled(rf)

      // Assert
      expect(ind).toEqual(true)
    })

    test('should return false if the all validations pass', () => {
      // Arrange
      const rf: RequiredField[] = [
        { value: 'Lorem ipsum', validations: ['empty'] },
        { value: '13:37', validations: ['empty', 'time-format'] },
      ]

      // Act
      const ind = isNextDisabled(rf)

      // Assert
      expect(ind).toEqual(false)
    })
  })

  describe('removeTabs', () => {
    test('should replace a single tab with a single space', () => {
      // Arrange
      const str = '\t'

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual(' ')
    })

    test('should replace multiple consecutive tabs with a single space', () => {
      // Arrange
      const str = '\t\t\t'

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual(' ')
    })

    test('should remove multiple consecutive tabs with a leading space', () => {
      // Arrange
      const str = ' \t\t\t'

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual(' ')
    })

    test('should remove multiple consecutive tabs with a trailing space', () => {
      // Arrange
      const str = '\t\t\t '

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual(' ')
    })

    test('should process a complicated string with tabs', () => {
      // Arrange
      const str =
        'Lorem\t ipsum dolor \t\tsit amet,\t\t\t\tconsectetur \t\t\t adipiscing elit.'

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual(
        'Lorem ipsum dolor sit amet, consectetur  adipiscing elit.',
      )
    })

    test('should handle undefined', () => {
      // Arrange

      // Act
      const res = formatters.replaceTabs((undefined as unknown) as string)

      // Assert
      expect(res).toBeUndefined()
    })

    test('should handle string with no tabs', () => {
      // Arrange
      const str = '020-0202-2929'

      // Act
      const res = formatters.replaceTabs(str)

      // Assert
      expect(res).toEqual('020-0202-2929')
    })
  })

  describe('isDirty', () => {
    test('should return true if value is an empty string', () => {
      // Arrange
      const emptyString = ''

      // Act
      const result = isDirty(emptyString)

      // Assert
      expect(result).toEqual(true)
    })

    test('should return true if value is a non empty string', () => {
      // Arrange
      const str = 'test'

      // Act
      const result = isDirty(str)

      // Assert
      expect(result).toEqual(true)
    })

    test('should return false if value is undefined or null', () => {
      // Arrange
      const und = undefined
      const n = null

      // Act
      const resultUnd = isDirty(und)
      const resultN = isDirty(n)

      // Assert
      expect(resultUnd).toEqual(false)
      expect(resultN).toEqual(false)
    })
  })

  describe('getShortGender', () => {
    test('should return short genders given a valid gender', () => {
      // Arrange
      const male = CaseGender.MALE
      const female = CaseGender.FEMALE
      const other = CaseGender.OTHER

      // Act
      const resultM = getShortGender(male)
      const resultF = getShortGender(female)
      const resultO = getShortGender(other)

      // Assert
      expect(resultM).toEqual('kk')
      expect(resultF).toEqual('kvk')
      expect(resultO).toEqual('annað')
    })

    test('should return an empty string when not given a gender', () => {
      // Arrange
      const str = undefined

      // Act
      const res = getShortGender(str)

      // Assert
      expect(res).toEqual('')
    })
  })
})
