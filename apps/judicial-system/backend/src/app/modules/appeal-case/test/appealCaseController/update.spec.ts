import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@nestjs/common'

import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import { MessageType } from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  CaseFileCategory,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealCaseModule } from '../createTestingAppealCaseModule'

import { nowFactory } from '../../../../factories'
import { queueMessagesAfterCommit } from '../../../../middleware'
import {
  AppealCase,
  AppealCaseRepositoryService,
  Case,
} from '../../../repository'
import { UserService } from '../../../user'
import { UpdateAppealCaseDto } from '../../dto/updateAppealCase.dto'

jest.mock('../../../../middleware/queueMessagesAfterCommit')
jest.mock('../../../../factories')

interface Then {
  result: AppealCase
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  appealCase: AppealCase,
  update: UpdateAppealCaseDto,
) => Promise<Then>

describe('AppealCaseController - Update', () => {
  const caseId = uuid()
  const appealCaseId = uuid()

  const user = {
    id: uuid(),
    role: UserRole.COURT_OF_APPEALS_JUDGE,
    name: 'Anna Logmann',
    title: 'dómari',
    institution: { type: InstitutionType.COURT_OF_APPEALS },
  } as User

  const now = new Date('2024-01-15T10:00:00Z')

  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let mockUserService: UserService
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const {
      appealCaseController,
      appealCaseRepositoryService,
      userService,
      sequelize,
    } = await createTestingAppealCaseModule()

    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockUserService = userService

    const mockNowFactory = nowFactory as jest.Mock
    mockNowFactory.mockReturnValue(now)

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementation(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (theCase, appealCase, update) => {
      const then = {} as Then

      const updatedAppealCase = { ...appealCase, ...update } as AppealCase
      const mockUpdate = mockAppealCaseRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedAppealCase)

      await appealCaseController
        .update(caseId, appealCaseId, user, theCase, appealCase, update)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('plain update', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const appealCase = { id: appealCaseId, caseId } as AppealCase
    const update = { appealConclusion: 'Conclusion' }
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, appealCase, update)
    })

    it('should update the appeal case', () => {
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        { appealConclusion: 'Conclusion' },
        { transaction },
      )
      expect(then.result).toEqual({ ...appealCase, ...update })
    })
  })

  describe('appeal ruling modified history', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const appealCase = { id: appealCaseId, caseId } as AppealCase
    const update = { appealRulingModifiedHistory: 'Fixed a typo' }

    beforeEach(async () => {
      await givenWhenThen(theCase, appealCase, update)
    })

    it('should prepend the author and timestamp to the history entry', () => {
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        {
          appealRulingModifiedHistory: `${capitalize(
            formatDate(now, 'PPPPp'),
          )} - ${user.name} ${user.title}\n\nFixed a typo`,
        },
        { transaction },
      )
    })
  })

  describe('a new appeal case number is assigned', () => {
    const statementFileId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.CUSTODY,
      caseFiles: [
        {
          id: statementFileId,
          isKeyAccessible: true,
          category: CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
        },
        {
          id: uuid(),
          isKeyAccessible: false,
          category: CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
        },
      ],
    } as unknown as Case
    const appealCase = { id: appealCaseId, caseId } as AppealCase
    const update = { appealCaseNumber: 'LANDSRÉTTUR 1/2024' }

    beforeEach(async () => {
      await givenWhenThen(theCase, appealCase, update)
    })

    it('should queue delivery of the accessible appeal statement file', () => {
      expect(queueMessagesAfterCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE,
          caseId,
          elementId: [appealCaseId, statementFileId],
        }),
      )
    })

    it('should queue delivery of the received date to the court of appeals', () => {
      expect(queueMessagesAfterCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_RECEIVED_DATE,
          caseId,
          elementId: appealCaseId,
        }),
      )
    })

    it('should queue nothing else before the roles are assigned', () => {
      expect(queueMessagesAfterCommit).toHaveBeenCalledTimes(2)
    })
  })

  describe('the last appeal role is assigned', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const assistantId = uuid()
    const judge1Id = uuid()
    const judge2Id = uuid()
    const judge3Id = uuid()
    const appealCase = {
      id: appealCaseId,
      caseId,
      appealCaseNumber: 'LANDSRÉTTUR 1/2024',
      appealAssistantId: assistantId,
      appealJudge1Id: judge1Id,
      appealJudge2Id: judge2Id,
    } as AppealCase
    const update = { appealJudge3Id: judge3Id }

    beforeEach(async () => {
      const mockFindById = mockUserService.findById as jest.Mock
      mockFindById.mockResolvedValueOnce({
        id: judge3Id,
        role: UserRole.COURT_OF_APPEALS_JUDGE,
      })

      await givenWhenThen(theCase, appealCase, update)
    })

    it('should queue delivery of the assigned roles to the court of appeals', () => {
      expect(queueMessagesAfterCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_ASSIGNED_ROLES,
          caseId,
          elementId: appealCaseId,
        }),
      )
    })

    it('should notify only the newly assigned judge', () => {
      expect(queueMessagesAfterCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          caseId,
          elementId: appealCaseId,
          body: {
            type: AppealCaseNotificationType.APPEAL_JUDGES_ASSIGNED,
            userIds: [judge3Id],
          },
        }),
      )
    })

    it('should queue nothing else', () => {
      expect(queueMessagesAfterCommit).toHaveBeenCalledTimes(2)
    })
  })

  describe('a judge is assigned while other roles are still open', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const judge1Id = uuid()
    const appealCase = {
      id: appealCaseId,
      caseId,
      appealCaseNumber: 'LANDSRÉTTUR 1/2024',
    } as AppealCase
    const update = { appealJudge1Id: judge1Id }

    beforeEach(async () => {
      const mockFindById = mockUserService.findById as jest.Mock
      mockFindById.mockResolvedValueOnce({
        id: judge1Id,
        role: UserRole.COURT_OF_APPEALS_JUDGE,
      })

      await givenWhenThen(theCase, appealCase, update)
    })

    it('should notify the judge but not deliver the roles yet', () => {
      expect(queueMessagesAfterCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          body: {
            type: AppealCaseNotificationType.APPEAL_JUDGES_ASSIGNED,
            userIds: [judge1Id],
          },
        }),
      )
      expect(queueMessagesAfterCommit).toHaveBeenCalledTimes(1)
    })
  })

  describe('an assistant is assigned with the wrong role', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const appealCase = { id: appealCaseId, caseId } as AppealCase
    const assistantId = uuid()
    const update = { appealAssistantId: assistantId }
    let then: Then

    beforeEach(async () => {
      const mockFindById = mockUserService.findById as jest.Mock
      mockFindById.mockResolvedValueOnce({
        id: assistantId,
        role: UserRole.COURT_OF_APPEALS_JUDGE,
      })

      then = await givenWhenThen(theCase, appealCase, update)
    })

    it('should throw ForbiddenException and not update the appeal case', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
    })
  })
})
