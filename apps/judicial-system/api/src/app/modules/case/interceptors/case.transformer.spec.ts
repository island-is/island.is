import addDays from 'date-fns/addDays'
import endOfDay from 'date-fns/endOfDay'
import each from 'jest-each'

import {
  AppealCaseState,
  CaseAppealDecision,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  ServiceRequirement,
  UserRole,
} from '@island.is/judicial-system/types'

import { Defendant } from '../../defendant'
import { AppealCase } from '../models/appealCase.model'
import { Case } from '../models/case.model'
import {
  getAppealInfo,
  getIndictmentDismissalAppealInfo,
  getIndictmentInfo,
  transformCase,
} from './case.transformer'

describe('transformCase', () => {
  each`
    originalValue | transformedValue
    ${null}       | ${false}
    ${false}      | ${false}
    ${true}       | ${true}
  `.describe(
    'when transforming boolean case attributes',
    ({ originalValue, transformedValue }) => {
      it(`should transform ${originalValue} requestProsecutorOnlySession to ${transformedValue}`, () => {
        // Arrange
        const theCase = {
          type: CaseType.CUSTODY,
          requestProsecutorOnlySession: originalValue,
        } as Case

        // Act
        const res = transformCase(theCase)

        // Assert
        expect(res.requestProsecutorOnlySession).toBe(transformedValue)
      })

      it(`should transform ${originalValue} isClosedCourtHidden to ${transformedValue}`, () => {
        // Arrange
        const theCase = {
          type: CaseType.CUSTODY,
          isClosedCourtHidden: originalValue,
        } as Case

        // Act
        const res = transformCase(theCase)

        // Assert
        expect(res.isClosedCourtHidden).toBe(transformedValue)
      })

      it(`should transform ${originalValue} isHightenedSecurityLevel to ${transformedValue}`, () => {
        // Arrange
        const theCase = {
          type: CaseType.CUSTODY,
          isHeightenedSecurityLevel: originalValue,
        } as Case

        // Act
        const res = transformCase(theCase)

        // Assert
        expect(res.isHeightenedSecurityLevel).toBe(transformedValue)
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
      const theCase = {
        type: CaseType.CUSTODY,
        validToDate: validToDate.toISOString(),
      } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isValidToDateInThePast).toBe(false)
    })

    it('should set custody end date in the past to true if custody end date in the past', () => {
      // Arrange
      const validToDate = new Date()
      validToDate.setSeconds(validToDate.getSeconds() - 1)
      const theCase = {
        type: CaseType.CUSTODY,
        validToDate: validToDate.toISOString(),
      } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isValidToDateInThePast).toBe(true)
    })
  })

  describe('isAppealDeadlineExpired', () => {
    it('should be false when no court date is set', () => {
      // Arrange
      const theCase = { type: CaseType.CUSTODY } as Case

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
      const theCase = {
        type: CaseType.CUSTODY,
        rulingDate: rulingDate.toISOString(),
      } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isAppealDeadlineExpired).toBe(false)
    })

    it('should be true when the appeal window has closed', () => {
      // Arrange
      const rulingDate = new Date()
      rulingDate.setDate(rulingDate.getDate() - 3)
      const theCase = {
        type: CaseType.CUSTODY,
        rulingDate: rulingDate.toISOString(),
      } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isAppealDeadlineExpired).toBe(true)
    })
  })

  describe('isStatementDeadlineExpired', () => {
    it('should be false if the case has not been appealed', () => {
      // Arrange
      const theCase = { type: CaseType.CUSTODY } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isStatementDeadlineExpired).toBe(false)
    })

    it('should be true when more than one day has passed since the case was appealed', () => {
      // Arrange
      const appealReceivedByCourtDate = new Date()
      appealReceivedByCourtDate.setDate(appealReceivedByCourtDate.getDate() - 2)
      const theCase = {
        type: CaseType.CUSTODY,
        appealCase: {
          appealReceivedByCourtDate: appealReceivedByCourtDate.toISOString(),
        } as AppealCase,
      } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isStatementDeadlineExpired).toBe(true)
    })

    it('should be false when less that one day has passed since the case was appealed', () => {
      // Arrange
      const appealReceivedByCourtDate = new Date()
      appealReceivedByCourtDate.setDate(appealReceivedByCourtDate.getDate())
      appealReceivedByCourtDate.setSeconds(
        appealReceivedByCourtDate.getSeconds() - 100,
      )
      const theCase = {
        type: CaseType.CUSTODY,
        appealCase: {
          appealReceivedByCourtDate: appealReceivedByCourtDate.toISOString(),
        } as AppealCase,
      } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isStatementDeadlineExpired).toBe(false)
    })
  })

  describe('appealInfo', () => {
    it('should be undefined when no court end time is set', () => {
      // Arrange
      const theCase = { type: CaseType.CUSTODY } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.appealDeadline).toBeUndefined()
      expect(res.appealedByRole).toBeUndefined()
      expect(res.appealedDate).toBeUndefined()
      expect(res.hasBeenAppealed).toBeUndefined()
      expect(res.canBeAppealed).toBeUndefined()
      expect(res.statementDeadline).toBeUndefined()
    })

    it('should return appeal deadline and hasBeenAppealed set to false when case has not yet been appealed', () => {
      // Arrange
      const rulingDate = new Date()
      rulingDate.setDate(rulingDate.getDate())
      rulingDate.setSeconds(rulingDate.getSeconds())
      const theCase = {
        type: CaseType.CUSTODY,
        rulingDate: rulingDate.toISOString(),
      } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.appealDeadline).toBeDefined()
      expect(res.hasBeenAppealed).toBe(false)
    })

    it('should return hasBeenAppealed true and the correct appealed date when case has been appealed', () => {
      // Arrange
      const rulingDate = new Date()
      rulingDate.setDate(rulingDate.getDate() - 1)
      const theCase = {
        type: CaseType.CUSTODY,
        rulingDate: rulingDate.toISOString(),
        accusedPostponedAppealDate: '2022-06-15T19:50:08.033Z',
        appealCase: {
          appealState: AppealCaseState.APPEALED,
        } as AppealCase,
      } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.appealedDate).toBeDefined()
      expect(res.hasBeenAppealed).toBe(true)
    })

    it('should return statement deadline when case has been received by the court', () => {
      // Arrange
      const rulingDate = new Date()
      rulingDate.setDate(rulingDate.getDate() - 1)
      const theCase = {
        type: CaseType.CUSTODY,
        rulingDate: rulingDate.toISOString(),
        appealCase: {
          appealState: AppealCaseState.RECEIVED,
          appealReceivedByCourtDate: '2021-06-15T19:50:08.033Z',
        } as AppealCase,
      } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.statementDeadline).toBe('2021-06-16T19:50:08.033Z')
    })

    each([CaseAppealDecision.POSTPONE, CaseAppealDecision.NOT_APPLICABLE]).it(
      'should return that case can be appealed when prosecutorAppealDecision is %s',
      (prosecutorAppealDecision) => {
        const theCase = {
          type: CaseType.CUSTODY,
          rulingDate: '2022-06-15T19:50:08.033Z',
          prosecutorAppealDecision,
        } as Case

        const appealInfo = transformCase(theCase)

        expect(appealInfo).toEqual(
          expect.objectContaining({
            canBeAppealed: true,
            appealDeadline: '2022-06-18T19:50:08.033Z',
            hasBeenAppealed: false,
          }),
        )
      },
    )

    each([CaseAppealDecision.ACCEPT, CaseAppealDecision.APPEAL]).it(
      'should return that case cannot be appealed when prosecutorAppealDecision is %s',
      (prosecutorAppealDecision) => {
        const theCase = {
          type: CaseType.CUSTODY,
          rulingDate: '2022-06-15T19:50:08.033Z',
          prosecutorAppealDecision,
        } as Case

        const appealInfo = transformCase(theCase)

        expect(appealInfo).toEqual(
          expect.objectContaining({
            canBeAppealed: false,
          }),
        )
      },
    )

    each([CaseAppealDecision.POSTPONE, CaseAppealDecision.NOT_APPLICABLE]).it(
      'should return that case can be appealed when accusedAppealDecision is %s',
      (accusedAppealDecision) => {
        const theCase = {
          type: CaseType.CUSTODY,
          rulingDate: '2022-06-15T19:50:08.033Z',
          accusedAppealDecision,
        } as Case

        const appealInfo = transformCase(theCase)

        expect(appealInfo).toEqual(
          expect.objectContaining({
            canBeAppealed: true,
            appealDeadline: '2022-06-18T19:50:08.033Z',
            hasBeenAppealed: false,
          }),
        )
      },
    )

    each([CaseAppealDecision.ACCEPT, CaseAppealDecision.APPEAL]).it(
      'should return that case cannot be appealed when accusedAppealDecision is %s',
      (accusedAppealDecision) => {
        const theCase = {
          type: CaseType.CUSTODY,
          rulingDate: '2022-06-15T19:50:08.033Z',
          accusedAppealDecision,
        } as Case

        const appealInfo = transformCase(theCase)

        expect(appealInfo).toEqual(
          expect.objectContaining({
            canBeAppealed: false,
          }),
        )
      },
    )

    it('should return that case has been appealed by the prosecutor, and return the correct appealed date', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        rulingDate: '2022-06-15T19:50:08.033Z',
        prosecutorPostponedAppealDate: '2022-06-15T19:50:08.033Z',
        appealCase: {
          appealState: AppealCaseState.APPEALED,
        } as AppealCase,
      } as Case

      const appealInfo = transformCase(theCase)

      expect(appealInfo).toEqual(
        expect.objectContaining({
          canBeAppealed: false,
          appealedByRole: UserRole.PROSECUTOR,
          appealedDate: '2022-06-15T19:50:08.033Z',
          hasBeenAppealed: true,
        }),
      )
    })

    it('should return that case has been appealed by the defender, and return the correct appealed date', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        rulingDate: '2022-06-15T19:50:08.033Z',
        accusedPostponedAppealDate: '2022-06-15T19:50:08.033Z',
        appealCase: {
          appealState: AppealCaseState.APPEALED,
        } as AppealCase,
      } as Case

      const appealInfo = transformCase(theCase)

      expect(appealInfo).toEqual(
        expect.objectContaining({
          canBeAppealed: false,
          appealedByRole: UserRole.DEFENDER,
          appealedDate: '2022-06-15T19:50:08.033Z',
          hasBeenAppealed: true,
        }),
      )
    })

    it('should return that case has not yet been appealed if case appeal decision was postponed and the case has not been appealed yet', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        rulingDate: '2022-06-15T19:50:08.033Z',
        prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
      } as Case

      const appealInfo = transformCase(theCase)

      expect(appealInfo).toEqual(
        expect.objectContaining({
          appealDeadline: '2022-06-18T19:50:08.033Z',
          canBeAppealed: true,
          hasBeenAppealed: false,
        }),
      )
    })

    it('should return that the case cannot be appealed if case appeal decision does not allow appeal', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        rulingDate: '2022-06-15T19:50:08.033Z',
        prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
        accusedAppealDecision: CaseAppealDecision.APPEAL,
      } as Case

      const appealInfo = transformCase(theCase)

      expect(appealInfo).toEqual(
        expect.objectContaining({
          appealDeadline: '2022-06-18T19:50:08.033Z',
          canBeAppealed: false,
          hasBeenAppealed: false,
        }),
      )
    })

    it('should return a statement deadline if the case has been marked as received by the court', () => {
      const theCase = {
        type: CaseType.CUSTODY,
        rulingDate: '2022-06-15T19:50:08.033Z',
        state: CaseState.RECEIVED,
        appealCase: {
          appealReceivedByCourtDate: '2022-06-15T19:50:08.033Z',
        } as AppealCase,
      } as Case

      const appealInfo = transformCase(theCase)

      expect(appealInfo).toEqual(
        expect.objectContaining({
          statementDeadline: '2022-06-16T19:50:08.033Z',
        }),
      )
    })

    describe('for cases with status', () => {
      each(
        Object.values(AppealCaseState).map((appealState) => ({ appealState })),
      ).it(
        '$appealState should return that case has been appealed',
        ({ appealState }) => {
          const theCase = {
            type: CaseType.CUSTODY,
            rulingDate: '2022-06-15T19:50:08.033Z',
            appealCase: {
              appealState,
            } as AppealCase,
          } as Case

          const appealInfo = transformCase(theCase)

          expect(appealInfo).toEqual(
            expect.objectContaining({
              hasBeenAppealed: true,
            }),
          )
        },
      )
    })
  })
})

