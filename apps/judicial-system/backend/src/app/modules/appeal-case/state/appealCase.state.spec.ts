import { ForbiddenException } from '@nestjs/common'

import {
  AppealCaseState,
  AppealCaseTransition,
  AppealCaseType,
  CaseType,
} from '@island.is/judicial-system/types'

import { nowFactory } from '../../../factories'
import { AppealCase, Case } from '../../repository'
import { transitionAppealCase } from './appealCase.state'

jest.mock('../../../factories/date.factory')

describe('transitionAppealCase', () => {
  const now = new Date('2024-01-15T10:00:00Z')

  beforeEach(() => {
    const mockNowFactory = nowFactory as jest.Mock
    mockNowFactory.mockReturnValue(now)
  })

  describe('COMPLETE_APPEAL', () => {
    it('sets the appeal state to completed and stamps the ruling date', () => {
      const theCase = { type: CaseType.INDICTMENT } as Case
      const appealCase = { appealState: AppealCaseState.RECEIVED } as AppealCase

      const { appealCaseUpdate } = transitionAppealCase(
        AppealCaseTransition.COMPLETE_APPEAL,
        theCase,
        appealCase,
      )

      expect(appealCaseUpdate.appealState).toBe(AppealCaseState.COMPLETED)
      expect(appealCaseUpdate.appealRulingDate).toBe(now)
    })

    it('can complete an appeal that was withdrawn', () => {
      const theCase = { type: CaseType.INDICTMENT } as Case
      const appealCase = {
        appealState: AppealCaseState.WITHDRAWN,
      } as AppealCase

      const { appealCaseUpdate } = transitionAppealCase(
        AppealCaseTransition.COMPLETE_APPEAL,
        theCase,
        appealCase,
      )

      expect(appealCaseUpdate.appealState).toBe(AppealCaseState.COMPLETED)
      expect(appealCaseUpdate.appealRulingDate).toBe(now)
    })

    it('stamps a new ruling date when a reopened appeal is completed again', () => {
      const theCase = { type: CaseType.CUSTODY } as Case
      const appealCase = {
        appealType: AppealCaseType.RULING,
        appealState: AppealCaseState.RECEIVED,
        appealRulingDate: new Date('2024-01-01T10:00:00Z'),
      } as AppealCase

      const { appealCaseUpdate } = transitionAppealCase(
        AppealCaseTransition.COMPLETE_APPEAL,
        theCase,
        appealCase,
      )

      expect(appealCaseUpdate).toEqual({
        appealState: AppealCaseState.COMPLETED,
        appealRulingDate: now,
      })
    })
  })

  describe('a verdict appeal', () => {
    const theCase = { type: CaseType.INDICTMENT } as Case
    const verdictAppeal = (appealState: AppealCaseState) =>
      ({ appealType: AppealCaseType.VERDICT, appealState } as AppealCase)

    it('is confirmed from the state it is filed in and keeps the date the court entered', () => {
      const enteredDate = new Date('2024-01-10T00:00:00Z')

      const { caseUpdate, appealCaseUpdate } = transitionAppealCase(
        AppealCaseTransition.MARK_APPEAL_READY_TO_COMPLETE,
        theCase,
        {
          ...verdictAppeal(AppealCaseState.APPEALED),
          appealRulingDate: enteredDate,
        } as AppealCase,
      )

      expect(caseUpdate).toEqual({})
      expect(appealCaseUpdate).toEqual({
        appealState: AppealCaseState.READY_TO_COMPLETE,
      })
    })

    it.each(
      Object.values(AppealCaseState).filter(
        (appealState) => appealState !== AppealCaseState.APPEALED,
      ),
    )('is not confirmed from %s', (appealState) => {
      expect(() =>
        transitionAppealCase(
          AppealCaseTransition.MARK_APPEAL_READY_TO_COMPLETE,
          theCase,
          verdictAppeal(appealState),
        ),
      ).toThrow(ForbiddenException)
    })

    it('is completed once confirmed and keeps the date the court entered', () => {
      const enteredDate = new Date('2024-01-10T00:00:00Z')

      const { caseUpdate, appealCaseUpdate } = transitionAppealCase(
        AppealCaseTransition.COMPLETE_APPEAL,
        theCase,
        {
          ...verdictAppeal(AppealCaseState.READY_TO_COMPLETE),
          appealRulingDate: enteredDate,
        } as AppealCase,
      )

      expect(caseUpdate).toEqual({})
      expect(appealCaseUpdate).toEqual({
        appealState: AppealCaseState.COMPLETED,
      })
    })

    it.each(
      Object.values(AppealCaseState).filter(
        (appealState) => appealState !== AppealCaseState.READY_TO_COMPLETE,
      ),
    )('is not completed from %s', (appealState) => {
      expect(() =>
        transitionAppealCase(
          AppealCaseTransition.COMPLETE_APPEAL,
          theCase,
          verdictAppeal(appealState),
        ),
      ).toThrow(ForbiddenException)
    })

    it('is confirmed and then completed through the two transitions', () => {
      const enteredDate = new Date('2024-01-10T00:00:00Z')
      const appealed = {
        ...verdictAppeal(AppealCaseState.APPEALED),
        appealRulingDate: enteredDate,
      } as AppealCase

      const confirmed = {
        ...appealed,
        ...transitionAppealCase(
          AppealCaseTransition.MARK_APPEAL_READY_TO_COMPLETE,
          theCase,
          appealed,
        ).appealCaseUpdate,
      } as AppealCase
      const completed = {
        ...confirmed,
        ...transitionAppealCase(
          AppealCaseTransition.COMPLETE_APPEAL,
          theCase,
          confirmed,
        ).appealCaseUpdate,
      } as AppealCase

      expect(confirmed.appealState).toBe(AppealCaseState.READY_TO_COMPLETE)
      expect(completed.appealState).toBe(AppealCaseState.COMPLETED)
      expect(completed.appealRulingDate).toBe(enteredDate)
    })

    it.each([AppealCaseState.READY_TO_COMPLETE, AppealCaseState.COMPLETED])(
      'is not withdrawn from %s',
      (appealState) => {
        expect(() =>
          transitionAppealCase(
            AppealCaseTransition.WITHDRAW_APPEAL,
            theCase,
            verdictAppeal(appealState),
          ),
        ).toThrow(ForbiddenException)
      },
    )

    it.each([
      [AppealCaseTransition.RECEIVE_APPEAL, AppealCaseState.APPEALED],
      [AppealCaseTransition.REOPEN_APPEAL, AppealCaseState.COMPLETED],
    ])('is never transitioned with %s', (transition, appealState) => {
      expect(() =>
        transitionAppealCase(transition, theCase, verdictAppeal(appealState)),
      ).toThrow(ForbiddenException)
    })

    it('is taken back from confirmed with only its state changed', () => {
      const enteredDate = new Date('2024-01-10T00:00:00Z')

      const { caseUpdate, appealCaseUpdate } = transitionAppealCase(
        AppealCaseTransition.UNMARK_APPEAL_READY_TO_COMPLETE,
        theCase,
        {
          ...verdictAppeal(AppealCaseState.READY_TO_COMPLETE),
          appealRulingDate: enteredDate,
          appealConclusion: 'Niðurstaða',
        } as AppealCase,
      )

      expect(caseUpdate).toEqual({})
      expect(appealCaseUpdate).toEqual({
        appealState: AppealCaseState.APPEALED,
      })
    })

    it.each(
      Object.values(AppealCaseState).filter(
        (appealState) => appealState !== AppealCaseState.READY_TO_COMPLETE,
      ),
    )('is not taken back from %s', (appealState) => {
      expect(() =>
        transitionAppealCase(
          AppealCaseTransition.UNMARK_APPEAL_READY_TO_COMPLETE,
          theCase,
          verdictAppeal(appealState),
        ),
      ).toThrow(ForbiddenException)
    })

    it('is withdrawn from the state it is filed in', () => {
      const { appealCaseUpdate } = transitionAppealCase(
        AppealCaseTransition.WITHDRAW_APPEAL,
        theCase,
        verdictAppeal(AppealCaseState.APPEALED),
      )

      expect(appealCaseUpdate).toEqual({
        appealState: AppealCaseState.WITHDRAWN,
      })
    })
  })

  describe('a ruling appeal', () => {
    it.each(Object.values(AppealCaseState))(
      'is never marked ready to complete from %s',
      (appealState) => {
        expect(() =>
          transitionAppealCase(
            AppealCaseTransition.MARK_APPEAL_READY_TO_COMPLETE,
            { type: CaseType.CUSTODY } as Case,
            { appealType: AppealCaseType.RULING, appealState } as AppealCase,
          ),
        ).toThrow(ForbiddenException)
      },
    )

    it.each(Object.values(AppealCaseState))(
      'is never taken back from %s',
      (appealState) => {
        expect(() =>
          transitionAppealCase(
            AppealCaseTransition.UNMARK_APPEAL_READY_TO_COMPLETE,
            { type: CaseType.CUSTODY } as Case,
            { appealType: AppealCaseType.RULING, appealState } as AppealCase,
          ),
        ).toThrow(ForbiddenException)
      },
    )

    it('is not completed from READY_TO_COMPLETE', () => {
      expect(() =>
        transitionAppealCase(
          AppealCaseTransition.COMPLETE_APPEAL,
          { type: CaseType.CUSTODY } as Case,
          {
            appealType: AppealCaseType.RULING,
            appealState: AppealCaseState.READY_TO_COMPLETE,
          } as AppealCase,
        ),
      ).toThrow(ForbiddenException)
    })

    it('is not completed before it is received', () => {
      const theCase = { type: CaseType.CUSTODY } as Case
      const appealCase = { appealState: AppealCaseState.APPEALED } as AppealCase

      expect(() =>
        transitionAppealCase(
          AppealCaseTransition.COMPLETE_APPEAL,
          theCase,
          appealCase,
        ),
      ).toThrow(ForbiddenException)
    })
  })
})
