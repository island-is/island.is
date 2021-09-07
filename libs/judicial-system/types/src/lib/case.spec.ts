import { CaseAppealDecision, CaseState, hasCaseBeenAppealed } from './case'
import type { Case } from './case'

describe('isAppealed', () => {
  it('should be true when the accuesed appealed in court', () => {
    // Arrange
    const theCase = {
      accusedAppealDecision: CaseAppealDecision.APPEAL,
      state: CaseState.ACCEPTED,
    } as Case

    // Act
    const res = hasCaseBeenAppealed(theCase)

    // Assert
    expect(res).toBe(true)
  })

  it('should be true when the prosecutor appealed in court', () => {
    // Arrange
    const theCase = {
      prosecutorAppealDecision: CaseAppealDecision.APPEAL,
      state: CaseState.REJECTED,
    } as Case

    // Act
    const res = hasCaseBeenAppealed(theCase)

    // Assert
    expect(res).toBe(true)
  })

  it('should be true when the accuesed appealed out of court', () => {
    // Arrange
    const theCase = {
      accusedPostponedAppealDate: '2021-09-30T12:00:00.000Z',
      state: CaseState.REJECTED,
    } as Case

    // Act
    const res = hasCaseBeenAppealed(theCase)

    // Assert
    expect(res).toBe(true)
  })

  it('should be true when the prosecutor appealed out of court', () => {
    // Arrange
    const theCase = {
      prosecutorPostponedAppealDate: '2021-09-30T12:00:00.000Z',
      state: CaseState.ACCEPTED,
    } as Case

    // Act
    const res = hasCaseBeenAppealed(theCase)

    // Assert
    expect(res).toBe(true)
  })

  it('should be false when noone has appealed', () => {
    // Arrange
    const theCase = {
      accusedAppealDecision: CaseAppealDecision.POSTPONE,
      prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
      state: CaseState.ACCEPTED,
    } as Case

    // Act
    const res = hasCaseBeenAppealed(theCase)

    // Assert
    expect(res).toBe(false)
  })

  it('should be false when the case is not completed', () => {
    // Arrange
    const theCase = { accusedAppealDecision: CaseAppealDecision.APPEAL } as Case

    // Act
    const res = hasCaseBeenAppealed(theCase)

    // Assert
    expect(res).toBe(false)
  })
})