describe('getAppealInfo', () => {
  it('should return empty appeal info when ruling date is not provided', () => {
    // Arrange
    const theCase = { type: CaseType.CUSTODY } as Case

    // Act
    const appealInfo = getAppealInfo(theCase)

    // Assert
    expect(appealInfo).toEqual({})
  })

  it('should not return appealedDate if case has not been appealed', () => {
    const rulingDate = '2022-06-15T19:50:08.033Z'
    const theCase = {
      type: CaseType.CUSTODY,
      rulingDate,
      accusedAppealDecision: CaseAppealDecision.POSTPONE,
      prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
      accusedPostponedAppealDate: '2022-06-15T19:50:08.033Z',
      prosecutorPostponedAppealDate: '2022-06-15T19:50:08.033Z',
    } as Case

    const appealInfo = getAppealInfo(theCase)

    expect(appealInfo).toEqual({
      canBeAppealed: true,
      hasBeenAppealed: false,
      appealDeadline: '2022-06-18T19:50:08.033Z',
      canDefenderAppeal: true,
      canProsecutorAppeal: true,
    })
  })

  it('should return correct appeal info when ruling date is provided', () => {
    const rulingDate = '2022-06-15T19:50:08.033Z'
    const theCase = {
      type: CaseType.CUSTODY,
      rulingDate,
      accusedAppealDecision: CaseAppealDecision.APPEAL,
      prosecutorAppealDecision: CaseAppealDecision.NOT_APPLICABLE,
      accusedPostponedAppealDate: '2022-06-15T19:50:08.033Z',
      appealCase: {
        appealState: AppealCaseState.APPEALED,
        appealReceivedByCourtDate: '2021-06-15T19:50:08.033Z',
      } as AppealCase,
    } as Case

    const appealInfo = getAppealInfo(theCase)

    expect(appealInfo).toEqual({
      canBeAppealed: false,
      hasBeenAppealed: true,
      appealedByRole: UserRole.DEFENDER,
      appealedDate: '2022-06-15T19:50:08.033Z',
      appealDeadline: '2022-06-18T19:50:08.033Z',
      statementDeadline: '2021-06-16T19:50:08.033Z',
      canDefenderAppeal: false,
      canProsecutorAppeal: false,
    })
  })

  it('should transform appeal state and dates if appeal data does not match up', () => {
    const theCase = {
      type: CaseType.CUSTODY,
      rulingDate: '2022-06-15T19:50:08.033Z',
      accusedAppealDecision: CaseAppealDecision.ACCEPT,
      prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
      accusedPostponedAppealDate: '2022-06-15T19:50:08.033Z',
      prosecutorPostponedAppealDate: '2022-06-15T19:50:08.033Z',
      appealCase: {
        appealState: AppealCaseState.APPEALED,
      } as AppealCase,
    } as Case

    const appealInfo = getAppealInfo(theCase)

    expect(appealInfo).toEqual({
      canBeAppealed: false,
      hasBeenAppealed: false,
      appealedDate: undefined,
      appealDeadline: '2022-06-18T19:50:08.033Z',
      canDefenderAppeal: false,
      canProsecutorAppeal: false,
    })
  })

  const rulingDate = new Date().toISOString()

  Object.values(CaseAppealDecision).forEach((decision) => {
    const expected =
      decision === CaseAppealDecision.POSTPONE ||
      decision === CaseAppealDecision.NOT_APPLICABLE

    test(`canProsecutorAppeal for appeal decision ${decision} should return ${expected}`, () => {
      const theCase = {
        type: CaseType.CUSTODY,
        rulingDate,
        prosecutorAppealDecision: decision,
      } as Case

      const appealInfo = getAppealInfo(theCase)

      expect(appealInfo).toHaveProperty('canProsecutorAppeal', expected)
    })
  })

  Object.values(CaseAppealDecision).forEach((decision) => {
    const expected =
      decision === CaseAppealDecision.POSTPONE ||
      decision === CaseAppealDecision.NOT_APPLICABLE

    test(`canDefenderAppeal for appeal decision ${decision} should return ${expected}`, () => {
      const theCase = {
        type: CaseType.CUSTODY,
        rulingDate,
        accusedAppealDecision: decision,
      } as Case

      const appealInfo = getAppealInfo(theCase)

      expect(appealInfo).toHaveProperty('canDefenderAppeal', expected)
    })
  })
})

