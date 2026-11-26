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
  })
  describe('a verdict appeal', () => {
    const theCase = { type: CaseType.INDICTMENT } as Case
    const verdictAppeal = (appealState: AppealCaseState) =>
      ({ appealType: AppealCaseType.VERDICT, appealState } as AppealCase)

    it('is completed from the state it is filed in', () => {
      const { caseUpdate, appealCaseUpdate } = transitionAppealCase(
        AppealCaseTransition.COMPLETE_APPEAL,
        theCase,
        verdictAppeal(AppealCaseState.APPEALED),
      )

      expect(caseUpdate).toEqual({})
      expect(appealCaseUpdate).toEqual({
        appealState: AppealCaseState.COMPLETED,
        appealRulingDate: now,
      })
    })

    it.each([
      AppealCaseState.RECEIVED,
      AppealCaseState.WITHDRAWN,
      AppealCaseState.COMPLETED,
    ])('is not completed from %s', (appealState) => {
      expect(() =>
        transitionAppealCase(
          AppealCaseTransition.COMPLETE_APPEAL,
          theCase,
          verdictAppeal(appealState),
        ),
      ).toThrow(ForbiddenException)
    })

    it.each([
      [AppealCaseTransition.RECEIVE_APPEAL, AppealCaseState.APPEALED],
      [AppealCaseTransition.REOPEN_APPEAL, AppealCaseState.COMPLETED],
    ])('is never transitioned with %s', (transition, appealState) => {
      expect(() =>
        transitionAppealCase(transition, theCase, verdictAppeal(appealState)),
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
