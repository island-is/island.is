import { Case } from '../models'
import { transformCase } from './case.transformer'

describe('transformCase', () => {
  describe('sendRequestToDefender', () => {
    it('should set undefined to false', () => {
      // Arrange
      const theCase = {} as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.sendRequestToDefender).toBe(false)
    })

    it('should leave false unchanged', () => {
      // Arrange
      const theCase = { sendRequestToDefender: false } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.sendRequestToDefender).toBe(false)
    })

    it('should leave true unchanged', () => {
      // Arrange
      const theCase = { sendRequestToDefender: true } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.sendRequestToDefender).toBe(true)
    })
  })
  describe('defenderIsSpokesperson', () => {
    it('should set undefined to false', () => {
      // Arrange
      const theCase = {} as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.defenderIsSpokesperson).toBe(false)
    })

    it('should leave false unchanged', () => {
      // Arrange
      const theCase = { defenderIsSpokesperson: false } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.defenderIsSpokesperson).toBe(false)
    })

    it('should leave true unchanged', () => {
      // Arrange
      const theCase = { defenderIsSpokesperson: true } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.defenderIsSpokesperson).toBe(true)
    })
  })

  describe('requestProsecutorOnlySession', () => {
    it('should set undefined to false', () => {
      // Arrange
      const theCase = {} as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.requestProsecutorOnlySession).toBe(false)
    })

    it('should leave false unchanged', () => {
      // Arrange
      const theCase = { requestProsecutorOnlySession: false } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.requestProsecutorOnlySession).toBe(false)
    })

    it('should leave true unchanged', () => {
      // Arrange
      const theCase = { requestProsecutorOnlySession: true } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.requestProsecutorOnlySession).toBe(true)
    })
  })

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