describe('getIndictmentInfo', () => {
  it('should return empty indictment info when ruling date is not provided', () => {
    // Arrange

    // Act
    const indictmentInfo = getIndictmentInfo({
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
    })

    // Assert
    expect(indictmentInfo).toEqual({})
  })

  it('should return correct indictment info when ruling date is provided', () => {
    const rulingDate = '2022-06-15T19:50:08.033Z'

    const indictmentInfo = getIndictmentInfo({
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      rulingDate,
    })

    expect(indictmentInfo).toEqual({
      indictmentAppealDeadline: '2022-07-13T23:59:59.999Z',
      indictmentVerdictViewedByAll: true,
      indictmentVerdictAppealDeadlineExpired: true,
    })
  })

  it('should return correct indictment info when some defendants have yet to view the verdict', () => {
    const rulingDate = '2022-06-14T19:50:08.033Z'

    const defendants = [
      {
        verdict: {
          serviceDate: '2022-06-15T19:50:08.033Z',
          serviceRequirement: ServiceRequirement.REQUIRED,
        },
      },
      {
        verdict: {
          serviceDate: undefined,
          serviceRequirement: ServiceRequirement.REQUIRED,
        },
      },
    ] as Defendant[]

    const indictmentInfo = getIndictmentInfo({
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      rulingDate,
      defendants,
    })

    expect(indictmentInfo).toEqual({
      indictmentAppealDeadline: '2022-07-12T23:59:59.999Z',
      indictmentVerdictViewedByAll: false,
      indictmentVerdictAppealDeadlineExpired: false,
    })
  })

  it('should return correct indictment info when no defendants have yet to view the verdict', () => {
    const rulingDate = '2022-06-14T19:50:08.033Z'
    const defendants = [
      { verdict: { serviceDate: '2022-06-15T19:50:08.033Z' } },
      {
        verdict: {
          serviceRequirement: ServiceRequirement.NOT_REQUIRED,
          serviceDate: undefined,
        },
      },
    ] as Defendant[]

    const indictmentInfo = getIndictmentInfo({
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      rulingDate,
      defendants,
    })

    expect(indictmentInfo).toEqual({
      indictmentAppealDeadline: '2022-07-12T23:59:59.999Z',
      indictmentVerdictViewedByAll: true,
      indictmentVerdictAppealDeadlineExpired: true,
    })
  })

  it('should return correct indictment info when the indictment ruling decision is FINE and the appeal deadline is not expired', () => {
    const courtEndTime = new Date()
    const rulingDate = new Date()
    const defendants = [
      {
        verdict: {
          serviceRequirement: ServiceRequirement.NOT_REQUIRED,
          serviceDate: undefined,
        },
      },
    ] as Defendant[]

    const indictmentInfo = getIndictmentInfo({
      indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
      rulingDate: rulingDate.toISOString(),
      defendants,
    })

    const expectedIndictmentAppealDeadline = endOfDay(addDays(courtEndTime, 3))

    expect(indictmentInfo).toEqual({
      indictmentAppealDeadline: expectedIndictmentAppealDeadline.toISOString(),
      indictmentVerdictViewedByAll: true,
      indictmentVerdictAppealDeadlineExpired: false,
    })
  })

  it('should return correct indictment info when the indictment ruling decision is FINE and the appeal deadline is expired', () => {
    const rulingDate = '2024-05-26T21:51:19.156Z'
    const defendants = [
      {
        verdict: {
          serviceRequirement: ServiceRequirement.NOT_REQUIRED,
          serviceDate: undefined,
        },
      },
    ] as Defendant[]

    const indictmentInfo = getIndictmentInfo({
      indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
      rulingDate,
      defendants,
    })

    expect(indictmentInfo).toEqual({
      indictmentAppealDeadline: '2024-05-29T23:59:59.999Z',
      indictmentVerdictViewedByAll: true,
      indictmentVerdictAppealDeadlineExpired: true,
    })
  })
})

