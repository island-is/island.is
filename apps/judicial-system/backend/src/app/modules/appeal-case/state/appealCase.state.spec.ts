import {
  AppealCaseState,
  AppealCaseTransition,
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
})
