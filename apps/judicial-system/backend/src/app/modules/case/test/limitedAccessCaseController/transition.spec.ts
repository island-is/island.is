import { Transaction } from 'sequelize'
import { uuid } from 'uuidv4'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import type { User } from '@island.is/judicial-system/types'
import {
  CaseAppealState,
  CaseFileCategory,
  CaseFileState,
  CaseState,
  CaseTransition,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { randomDate } from '../../../../test'
import { Case } from '../../models/case.model'

jest.mock('../../../../factories')

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = (state: CaseState) => Promise<Then>

describe('LimitedAccessCaseController - Transition', () => {
  const date = randomDate()
  const user = { id: uuid() } as User
  const caseId = uuid()
  const defenderAppealBriefId = uuid()
  const defenderAppealBriefCaseFileId1 = uuid()
  const defenderAppealBriefCaseFileId2 = uuid()
  const caseFiles = [
    {
      id: defenderAppealBriefId,
      key: uuid(),
      state: CaseFileState.STORED_IN_RVG,
      category: CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
    },
    {
      id: defenderAppealBriefCaseFileId1,
      key: uuid(),
      state: CaseFileState.STORED_IN_RVG,
      category: CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
    },
    {
      id: defenderAppealBriefCaseFileId2,
      key: uuid(),
      state: CaseFileState.STORED_IN_RVG,
      category: CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
    },
  ]

  let transaction: Transaction
  let mockMessageService: MessageService
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      sequelize,
      messageService,
      caseModel,
      limitedAccessCaseController,
    } = await createTestingCaseModule()

    mockMessageService = messageService
    mockCaseModel = caseModel

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValueOnce(date)
    const mockUpdate = mockCaseModel.update as jest.Mock
    mockUpdate.mockResolvedValue([1])

    givenWhenThen = async (state: CaseState) => {
      const then = {} as Then

      try {
        then.result = await limitedAccessCaseController.transition(
          caseId,
          user,
          { id: caseId, state, caseFiles } as Case,
          { transition: CaseTransition.APPEAL },
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
        const mockFindOne = mockCaseModel.findOne as jest.Mock
        mockFindOne.mockResolvedValueOnce(updatedCase)

        then = await givenWhenThen(state)
      })

      it('should transition the case', () => {
        expect(mockCaseModel.update).toHaveBeenCalledWith(
          {
            appealState: CaseAppealState.APPEALED,
            accusedPostponedAppealDate: date,
          },
          { where: { id: caseId } },
        )
      })

      it('should queue a notification message', () => {
        expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
          {
            type: MessageType.DELIVER_CASE_FILE_TO_COURT,
            user,
            caseId,
            caseFileId: defenderAppealBriefId,
          },
          {
            type: MessageType.DELIVER_CASE_FILE_TO_COURT,
            user,
            caseId,
            caseFileId: defenderAppealBriefCaseFileId1,
          },
          {
            type: MessageType.DELIVER_CASE_FILE_TO_COURT,
            user,
            caseId,
            caseFileId: defenderAppealBriefCaseFileId2,
          },
          {
            type: MessageType.SEND_APPEAL_TO_COURT_OF_APPEALS_NOTIFICATION,
            user,
            caseId,
          },
        ])
      })

      it('should return the updated case', () => {
        expect(then.result).toBe(updatedCase)
      })
    },
  )
})