describe('getIndictmentDismissalAppealInfo', () => {
  it('should return empty appeal info when ruling decision is not DISMISSAL', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      rulingDate: '2022-06-15T19:50:08.033Z',
    } as Case

    const appealInfo = getIndictmentDismissalAppealInfo(theCase)

    expect(appealInfo).toEqual({})
  })

  it('should return empty appeal info when no ruling date', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
    } as Case

    const appealInfo = getIndictmentDismissalAppealInfo(theCase)

    expect(appealInfo).toEqual({})
  })

  it('should return canBeAppealed true when case has not been appealed', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      rulingDate: '2022-06-15T19:50:08.033Z',
    } as Case

    const appealInfo = getIndictmentDismissalAppealInfo(theCase)

    expect(appealInfo).toEqual({
      canBeAppealed: true,
      canProsecutorAppeal: true,
      canDefenderAppeal: true,
      hasBeenAppealed: false,
      appealDeadline: '2022-06-18T19:50:08.033Z',
    })
  })

  it('should return hasBeenAppealed true and appealedByRole PROSECUTOR when prosecutor appealed', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      rulingDate: '2022-06-15T19:50:08.033Z',
      prosecutorPostponedAppealDate: '2022-06-16T10:00:00.000Z',
      appealCase: {
        appealState: AppealCaseState.APPEALED,
      },
    } as Case

    const appealInfo = getIndictmentDismissalAppealInfo(theCase)

    expect(appealInfo).toEqual({
      canBeAppealed: false,
      canProsecutorAppeal: false,
      canDefenderAppeal: false,
      hasBeenAppealed: true,
      appealedByRole: UserRole.PROSECUTOR,
      appealedDate: '2022-06-16T10:00:00.000Z',
      appealDeadline: '2022-06-18T19:50:08.033Z',
    })
  })

  it('should return hasBeenAppealed true and appealedByRole DEFENDER when defender appealed', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      rulingDate: '2022-06-15T19:50:08.033Z',
      accusedPostponedAppealDate: '2022-06-16T10:00:00.000Z',
      appealCase: {
        appealState: AppealCaseState.APPEALED,
      },
    } as Case

    const appealInfo = getIndictmentDismissalAppealInfo(theCase)

    expect(appealInfo).toEqual({
      canBeAppealed: false,
      canProsecutorAppeal: false,
      canDefenderAppeal: false,
      hasBeenAppealed: true,
      appealedByRole: UserRole.DEFENDER,
      appealedDate: '2022-06-16T10:00:00.000Z',
      appealDeadline: '2022-06-18T19:50:08.033Z',
    })
  })

  it('should return statementDeadline when appeal has been received by court', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      rulingDate: '2022-06-15T19:50:08.033Z',
      prosecutorPostponedAppealDate: '2022-06-16T10:00:00.000Z',
      appealCase: {
        appealState: AppealCaseState.RECEIVED,
        appealReceivedByCourtDate: '2022-06-17T12:00:00.000Z',
      },
    } as Case

    const appealInfo = getIndictmentDismissalAppealInfo(theCase)

    expect(appealInfo).toEqual({
      canBeAppealed: false,
      canProsecutorAppeal: false,
      canDefenderAppeal: false,
      hasBeenAppealed: true,
      appealedByRole: UserRole.PROSECUTOR,
      appealedDate: '2022-06-16T10:00:00.000Z',
      appealDeadline: '2022-06-18T19:50:08.033Z',
      statementDeadline: '2022-06-18T12:00:00.000Z',
    })
  })
})

