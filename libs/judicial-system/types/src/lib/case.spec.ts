import each from 'jest-each'

import {
  CaseAppealDecision,
  CaseState,
  CaseType,
  hasCaseBeenAppealed,
  isInvestigationCase,
  isRestrictionCase,
} from './case'
import type { Case } from './case'

describe('Case Type', () => {
  each`
    type
    ${CaseType.Custody}
    ${CaseType.TravelBan}
    ${CaseType.AdmissionToFacility}
  `.it('should categorize $type as a restriction case', ({ type }) => {
    expect(isRestrictionCase(type)).toBe(true)
    expect(isInvestigationCase(type)).toBe(false)
  })

  each`
    type
    ${CaseType.SearchWarrant}
    ${CaseType.BankingSecrecyWaiver}
    ${CaseType.PhoneTapping}
    ${CaseType.Telecommunications}
    ${CaseType.TrackingEquipment}
    ${CaseType.PsychiatricExamination}
    ${CaseType.SoundRecordingEquipment}
    ${CaseType.Autopsy}
    ${CaseType.BodySearch}
    ${CaseType.InternetUsage}
    ${CaseType.RestrainingOrder}
    ${CaseType.RestrainingOrderAndExpulsionFromHome}
    ${CaseType.ExpulsionFromHome}
    ${CaseType.ElectronicDataDiscoveryInvestigation}
    ${CaseType.VideoRecordingEquipment}
    ${CaseType.Other}
  `.it('should categorize $type as an investigation case', ({ type }) => {
    expect(isRestrictionCase(type)).toBe(false)
    expect(isInvestigationCase(type)).toBe(true)
  })

  it('should not categorize undefined', () => {
    expect(isRestrictionCase(undefined)).toBe(false)
    expect(isInvestigationCase(undefined)).toBe(false)
  })
})

describe('isAppealed', () => {
  it('should be true when the accuesed appealed in court', () => {
    // Arrange
    const theCase = {
      accusedAppealDecision: CaseAppealDecision.Appeal,
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
      prosecutorAppealDecision: CaseAppealDecision.Appeal,
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
      accusedAppealDecision: CaseAppealDecision.Postpone,
      prosecutorAppealDecision: CaseAppealDecision.Accept,
      state: CaseState.ACCEPTED,
    } as Case

    // Act
    const res = hasCaseBeenAppealed(theCase)

    // Assert
    expect(res).toBe(false)
  })

  it('should be false when the case is not completed', () => {
    // Arrange
    const theCase = { accusedAppealDecision: CaseAppealDecision.Appeal } as Case

    // Act
    const res = hasCaseBeenAppealed(theCase)

    // Assert
    expect(res).toBe(false)
  })
})
