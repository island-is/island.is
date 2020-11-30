import { Case } from '../models'
import { transformCase } from './case.transformer'

describe('transformCase', () => {
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
