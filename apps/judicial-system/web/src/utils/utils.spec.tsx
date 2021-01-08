import {
  insertAt,
  padTimeWithZero,
  parseArray,
  parseString,
  parseTime,
  parseTransition,
  replaceTabs,
  replaceTabsOnChange,
} from './formatters'
import * as formatters from './formatters'
import {
  constructConclusion,
  constructProsecutorDemands,
  getShortGender,
  isDirty,
  isNextDisabled,
} from './stepHelper'
import { RequiredField } from '../types'
import {
  CaseTransition,
  CaseCustodyRestrictions,
  Case,
  CaseGender,
  CaseDecision,
} from '@island.is/judicial-system/types'
import { validate } from './validate'
import { render, screen } from '@testing-library/react'
import React from 'react'
import userEvent from '@testing-library/user-event'

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

  describe('padTimeWithZero', () => {
    test('should pad a time with single hour value with a zero', () => {
      // Arrange
      const val = '1:15'

      // Act
      const result = padTimeWithZero(val)

      // Assert
      expect(result).toEqual('01:15')
    })

    test('should return the input value if the value is of lenght 5', () => {
      // Arrange
      const val = '01:15'

      // Act
      const result = padTimeWithZero(val)

      // Assert
      expect(result).toEqual('01:15')
    })
  })

  describe('replaceTabsOnChange', () => {
    test('should not call replaceTabs if called with a string that does not have a tab character', () => {
      // Arrange
      const spy = jest.spyOn(formatters, 'replaceTabs')
      render(<input onChange={(evt) => replaceTabsOnChange(evt)} />)

      // Act
      userEvent.type(screen.getByRole('textbox'), 'Lorem ipsum')

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
    test('should fail if not in correct form', () => {
      // Arrange
      const nid = '999999-9999'

      // Act
      const r = validate(nid, 'national-id')

      // Assert
      expect(r.isValid).toEqual(false)
      expect(r.errorMessage).toEqual('Dæmi: 012345-6789')
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
      expect(r.errorMessage).toEqual('Dæmi: 012345-6789')
    })

    test('should not be valid given an invalid month', () => {
      // Arrange
      const nid = '019901'

      // Act
      const r = validate(nid, 'national-id')

      // Assert
      expect(r.isValid).toEqual(false)
      expect(r.errorMessage).toEqual('Dæmi: 012345-6789')
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
})

describe('Step helper', () => {
  describe('insertAt', () => {
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
      const wc = {
        decision: CaseDecision.REJECTING,
        accusedName: 'Mikki Refur',
        accusedNationalId: '1212121299',
      }

      // Act
      const { getByText } = render(constructConclusion(wc as Case))

      // Assert
      expect(
        getByText((_, node) => {
          // Credit: https://www.polvara.me/posts/five-things-you-didnt-know-about-testing-library/
          const hasText = (node: Element) =>
            node.textContent ===
            'Beiðni um gæslu á hendur, Mikki Refur kt.121212-1299, er hafnað.'

          const nodeHasText = hasText(node)
          const childrenDontHaveText = Array.from(node.children).every(
            (child) => !hasText(child),
          )

          return nodeHasText && childrenDontHaveText
        }),
      ).toBeTruthy()
    })

    test('should return the correct string if there are no restrictions and the case is not being rejected', () => {
      // Arrange
      const wc = {
        id: 'testid',
        created: 'test',
        modified: 'test',
        state: 'DRAFT',
        policeCaseNumber: 'test',
        decision: CaseDecision.ACCEPTING,
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
            'Kærði, Doe kt. 012345-6789 skal sæta gæsluvarðhaldi, þó ekki lengur en til 22. október 2020 kl. 12:31. Engar takmarkanir skulu vera á gæslunni.'

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
        decision: CaseDecision.ACCEPTING,
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
            'Kærði, Doe kt. 012345-6789 skal sæta gæsluvarðhaldi, þó ekki lengur en til 22. október 2020 kl. 12:31. Kærði skal sæta fjölmiðlabanni á meðan á gæsluvarðhaldinu stendur.'

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
        decision: CaseDecision.ACCEPTING,
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
            `Kærði, Doe kt. 012345-6789 skal sæta gæsluvarðhaldi, þó ekki lengur en til 22. október 2020 kl. 12:31. Kærði skal sæta fjölmiðlabanni og heimsóknarbanni á meðan á gæsluvarðhaldinu stendur.`

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
        decision: CaseDecision.ACCEPTING,
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
            'Kærði, Doe kt. 012345-6789 skal sæta gæsluvarðhaldi, þó ekki lengur en til 22. október 2020 kl. 12:31. Kærði skal sæta fjölmiðlabanni, heimsóknarbanni og einangrun á meðan á gæsluvarðhaldinu stendur.'

          const nodeHasText = hasText(node)
          const childrenDontHaveText = Array.from(node.children).every(
            (child) => !hasText(child),
          )

          return nodeHasText && childrenDontHaveText
        }),
      ).toBeTruthy()
    })

    test('should return the correct string if the case is accepted with travel ban', () => {
      // Arrange
      const wc = {
        decision: CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
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
            'Kærði, Doe kt.012345-6789, skal sæta farbanni, þó ekki lengur en til 22. október 2020 kl. 12:31.'

          const nodeHasText = hasText(node)
          const childrenDontHaveText = Array.from(node.children).every(
            (child) => !hasText(child),
          )

          return nodeHasText && childrenDontHaveText
        }),
      ).toBeTruthy()
    })
  })

  describe('constructPoliceDemands', () => {
    test('should render a message if requestedCustodyEndDate is not set', () => {
      // Arrange
      const wc = {
        decision: CaseDecision.ACCEPTING,
        custodyRestrictions: [
          CaseCustodyRestrictions.MEDIA,
          CaseCustodyRestrictions.VISITAION,
          CaseCustodyRestrictions.ISOLATION,
        ],
        accusedName: 'Doe',
        accusedNationalId: '0123456789',
        custodyEndDate: '2020-11-26T12:31:00.000Z',
        requestedCustodyEndDate: undefined,
      }

      // Act
      const { getByText } = render(constructProsecutorDemands(wc as Case))

      // Assert
      expect(
        getByText((_, node) => {
          // Credit: https://www.polvara.me/posts/five-things-you-didnt-know-about-testing-library/
          const hasText = (node: Element) =>
            node.textContent === 'Saksóknari hefur ekki fyllt út dómkröfur.'

          const nodeHasText = hasText(node)
          const childrenDontHaveText = Array.from(node.children).every(
            (child) => !hasText(child),
          )

          return nodeHasText && childrenDontHaveText
        }),
      ).toBeTruthy()
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
      const res = replaceTabs(str)

      // Assert
      expect(res).toEqual(' ')
    })

    test('should replace multiple consecutive tabs with a single space', () => {
      // Arrange
      const str = '\t\t\t'

      // Act
      const res = replaceTabs(str)

      // Assert
      expect(res).toEqual(' ')
    })

    test('should remove multiple consecutive tabs with a leading space', () => {
      // Arrange
      const str = ' \t\t\t'

      // Act
      const res = replaceTabs(str)

      // Assert
      expect(res).toEqual(' ')
    })

    test('should remove multiple consecutive tabs with a trailing space', () => {
      // Arrange
      const str = '\t\t\t '

      // Act
      const res = replaceTabs(str)

      // Assert
      expect(res).toEqual(' ')
    })

    test('should process a complicated string with tabs', () => {
      // Arrange
      const str =
        'Lorem\t ipsum dolor \t\tsit amet,\t\t\t\tconsectetur \t\t\t adipiscing elit.'

      // Act
      const res = replaceTabs(str)

      // Assert
      expect(res).toEqual(
        'Lorem ipsum dolor sit amet, consectetur  adipiscing elit.',
      )
    })

    test('should handle undefined', () => {
      // Arrange

      // Act
      const res = replaceTabs((undefined as unknown) as string)

      // Assert
      expect(res).toBeUndefined()
    })

    test('should handle string with no tabs', () => {
      // Arrange
      const str = '020-0202-2929'

      // Act
      const res = replaceTabs(str)

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
