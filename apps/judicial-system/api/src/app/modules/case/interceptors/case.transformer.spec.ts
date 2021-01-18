import { Case } from '../models'
import { transformCase } from './case.transformer'

describe('transformCase', () => {
  describe('alternativeTravelBan', () => {
    it('should not change a true value', () => {
      // Arrange
      const theCase = {
        alternativeTravelBan: true,
      } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.alternativeTravelBan).toBe(true)
    })

    it('should not change a false value', () => {
      // Arrange
      const theCase = {
        alternativeTravelBan: false,
      } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.alternativeTravelBan).toBe(false)
    })

    it('should should change a null value to false', () => {
      // Arrange
      const theCase = {} as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.alternativeTravelBan).toBe(false)
    })
  })
  describe('isCourtDateInThePast', () => {
    it('should not set court date in the past if no court date', () => {
      // Arrange
      const theCase = {} as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isCourtDateInThePast).toBeUndefined()
    })

    it('should set court date in the past to false if court date in the future', () => {
      // Arrange
      const courtDate = new Date()
      courtDate.setSeconds(courtDate.getSeconds() + 1)
      const theCase = { courtDate: courtDate.toISOString() } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isCourtDateInThePast).toBe(false)
    })

    it('should set court date in the past to true if court date is more than five minutes in the past', () => {
      // Arrange
      const courtDate = new Date()
      courtDate.setMinutes(courtDate.getMinutes() - 5)
      courtDate.setSeconds(courtDate.getSeconds() - 1)
      const theCase = { courtDate: courtDate.toISOString() } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isCourtDateInThePast).toBe(true)
    })

    it('should set court date in the past to false if court date less than five minutes in the past', () => {
      // Arrange
      const courtDate = new Date()
      courtDate.setMinutes(courtDate.getMinutes() - 4)
      courtDate.setSeconds(courtDate.getSeconds() - 59)
      const theCase = { courtDate: courtDate.toISOString() } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isCourtDateInThePast).toBe(false)
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
})
