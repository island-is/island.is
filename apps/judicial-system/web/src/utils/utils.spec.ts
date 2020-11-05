import {
  insertAt,
  parseArray,
  parseString,
  parseTime,
  parseTransition,
} from './formatters'
import { constructConclusion, isNextDisabled } from './stepHelper'
import { RequiredField } from '../types'
import {
  CaseTransition,
  CaseCustodyRestrictions,
  Case,
} from '@island.is/judicial-system/types'
import { validate } from './validate'
import { render } from '@testing-library/react'

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

  describe('Parse time', () => {
    test('should return a valid date with time given a valid date and time', () => {
      // Arrange
      const date = '2020-10-24T12:25:00Z'
      const time = '13:37'

      // Act
      const d = parseTime(date, time)

      // Assert
      expect(d).toEqual('2020-10-24T13:37:00Z')
    })

    test('should return the date given a valid date and an invalid time', () => {
      // Arrange
      const date = '2020-10-24T12:25:00Z'
      const time = '99:00'
      const time2 = ''

      // Act
      const d = parseTime(date, time)
      const dd = parseTime(date, time2)

      // Assert
      expect(d).toEqual('2020-10-24')
      expect(dd).toEqual('2020-10-24')
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

  describe('Validate time format', () => {
    test('should fail if not in correct form', () => {
      // Arrange
      const time = '99:00'

      // Act
      const r = validate(time, 'time-format')

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

    test('should be valid given just the first six digits', () => {
      // Arrange
      const nid = '010101'

      // Act
      const r = validate(nid, 'national-id')

      // Assert
      expect(r.isValid).toEqual(true)
      expect(r.errorMessage).toEqual('')
    })

    test('should not be valid given an invalid day', () => {
      // Arrange
      const nid = '991201'

      // Act
      const r = validate(nid, 'national-id')

      // Assert
      expect(r.isValid).toEqual(false)
      expect(r.errorMessage).toEqual('Ekki á réttu formi')
    })

    test('should not be valid given an invalid month', () => {
      // Arrange
      const nid = '019901'

      // Act
      const r = validate(nid, 'national-id')

      // Assert
      expect(r.isValid).toEqual(false)
      expect(r.errorMessage).toEqual('Ekki á réttu formi')
    })
  })
})

describe('Step helper', () => {
  describe('insertAt()', () => {
    test('should insert a string at a certain position into another string', () => {
      // Arrange
      const str = 'Lorem ipsum dolum kara'
      const insertion = ' lara'

      // Act
      const result = insertAt(str, insertion, 5)

      // Assert
      expect(result).toEqual('Lorem lara ipsum dolum kara')
    })
  })

  describe('constructConclution', () => {
    test('should return rejected message if the case is being rejected', () => {
      // Arrange
      const wc = { rejecting: true }

      // Act
      const { getByText } = render(constructConclusion(wc as Case))

      // Assert
      expect(getByText('Beiðni um gæsluvarðhald hafnað')).toBeTruthy()
    })

    test('should return the correct string if there are no restrictions and the case is not being rejected', () => {
      // Arrange
      const wc = {
        rejecting: false,
        custodyRestrictions: [],
        accusedName: 'Doe',
        accusedNationalId: '0123456789',
        custodyEndDate: '2020-10-22T12:31:00.000Z',
      }

      // Act
      const { getByText } = render(constructConclusion(wc as Case))

      // Assert
      expect(
        getByText((_, node) => {
          // Credit: https://www.polvara.me/posts/five-things-you-didnt-know-about-testing-library/
          const hasText = (node: Element) =>
            node.textContent ===
            'Kærði, Doe kt.0123456789 skal sæta gæsluvarðhaldi, þó ekki lengur en til 22. október 2020 kl. 12:31. Engar takmarkanir skulu vera á gæslunni.'

          const nodeHasText = hasText(node)
          const childrenDontHaveText = Array.from(node.children).every(
            (child) => !hasText(child),
          )

          return nodeHasText && childrenDontHaveText
        }),
      ).toBeTruthy()
    })

    test('should return the correct string if there is one restriction and the case is not being rejected', () => {
      // Arrange
      const wc = {
        rejecting: false,
        custodyRestrictions: [CaseCustodyRestrictions.MEDIA],
        accusedName: 'Doe',
        accusedNationalId: '0123456789',
        custodyEndDate: '2020-10-22T12:31:00.000Z',
      }

      // Act
      const { getByText } = render(constructConclusion(wc as Case))

      // Assert
      expect(
        getByText((_, node) => {
          // Credit: https://www.polvara.me/posts/five-things-you-didnt-know-about-testing-library/
          const hasText = (node: Element) =>
            node.textContent ===
            'Kærði, Doe kt.0123456789 skal sæta gæsluvarðhaldi, þó ekki lengur en til 22. október 2020 kl. 12:31. Kærði skal sæta fjölmiðlabanni á meðan á gæsluvarðhaldinu stendur.'

          const nodeHasText = hasText(node)
          const childrenDontHaveText = Array.from(node.children).every(
            (child) => !hasText(child),
          )

          return nodeHasText && childrenDontHaveText
        }),
      ).toBeTruthy()
    })

    test('should return the correct string if there are two restriction and the case is not being rejected', () => {
      // Arrange
      const wc = {
        rejecting: false,
        custodyRestrictions: [
          CaseCustodyRestrictions.MEDIA,
          CaseCustodyRestrictions.VISITAION,
        ],
        accusedName: 'Doe',
        accusedNationalId: '0123456789',
        custodyEndDate: '2020-10-22T12:31:00.000Z',
      }

      // Act
      const { getByText } = render(constructConclusion(wc as Case))

      // Assert
      expect(
        getByText((_, node) => {
          // Credit: https://www.polvara.me/posts/five-things-you-didnt-know-about-testing-library/
          const hasText = (node: Element) =>
            node.textContent ===
            `Kærði, Doe kt.0123456789 skal sæta gæsluvarðhaldi, þó ekki lengur en til 22. október 2020 kl. 12:31. Kærði skal sæta fjölmiðlabanni og heimsóknarbanni á meðan á gæsluvarðhaldinu stendur.`

          const nodeHasText = hasText(node)
          const childrenDontHaveText = Array.from(node.children).every(
            (child) => !hasText(child),
          )

          return nodeHasText && childrenDontHaveText
        }),
      ).toBeTruthy()
    })

    test('should return the correct string if there are more than two restriction and the case is not being rejected', () => {
      // Arrange
      const wc = {
        rejecting: false,
        custodyRestrictions: [
          CaseCustodyRestrictions.MEDIA,
          CaseCustodyRestrictions.VISITAION,
          CaseCustodyRestrictions.ISOLATION,
        ],
        accusedName: 'Doe',
        accusedNationalId: '0123456789',
        custodyEndDate: '2020-10-22T12:31:00.000Z',
      }

      // Act
      const { getByText } = render(constructConclusion(wc as Case))

      // Assert
      expect(
        getByText((_, node) => {
          // Credit: https://www.polvara.me/posts/five-things-you-didnt-know-about-testing-library/
          const hasText = (node: Element) =>
            node.textContent ===
            'Kærði, Doe kt.0123456789 skal sæta gæsluvarðhaldi, þó ekki lengur en til 22. október 2020 kl. 12:31. Kærði skal sæta fjölmiðlabanni, heimsóknarbanni og einangrun á meðan á gæsluvarðhaldinu stendur.'

          const nodeHasText = hasText(node)
          const childrenDontHaveText = Array.from(node.children).every(
            (child) => !hasText(child),
          )

          return nodeHasText && childrenDontHaveText
        }),
      ).toBeTruthy()
    })
  })
  describe('isNextDisabled()', () => {
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

    test('should return true if a value is undefined', () => {
      // Arrange
      const rf: RequiredField[] = [{ value: undefined, validations: ['empty'] }]

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
})
