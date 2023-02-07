import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  Gender,
  IndictmentSubtype,
  IndictmentSubtypeMap,
} from '@island.is/judicial-system/types'
import { getShortGender, hasIndictmentSubtype, isDirty } from './stepHelper'

import * as formatters from './formatters'

describe('Formatters utils', () => {
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

  describe('enumerate', () => {
    test('should enumerate list with three values', () => {
      // Arrange
      const values = ['alice', 'bob', 'paul']
      const endWord = 'and'

      // Act
      const result = formatters.enumerate(values, endWord)

      //Assert
      expect(result).toBe('alice, bob and paul')
    })

    test('should enumerate list with two values', () => {
      // Arrange
      const values = ['alice', 'bob']
      const endWord = 'or'

      // Act
      const result = formatters.enumerate(values, endWord)

      //Assert
      expect(result).toBe('alice or bob')
    })

    test('should enumerate list with one value', () => {
      // Arrange
      const values = ['alice']
      const endWord = 'and'

      // Act
      const result = formatters.enumerate(values, endWord)

      //Assert
      expect(result).toBe('alice')
    })

    test('should handle empty list', () => {
      // Arrange
      const values: string[] = []
      const endWord = 'and'

      // Act
      const result = formatters.enumerate(values, endWord)

      //Assert
      expect(result).toBe('')
    })
  })
})

describe('Step helper', () => {
  describe('hasIndictmentSubtype', () => {
    test('should return true if indictment subtype is in the list of indictment subtypes', () => {
      // Arrange
      const indictmentSubtype = IndictmentSubtype.BREAKING_AND_ENTERING
      const indictmentSubtypes: IndictmentSubtypeMap = {
        '213': [
          IndictmentSubtype.BREAKING_AND_ENTERING,
          IndictmentSubtype.AGGRAVATED_ASSAULT,
        ],
      }

      // Act
      const result = hasIndictmentSubtype(indictmentSubtypes, indictmentSubtype)

      // Assert
      expect(result).toBe(true)
    })

    test('should return false if indictment subtypes are undefined', () => {
      // Arrange
      const indictmentSubtype = IndictmentSubtype.BREAKING_AND_ENTERING
      const indictmentSubtypes = undefined

      // Act
      const result = hasIndictmentSubtype(indictmentSubtypes, indictmentSubtype)

      // Assert
      expect(result).toBe(false)
    })
  })

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
      const male = Gender.MALE
      const female = Gender.FEMALE
      const other = Gender.OTHER

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