describe('transformCase for indictment dismissal appeals', () => {
  it('should include dismissal appeal info for indictment DISMISSAL cases', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      rulingDate: '2022-06-15T19:50:08.033Z',
    } as Case

    const res = transformCase(theCase)

    expect(res.canBeAppealed).toBe(true)
    expect(res.hasBeenAppealed).toBe(false)
    expect(res.appealDeadline).toBe('2022-06-18T19:50:08.033Z')
    expect(res.isAppealDeadlineExpired).toBe(true) // date is in the past
    expect(res.isStatementDeadlineExpired).toBe(false)
  })

  it('should not include appeal info for indictment RULING cases', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      rulingDate: '2022-06-15T19:50:08.033Z',
    } as Case

    const res = transformCase(theCase)

    expect(res.canBeAppealed).toBeUndefined()
    expect(res.hasBeenAppealed).toBeUndefined()
    expect(res.appealDeadline).toBeUndefined()
    expect(res.isAppealDeadlineExpired).toBe(false)
  })

  it('should set isAppealDeadlineExpired false when deadline is in the future', () => {
    const rulingDate = new Date()
    rulingDate.setSeconds(rulingDate.getSeconds() + 100)
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      rulingDate: rulingDate.toISOString(),
    } as Case

    const res = transformCase(theCase)

    expect(res.isAppealDeadlineExpired).toBe(false)
  })

  it('should set isStatementDeadlineExpired true when past statement deadline', () => {
    const appealReceivedByCourtDate = new Date()
    appealReceivedByCourtDate.setDate(appealReceivedByCourtDate.getDate() - 2)
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      rulingDate: '2022-06-15T19:50:08.033Z',
      prosecutorPostponedAppealDate: '2022-06-16T10:00:00.000Z',
      appealCase: {
        appealState: AppealCaseState.RECEIVED,
        appealReceivedByCourtDate: appealReceivedByCourtDate.toISOString(),
      },
    } as Case

    const res = transformCase(theCase)

    expect(res.isStatementDeadlineExpired).toBe(true)
  })

  it('should clean accusedPostponedAppealDate and prosecutorPostponedAppealDate when not appealed', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      rulingDate: '2022-06-15T19:50:08.033Z',
      accusedPostponedAppealDate: '2022-06-16T10:00:00.000Z',
      prosecutorPostponedAppealDate: '2022-06-16T10:00:00.000Z',
    } as Case

    const res = transformCase(theCase)

    expect(res.accusedPostponedAppealDate).toBeUndefined()
    expect(res.prosecutorPostponedAppealDate).toBeUndefined()
  })

  it('should preserve appeal dates when case has been appealed', () => {
    const theCase = {
      type: CaseType.INDICTMENT,
      indictmentRulingDecision: CaseIndictmentRulingDecision.DISMISSAL,
      rulingDate: '2022-06-15T19:50:08.033Z',
      prosecutorPostponedAppealDate: '2022-06-16T10:00:00.000Z',
      appealCase: {
        appealState: AppealCaseState.APPEALED,
      },
    } as Case

    const res = transformCase(theCase)

    expect(res.prosecutorPostponedAppealDate).toBe('2022-06-16T10:00:00.000Z')
    expect(res.hasBeenAppealed).toBe(true)
    expect(res.appealedByRole).toBe(UserRole.PROSECUTOR)
  })
})
