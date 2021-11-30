import each from 'jest-each'

import { Case } from '../models'
import { transformCase } from './case.transformer'

describe('transformCase', () => {
  each`
    originalValue | transformedValue
    ${null}       | ${false}
    ${false}      | ${false}
    ${true}       | ${true}
  `.describe(
    'when transforming boolean case attributes',
    ({ originalValue, transformedValue }) => {
      it(`should transform ${originalValue} sendRequestToDefender to ${transformedValue}`, () => {
        // Arrange
        const theCase = { sendRequestToDefender: originalValue } as Case

        // Act
        const res = transformCase(theCase)

        // Assert
        expect(res.sendRequestToDefender).toBe(transformedValue)
      })

      it(`should transform ${originalValue} defenderIsSpokesperson to ${transformedValue}`, () => {
        // Arrange
        const theCase = { defenderIsSpokesperson: originalValue } as Case

        // Act
        const res = transformCase(theCase)

        // Assert
        expect(res.defenderIsSpokesperson).toBe(transformedValue)
      })

      it(`should transform ${originalValue} requestProsecutorOnlySession to ${transformedValue}`, () => {
        // Arrange
        const theCase = { requestProsecutorOnlySession: originalValue } as Case

        // Act
        const res = transformCase(theCase)

        // Assert
        expect(res.requestProsecutorOnlySession).toBe(transformedValue)
      })

      it(`should transform ${originalValue} isClosedCourtHidden to ${transformedValue}`, () => {
        // Arrange
        const theCase = { isClosedCourtHidden: originalValue } as Case

        // Act
        const res = transformCase(theCase)

        // Assert
        expect(res.isClosedCourtHidden).toBe(transformedValue)
      })

      it(`should transform ${originalValue} isHightenedSecurityLevel to ${transformedValue}`, () => {
        // Arrange
        const theCase = { isHeightenedSecurityLevel: originalValue } as Case

        // Act
        const res = transformCase(theCase)

        // Assert
        expect(res.isHeightenedSecurityLevel).toBe(transformedValue)
      })

      it(`should transform ${originalValue} isMasked to ${transformedValue}`, () => {
        // Arrange
        const theCase = { isMasked: originalValue } as Case

        // Act
        const res = transformCase(theCase)

        // Assert
        expect(res.isMasked).toBe(transformedValue)
      })
    },
  )

  describe('isValidToDateInThePast', () => {
    it('should not set custody end date in the past if no custody end date', () => {
      // Arrange
      const theCase = {} as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isValidToDateInThePast).toBeUndefined()
    })

    it('should set custody end date in the past to false if custody end date in the future', () => {
      // Arrange
      const validToDate = new Date()
      validToDate.setSeconds(validToDate.getSeconds() + 1)
      const theCase = { validToDate: validToDate.toISOString() } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isValidToDateInThePast).toBe(false)
    })

    it('should set custody end date in the past to true if custody end date in the past', () => {
      // Arrange
      const validToDate = new Date()
      validToDate.setSeconds(validToDate.getSeconds() - 1)
      const theCase = { validToDate: validToDate.toISOString() } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isValidToDateInThePast).toBe(true)
    })
  })

  describe('isAppealDeadlineExpired', () => {
    it('should be false when no ruling date is set', () => {
      // Arrange
      const theCase = {} as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isAppealDeadlineExpired).toBe(false)
    })

    it('should be false while the appeal window is open', () => {
      // Arrange
      const rulingDate = new Date()
      rulingDate.setDate(rulingDate.getDate() - 3)
      rulingDate.setSeconds(rulingDate.getSeconds() + 1)
      const theCase = { rulingDate: rulingDate.toISOString() } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isAppealDeadlineExpired).toBe(false)
    })

    it('should be true when the appeal window has closed', () => {
      // Arrange
      const rulingDate = new Date()
      rulingDate.setDate(rulingDate.getDate() - 3)
      const theCase = { rulingDate: rulingDate.toISOString() } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isAppealDeadlineExpired).toBe(true)
    })
  })

  describe('isAppealGracePeriodExpired', () => {
    it('should be false when no ruling date is set', () => {
      // Arrange
      const theCase = {} as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isAppealGracePeriodExpired).toBe(false)
    })

    it('should be false while the appeal window is open', () => {
      // Arrange
      const rulingDate = new Date()
      rulingDate.setDate(rulingDate.getDate() - 7)
      rulingDate.setSeconds(rulingDate.getSeconds() + 1)
      const theCase = { rulingDate: rulingDate.toISOString() } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isAppealGracePeriodExpired).toBe(false)
    })

    it('should be true when the appeal window has closed', () => {
      // Arrange
      const rulingDate = new Date()
      rulingDate.setDate(rulingDate.getDate() - 7)
      const theCase = { rulingDate: rulingDate.toISOString() } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isAppealGracePeriodExpired).toBe(true)
    })
  })
})
