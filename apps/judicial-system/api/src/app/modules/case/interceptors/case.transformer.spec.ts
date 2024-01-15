import each from 'jest-each'

import {
  CaseAppealDecision,
  CaseAppealState,
  CaseState,
  UserRole,
} from '@island.is/judicial-system/types'

import { Case } from '../models/case.model'
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
    it('should be false when no court date is set', () => {
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
    it('should be false when no court end time is set', () => {
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
      rulingDate.setDate(rulingDate.getDate() - 31)
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
      rulingDate.setDate(rulingDate.getDate() - 31)
      const theCase = { rulingDate: rulingDate.toISOString() } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.isAppealGracePeriodExpired).toBe(true)
    })
  })

  describe('isStatementDeadlineExpired', () => {
    it('should be false if the case has not been appealed', () => {
      // Arrange
      const theCase = { appealState: undefined } as Case

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
        appealReceivedByCourtDate: appealReceivedByCourtDate.toISOString(),
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
        appealReceivedByCourtDate: appealReceivedByCourtDate.toISOString(),
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
      const theCase = {} as Case

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
      const theCase = { rulingDate: rulingDate.toISOString() } as Case

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
        rulingDate: rulingDate.toISOString(),
        accusedPostponedAppealDate: '2022-06-15T19:50:08.033Z',
        appealState: CaseAppealState.APPEALED,
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
        rulingDate: rulingDate.toISOString(),
        appealState: CaseAppealState.RECEIVED,
        appealReceivedByCourtDate: '2021-06-15T19:50:08.033Z',
      } as Case

      // Act
      const res = transformCase(theCase)

      // Assert
      expect(res.statementDeadline).toBe('2021-06-16T19:50:08.033Z')
    })

    it('should return that case can be appealed and the correct appeal deadline when case appeal decision was postponed', () => {
      const theCase = {
        rulingDate: '2022-06-15T19:50:08.033Z',
        prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
      } as Case

      const appealInfo = transformCase(theCase)

      expect(appealInfo).toEqual(
        expect.objectContaining({
          canBeAppealed: true,
          appealDeadline: '2022-06-18T19:50:08.033Z',
          hasBeenAppealed: false,
        }),
      )
    })

    it('should return that case has been appealed by the prosecutor, and return the correct appealed date', () => {
      const theCase = {
        rulingDate: '2022-06-15T19:50:08.033Z',
        appealState: CaseAppealState.APPEALED,
        prosecutorPostponedAppealDate: '2022-06-15T19:50:08.033Z',
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
        rulingDate: '2022-06-15T19:50:08.033Z',
        appealState: CaseAppealState.APPEALED,
        accusedPostponedAppealDate: '2022-06-15T19:50:08.033Z',
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

    it('should return that the case cannot be appealed if neither party has postponed the appeal', () => {
      const theCase = {
        rulingDate: '2022-06-15T19:50:08.033Z',
        prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
        accusedAppealDecision: CaseAppealDecision.NOT_APPLICABLE,
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
        rulingDate: '2022-06-15T19:50:08.033Z',
        appealReceivedByCourtDate: '2022-06-15T19:50:08.033Z',
        state: CaseState.RECEIVED,
      } as Case

      const appealInfo = transformCase(theCase)

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
          const theCase = {
            rulingDate: '2022-06-15T19:50:08.033Z',
            appealState,
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
