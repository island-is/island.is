import { CaseAppealDecision, isAppealed } from './case'
import type { Case } from './case'

describe('isAppealed', () => {
  it('should be false when noone has appealed', () => {
    // Arrange
    const theCase = {} as Case

    // Act
    const res = isAppealed(theCase)

    // Assert
    expect(res).toBe(false)
  })

  it('should be true when the accuesed appealed in court', () => {
    // Arrange
    const theCase = { accusedAppealDecision: CaseAppealDecision.APPEAL } as Case

    // Act
    const res = isAppealed(theCase)

    // Assert
    expect(res).toBe(true)
  })

  it('should be true when the prosecutor appealed in court', () => {
    // Arrange
    const theCase = {
      prosecutorAppealDecision: CaseAppealDecision.APPEAL,
    } as Case

    // Act
    const res = isAppealed(theCase)

    // Assert
    expect(res).toBe(true)
  })

  it('should be true when the accuesed appealed out of court', () => {
    // Arrange
    const theCase = {
      accusedPostponedAppealDate: '2021-09-30T12:00:00.000Z',
    } as Case

    // Act
    const res = isAppealed(theCase)

    // Assert
    expect(res).toBe(true)
  })

  it('should be true when the prosecutor appealed out of court', () => {
    // Arrange
    const theCase = {
      prosecutorPostponedAppealDate: '2021-09-30T12:00:00.000Z',
    } as Case

    // Act
    const res = isAppealed(theCase)

    // Assert
    expect(res).toBe(true)
  })
})
