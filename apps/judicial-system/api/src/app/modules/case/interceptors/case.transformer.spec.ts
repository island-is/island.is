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

  describe('isCustodyEndDateInThePast', () => {
    it('should not set custody end date in the past if no custody end date', () => {
      // Arrange
      const theCase = {} as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isCustodyEndDateInThePast).toBeUndefined()
    })

    it('should set custody end date in the past to false if custody end date in the future', () => {
      // Arrange
      const custodyEndDate = new Date()
      custodyEndDate.setSeconds(custodyEndDate.getSeconds() + 1)
      const theCase = { custodyEndDate: custodyEndDate.toISOString() } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isCustodyEndDateInThePast).toBe(false)
    })

    it('should set custody end date in the past to true if custody end date in the past', () => {
      // Arrange
      const custodyEndDate = new Date()
      custodyEndDate.setSeconds(custodyEndDate.getSeconds() - 1)
      const theCase = { custodyEndDate: custodyEndDate.toISOString() } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isCustodyEndDateInThePast).toBe(true)
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
