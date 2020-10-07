import {
  formatDate,
  parseArray,
  parseString,
  parseTransition,
} from './formatters'
import * as Constants from './constants'
import { constructConclusion, renderRestrictons } from './stepHelper'
import { Case, CustodyRestrictions } from '../types'
import { CaseTransition } from '@island.is/judicial-system/types'
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
        custodyRestrictions: [CustodyRestrictions.MEDIA],
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
          CustodyRestrictions.MEDIA,
          CustodyRestrictions.VISITAION,
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
  })

  test('should return the correct string if there are more than two restriction and the case is not being rejected', () => {
    // Arrange
    const wc = {
      rejecting: false,
      custodyRestrictions: [
        CustodyRestrictions.MEDIA,
        CustodyRestrictions.VISITAION,
        CustodyRestrictions.ISOLATION,
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
