import each from 'jest-each'

import type { Case } from './case'
import {
  CaseAppealDecision,
  CaseAppealState,
  CaseState,
  CaseType,
  getAppealInfo,
  hasCaseBeenAppealed,
  isInvestigationCase,
  isRestrictionCase,
} from './case'
import { UserRole } from './user'

describe('Case Type', () => {
  each`
    type
    ${CaseType.CUSTODY}
    ${CaseType.TRAVEL_BAN}
    ${CaseType.ADMISSION_TO_FACILITY}
  `.it('should categorize $type as a restriction case', ({ type }) => {
    expect(isRestrictionCase(type)).toBe(true)
    expect(isInvestigationCase(type)).toBe(false)
  })

  each`
    type
    ${CaseType.SEARCH_WARRANT}
    ${CaseType.BANKING_SECRECY_WAIVER}
    ${CaseType.PHONE_TAPPING}
    ${CaseType.TELECOMMUNICATIONS}
    ${CaseType.TRACKING_EQUIPMENT}
    ${CaseType.PSYCHIATRIC_EXAMINATION}
    ${CaseType.SOUND_RECORDING_EQUIPMENT}
    ${CaseType.AUTOPSY}
    ${CaseType.BODY_SEARCH}
    ${CaseType.INTERNET_USAGE}
    ${CaseType.RESTRAINING_ORDER}
    ${CaseType.RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME}
    ${CaseType.EXPULSION_FROM_HOME}
    ${CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION}
    ${CaseType.VIDEO_RECORDING_EQUIPMENT}
    ${CaseType.OTHER}
  `.it('should categorize $type as an investigation case', ({ type }) => {
    expect(isRestrictionCase(type)).toBe(false)
    expect(isInvestigationCase(type)).toBe(true)
  })
})

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

  it('should be false when no one has appealed', () => {
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

describe('getAppealInfo', () => {
  test('should return that case can be appealed and the correct appeal deadline when case appeal decision was postponed', () => {
    const workingCase = {
      rulingDate: '2022-06-15T19:50:08.033Z',
      prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
    } as Case

    const appealInfo = getAppealInfo(workingCase)

    expect(appealInfo).toEqual(
      expect.objectContaining({
        canBeAppealed: true,
        appealDeadline: '2022-06-18T19:50:08.033Z',
        hasBeenAppealed: false,
      }),
    )
  })

  test('should return that case has been appealed by the prosecutor, and return the correct appealed date', () => {
    const workingCase = {
      rulingDate: '2022-06-15T19:50:08.033Z',
      appealState: CaseAppealState.APPEALED,
      prosecutorPostponedAppealDate: '2022-06-15T19:50:08.033Z',
    } as Case

    const appealInfo = getAppealInfo(workingCase)

    expect(appealInfo).toEqual(
      expect.objectContaining({
        canBeAppealed: false,
        appealedByRole: UserRole.PROSECUTOR,
        appealedDate: '2022-06-15T19:50:08.033Z',
        hasBeenAppealed: true,
      }),
    )
  })

  test('should return that case has been appealed by the defender, and return the correct appealed date', () => {
    const workingCase = {
      rulingDate: '2022-06-15T19:50:08.033Z',
      appealState: CaseAppealState.APPEALED,
      accusedPostponedAppealDate: '2022-06-15T19:50:08.033Z',
    } as Case

    const appealInfo = getAppealInfo(workingCase)

    expect(appealInfo).toEqual(
      expect.objectContaining({
        canBeAppealed: false,
        appealedByRole: UserRole.DEFENDER,
        appealedDate: '2022-06-15T19:50:08.033Z',
        hasBeenAppealed: true,
      }),
    )
  })

  test('should return that case has not yet been appealed if case appeal decision was postponed and the case has not been appealed yet', () => {
    const workingCase = {
      rulingDate: '2022-06-15T19:50:08.033Z',
      prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
    } as Case

    const appealInfo = getAppealInfo(workingCase)

    expect(appealInfo).toEqual(
      expect.objectContaining({
        appealDeadline: '2022-06-18T19:50:08.033Z',
        canBeAppealed: true,
        hasBeenAppealed: false,
      }),
    )
  })

  test('should return that the case cannot be appealed if neither party has postponed the appeal', () => {
    const workingCase = {
      rulingDate: '2022-06-15T19:50:08.033Z',
      prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
      accusedAppealDecision: CaseAppealDecision.NOT_APPLICABLE,
    } as Case

    const appealInfo = getAppealInfo(workingCase)

    expect(appealInfo).toEqual(
      expect.objectContaining({
        appealDeadline: '2022-06-18T19:50:08.033Z',
        canBeAppealed: false,
        hasBeenAppealed: false,
      }),
    )
  })

  test('should return a statement deadline if the case has been marked as received by the court', () => {
    const workingCase = {
      rulingDate: '2022-06-15T19:50:08.033Z',
      appealReceivedByCourtDate: '2022-06-15T19:50:08.033Z',
      state: CaseState.RECEIVED,
    } as Case

    const appealInfo = getAppealInfo(workingCase)

    expect(appealInfo).toEqual(
      expect.objectContaining({
        statementDeadline: '2022-06-16T19:50:08.033Z',
      }),
    )
  })

  describe('for cases with status', () => {
    each`
    appealState
    ${CaseAppealState.APPEALED}
    ${CaseAppealState.RECEIVED}
    ${CaseAppealState.COMPLETED}`.it(
      '$appealState should return that case has been appealed',
      ({ appealState }) => {
        const workingCase = {
          rulingDate: '2022-06-15T19:50:08.033Z',
          appealState,
        } as Case

        const appealInfo = getAppealInfo(workingCase)

        expect(appealInfo).toEqual(
          expect.objectContaining({
            hasBeenAppealed: true,
          }),
        )
      },
    )
  })

  test('should return all appeal fields as undefined if case has not been closed', () => {
    const workingCase = {} as Case

    const appealInfo = getAppealInfo(workingCase)

    expect(appealInfo).toEqual(
      expect.not.objectContaining({
        canBeAppealed: undefined,
        hasBeenAppealed: undefined,
        appealedByRole: undefined,
        appealedDate: undefined,
        prosecutorStatementDate: undefined,
        defendantStatementDate: undefined,
        appealDeadline: undefined,
        statementDeadline: undefined,
      }),
    )
  })
})
