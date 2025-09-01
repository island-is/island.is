import { uuid } from 'uuidv4'

import { MessageService, MessageType } from '@island.is/judicial-system/message'
import {
  CaseFileCategory,
  CaseFileState,
  CaseNotificationType,
  User,
} from '@island.is/judicial-system/types'

import { createTestingCaseModule } from '../createTestingCaseModule'

import { nowFactory } from '../../../../factories'
import { randomDate } from '../../../../test'
import { Case } from '../../../repository'

jest.mock('../../../../factories')

interface Then {
  result: Case
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('LimitedAccessCaseController - Update', () => {
  const date = randomDate()
  const userId = uuid()
  const user = { id: userId } as User
  const statementId = uuid()
  const fileId = uuid()
  const caseFiles = [
    {
      id: statementId,
      key: uuid(),
      state: CaseFileState.STORED_IN_RVG,
      category: CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
    },
    {
      id: fileId,
      key: uuid(),
      state: CaseFileState.STORED_IN_RVG,
      category: CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
    },
  ]
  const caseId = uuid()
  const theCase = {
    id: caseId,
    caseFiles,
  } as Case
  const updateDto = { defendantStatementDate: new Date() }
  const updatedCase = {
    ...theCase,
    defendantStatementDate: date,
    caseFiles,
  } as Case

  let mockMessageService: MessageService
  let mockCaseModel: typeof Case
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { messageService, caseModel, limitedAccessCaseController } =
      await createTestingCaseModule()

    mockMessageService = messageService
    mockCaseModel = caseModel

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValueOnce(date)
    const mockUpdate = mockCaseModel.update as jest.Mock
    mockUpdate.mockResolvedValue([1])
    const mockFindOne = mockCaseModel.findOne as jest.Mock
    mockFindOne.mockResolvedValue(updatedCase)

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        then.result = await limitedAccessCaseController.update(
          caseId,
          user,
          theCase,
          updateDto,
        )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('defendant statement date updated', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should update the case', () => {
      expect(mockCaseModel.update).toHaveBeenCalledWith(
        { defendantStatementDate: date },
        { where: { id: caseId } },
      )
    })

    it('should queue messages', () => {
      expect(mockMessageService.sendMessagesToQueue).toHaveBeenCalledWith([
        {
          type: MessageType.NOTIFICATION,
          user,
          caseId,
          body: { type: CaseNotificationType.APPEAL_STATEMENT },
        },
      ])
    })

    it('should return the updated case', () => {
      expect(then.result).toEqual(updatedCase)
    })
  })
})
