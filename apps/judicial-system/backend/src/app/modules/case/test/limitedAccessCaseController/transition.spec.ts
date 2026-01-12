import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import type { User } from '@island.is/judicial-system/types'
import {
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseFileCategory,
  CaseFileState,
  CaseNotificationType,
  CaseState,
  CaseTransition,
  CaseType,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { randomDate } from '../../../../test'
import { Case, CaseRepositoryService } from '../../../repository'

jest.mock('../../../../factories')

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (
  state: CaseState,
  transition: CaseTransition,
  appealState?: CaseAppealState,
) => Promise<Then>

describe('LimitedAccessCaseController - Transition', () => {
  const date = randomDate()
  const user = { id: uuid(), role: UserRole.DEFENDER } as User
  const caseId = uuid()
  const defenderAppealBriefId = uuid()
  const defenderAppealBriefCaseFileId1 = uuid()
  const defenderAppealBriefCaseFileId2 = uuid()
  const caseFiles = [
    {
      id: defenderAppealBriefId,
      key: uuid(),
      isKeyAccessible: true,
      state: CaseFileState.STORED_IN_RVG,
      category: CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
    },
    {
      id: defenderAppealBriefCaseFileId1,
      key: uuid(),
      isKeyAccessible: true,
      state: CaseFileState.STORED_IN_RVG,
      category: CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
    },
    {
      id: defenderAppealBriefCaseFileId2,
      key: uuid(),
      isKeyAccessible: true,
      state: CaseFileState.STORED_IN_RVG,
      category: CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
    },
  ]

  let transaction: Transaction
  let mockMessageService: MessageService
  let mockCaseRepositoryService: CaseRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      sequelize,
      messageService,
      caseRepositoryService,
      limitedAccessCaseController,
    } = await createTestingCaseModule()

    mockMessageService = messageService
    mockCaseRepositoryService = caseRepositoryService

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValueOnce(date)
    const mockUpdate = mockCaseRepositoryService.update as jest.Mock
    mockUpdate.mockResolvedValue({})

    givenWhenThen = async (
      state: CaseState,
      transition: CaseTransition,
      appealState?: CaseAppealState,
    ) => {
      const then = {} as Then

      try {
        then.result = await limitedAccessCaseController.transition(
          caseId,
          user,
          {
            id: caseId,
            type: CaseType.EXPULSION_FROM_HOME,
            state,
            caseFiles,
            appealState,
          } as Case,
          { transition },
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe.each([CaseState.ACCEPTED, CaseState.REJECTED])(
    'appeal %s case',
    (state) => {
      const updatedCase = {
        id: caseId,
        state,
        caseFiles,
        appealState: CaseAppealState.APPEALED,
        accusedPostponedAppealDate: date,
      } as Case
      let then: Then

      beforeEach(async () => {
        const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
        mockFindOne.mockResolvedValueOnce(updatedCase)

        then = await givenWhenThen(state, CaseTransition.APPEAL)
      })

      it('should transition the case', () => {
        expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(caseId, {
          appealState: CaseAppealState.APPEALED,
          accusedPostponedAppealDate: date,
        })
      })

      it('should queue a notification message', () => {
        expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
          {
            type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
            user,
            caseId,
            elementId: defenderAppealBriefId,
          },
          {
            type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
            user,
            caseId,
            elementId: defenderAppealBriefCaseFileId1,
          },
          {
            type: MessageType.DELIVERY_TO_COURT_CASE_FILE,
            user,
            caseId,
            elementId: defenderAppealBriefCaseFileId2,
          },
          {
            type: MessageType.NOTIFICATION,
            user,
            caseId,
            body: { type: CaseNotificationType.APPEAL_TO_COURT_OF_APPEALS },
          },
        ])
      })

      it('should return the updated case', () => {
        expect(then.result).toBe(updatedCase)
      })
    },
  )

  describe.each([CaseState.ACCEPTED, CaseState.REJECTED])(
    'withdraw %s case',
    (state) => {
      const updatedCase = {
        id: caseId,
        state,
        caseFiles,
        appealState: CaseAppealState.WITHDRAWN,
      } as Case
      let then: Then

      beforeEach(async () => {
        const mockFindOne = mockCaseRepositoryService.findOne as jest.Mock
        mockFindOne.mockResolvedValueOnce(updatedCase)

        then = await givenWhenThen(
          state,
          CaseTransition.WITHDRAW_APPEAL,
          CaseAppealState.RECEIVED,
        )
      })

      it('should transition the case', () => {
        expect(mockCaseRepositoryService.update).toHaveBeenCalledWith(caseId, {
          appealState: CaseAppealState.WITHDRAWN,
          appealRulingDecision: CaseAppealRulingDecision.DISCONTINUED,
        })
      })

      it('should queue a notification message', () => {
        expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
          {
            type: MessageType.NOTIFICATION,
            user,
            caseId,
            body: { type: CaseNotificationType.APPEAL_WITHDRAWN },
          },
        ])
      })

      it('should return the updated case', () => {
        expect(then.result).toBe(updatedCase)
      })
    },
  )
})
