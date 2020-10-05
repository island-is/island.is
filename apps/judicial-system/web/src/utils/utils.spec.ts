import {
  formatDate,
  parseArray,
  parseString,
  parseTransition,
} from './formatters'
import * as Constants from './constants'
import { renderRestrictons } from './stepHelper'
import { CustodyRestrictions } from '../types'
import { CaseTransition } from '@island.is/judicial-system/types'
import { validate } from './validate'

describe('Formatters utils', () => {
  describe('Parse array', () => {
    test('given a property name and an array of strings should parse correctly into JSON', () => {
      // Arrange
      const property = 'test'
      const array = ['lorem', 'ipsum']

      // Act
      const parsedArray = parseArray(property, array)

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
      const parsedString = parseString(property, value)

      // Assert
      expect(parsedString).toEqual({ test: 'lorem' })
    })

    test('given a value with special characters should parse correctly into JSON', () => {
      //Arrange
      const property = 'test'
      const value = `lorem
ipsum`

      // Act
      const parsedString = parseString(property, value)

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
      const parsedTransition = parseTransition(modified, transition)

      // Assert
      expect(parsedTransition).toEqual({
        modified: 'timestamp',
        transition: CaseTransition.SUBMIT,
      })
    })
  })

  describe('formatDate', () => {
    test('should return null if date parameter is not provided or is invalid', () => {
      // Arrange
      const date = null
      const date2 = undefined

      // Act
      const time = formatDate(date, Constants.TIME_FORMAT)
      const time2 = formatDate(date2, Constants.TIME_FORMAT)

      // Assert
      expect(time).toBeNull()
      expect(time2).toBeNull()
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
  })
})

describe('Step helper', () => {
  describe('renderRestrictions', () => {
    test('should return a comma separated list of restrictions', () => {
      // Arrange
      const restrictions: CustodyRestrictions[] = [
        CustodyRestrictions.ISOLATION,
        CustodyRestrictions.COMMUNICATION,
      ]

      // Act
      const r = renderRestrictons(restrictions)

      // Assert
      expect(r).toEqual('B - Einangrun, D - Bréfskoðun, símabann')
    })

    test('should return "Lausgæsla" if no custody restriction is supplyed', () => {
      // Arrange
      const restrictions: CustodyRestrictions[] = []

      // Act
      const r = renderRestrictons(restrictions)

      // Assert
      expect(r).toEqual('Lausagæsla')
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
      expect(r.errorMessage).toEqual('Ekki á réttu formi')
    })
  })

  describe('Validate national id format', () => {
    test('should fail if not in correct form', () => {
      // Arrange
      const nid = '999999-9999'

      // Act
      const r = validate(nid, 'national-id')

      // Assert
      expect(r.isValid).toEqual(false)
      expect(r.errorMessage).toEqual('Ekki á réttu formi')
    })
  })
})
