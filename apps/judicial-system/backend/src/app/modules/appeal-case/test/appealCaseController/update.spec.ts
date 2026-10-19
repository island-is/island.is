import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
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
import {
  getOrCreateTransaction,
  getTransactionContext,
  queueMessagesAfterCommit,
  TransactionContext,
} from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import {
  AppealCase,
  AppealCaseJudge,
  AppealCaseJudgeRepositoryService,
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

// Judge rows as the repository loads them, in bench order.
const bench = (userIds: string[]): AppealCaseJudge[] =>
  userIds.map(
    (userId, displayOrder) => ({ userId, displayOrder } as AppealCaseJudge),
  )

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
  let mockAppealCaseJudgeRepositoryService: AppealCaseJudgeRepositoryService
  let mockUserService: UserService
  let mockSequelize: Sequelize
  let transaction: Transaction
  let transactionContext: TransactionContext | undefined
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const {
      appealCaseController,
      appealCaseRepositoryService,
      appealCaseJudgeRepositoryService,
      userService,
      sequelize,
    } = await createTestingAppealCaseModule()

    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockAppealCaseJudgeRepositoryService = appealCaseJudgeRepositoryService
    mockUserService = userService

    // Every assigned user looks up as a judge unless a test says otherwise.
    const mockFindById = mockUserService.findById as jest.Mock
    mockFindById.mockImplementation(async (id: string) => ({
      id,
      role: UserRole.COURT_OF_APPEALS_JUDGE,
    }))

    const mockNowFactory = nowFactory as jest.Mock
    mockNowFactory.mockReturnValue(now)

    mockSequelize = sequelize
    transactionContext = undefined

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    givenWhenThen = async (theCase, appealCase, update) => {
      const then = {} as Then

      const { appealJudgeIds, ...columnUpdate } = update
      const updatedAppealCase = {
        ...appealCase,
        ...columnUpdate,
      } as AppealCase
      const mockUpdate = mockAppealCaseRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedAppealCase)

      // The reload after a bench change returns the bench as stored.
      const mockFindById = mockAppealCaseRepositoryService.findById as jest.Mock
      mockFindById.mockResolvedValueOnce({
        ...updatedAppealCase,
        appealJudges: bench(appealJudgeIds ?? []),
      })

      // The route is guarded by CaseExistsForUpdateGuard, so the request
      // transaction is already open - and holding a lock on this case row -
      // by the time the handler runs. Guards do not execute in controller
      // unit tests, so the request context and that transaction are set up
      // here instead.
      try {
        await runInRequestContext(async () => {
          transactionContext = getTransactionContext()

          await getOrCreateTransaction(mockSequelize)

          then.result = await appealCaseController.update(
            caseId,
            appealCaseId,
            user,
            theCase,
            appealCase,
            update,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

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

    it('should update the appeal case in the transaction the guard opened, without opening another', () => {
      // Once, by the stand-in for CaseExistsForUpdateGuard above. A second
      // call would be the handler opening a transaction of its own, which
      // would block on the guard's row lock and deadlock the request.
      expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        { appealConclusion: 'Conclusion' },
        { transaction },
      )
      expect(then.result).toEqual({ ...appealCase, ...update })
    })

    // An update announces nothing, so nothing waits for the commit.
    it('should register nothing to run after the commit', () => {
      expect(transactionContext?.afterCommit).toHaveLength(0)
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
      appealJudges: bench([judge1Id, judge2Id]),
    } as AppealCase
    const update = { appealJudgeIds: [judge1Id, judge2Id, judge3Id] }
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, appealCase, update)
    })

    it('should validate every judge on the bench', () => {
      expect(mockUserService.findById).toHaveBeenCalledTimes(3)
    })

    it('should replace the bench without touching the appeal case row', () => {
      expect(
        mockAppealCaseJudgeRepositoryService.replaceForAppealCase,
      ).toHaveBeenCalledWith(appealCaseId, [judge1Id, judge2Id, judge3Id], {
        transaction,
      })
      expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
    })

    it('should return the appeal case with the stored bench', () => {
      expect(mockAppealCaseRepositoryService.findById).toHaveBeenCalledWith(
        appealCaseId,
        { transaction },
      )
      expect(then.result.appealJudges?.map((judge) => judge.userId)).toEqual([
        judge1Id,
        judge2Id,
        judge3Id,
      ])
    })

    // The guard holds a write lock on the case row while the assigned user
    // is read, so the read joins the request transaction rather than waiting
    // on a second connection from the pool.
    it('should read the assigned judge in the request transaction', () => {
      expect(mockUserService.findById).toHaveBeenCalledWith(judge3Id, {
        transaction,
      })
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
    const update = { appealJudgeIds: [judge1Id] }

    beforeEach(async () => {
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

  describe('a fourth judge joins a full bench', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const assistantId = uuid()
    const judgeIds = [uuid(), uuid(), uuid()]
    const judge4Id = uuid()
    const appealCase = {
      id: appealCaseId,
      caseId,
      appealCaseNumber: 'LANDSRÉTTUR 1/2024',
      appealAssistantId: assistantId,
      appealJudges: bench(judgeIds),
    } as AppealCase
    const update = { appealJudgeIds: [...judgeIds, judge4Id] }

    beforeEach(async () => {
      await givenWhenThen(theCase, appealCase, update)
    })

    it('should store all four judges', () => {
      expect(
        mockAppealCaseJudgeRepositoryService.replaceForAppealCase,
      ).toHaveBeenCalledWith(appealCaseId, [...judgeIds, judge4Id], {
        transaction,
      })
    })

    it('should deliver the roles again and notify the new judge only', () => {
      expect(queueMessagesAfterCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_ASSIGNED_ROLES,
        }),
      )
      expect(queueMessagesAfterCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          body: {
            type: AppealCaseNotificationType.APPEAL_JUDGES_ASSIGNED,
            userIds: [judge4Id],
          },
        }),
      )
      expect(queueMessagesAfterCommit).toHaveBeenCalledTimes(2)
    })
  })

  describe('the bench is reordered', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const assistantId = uuid()
    const judgeIds = [uuid(), uuid(), uuid()]
    const appealCase = {
      id: appealCaseId,
      caseId,
      appealCaseNumber: 'LANDSRÉTTUR 1/2024',
      appealAssistantId: assistantId,
      appealJudges: bench(judgeIds),
    } as AppealCase
    const update = { appealJudgeIds: [judgeIds[2], judgeIds[0], judgeIds[1]] }

    beforeEach(async () => {
      await givenWhenThen(theCase, appealCase, update)
    })

    it('should store the new order', () => {
      expect(
        mockAppealCaseJudgeRepositoryService.replaceForAppealCase,
      ).toHaveBeenCalledWith(appealCaseId, update.appealJudgeIds, {
        transaction,
      })
    })

    it('should deliver the roles again, as the presiding judge changed, but notify nobody', () => {
      expect(queueMessagesAfterCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.DELIVERY_TO_COURT_OF_APPEALS_ASSIGNED_ROLES,
        }),
      )
      expect(queueMessagesAfterCommit).toHaveBeenCalledTimes(1)
    })
  })

  describe('the bench is sent unchanged', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const assistantId = uuid()
    const judgeIds = [uuid(), uuid(), uuid()]
    const appealCase = {
      id: appealCaseId,
      caseId,
      appealCaseNumber: 'LANDSRÉTTUR 1/2024',
      appealAssistantId: assistantId,
      appealJudges: bench(judgeIds),
    } as AppealCase
    const update = { appealJudgeIds: [...judgeIds] }
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, appealCase, update)
    })

    it('should change nothing and queue nothing', () => {
      expect(
        mockAppealCaseJudgeRepositoryService.replaceForAppealCase,
      ).not.toHaveBeenCalled()
      expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
      expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
      expect(then.result).toBe(appealCase)
    })
  })

  describe('the bench is cleared', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const assistantId = uuid()
    const appealCase = {
      id: appealCaseId,
      caseId,
      appealCaseNumber: 'LANDSRÉTTUR 1/2024',
      appealAssistantId: assistantId,
      appealJudges: bench([uuid(), uuid(), uuid()]),
    } as AppealCase
    const update = { appealJudgeIds: [] }

    beforeEach(async () => {
      await givenWhenThen(theCase, appealCase, update)
    })

    it('should remove every judge and queue nothing', () => {
      expect(
        mockAppealCaseJudgeRepositoryService.replaceForAppealCase,
      ).toHaveBeenCalledWith(appealCaseId, [], { transaction })
      expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
    })
  })

  describe('a judge is assigned with the wrong role', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const appealCase = { id: appealCaseId, caseId } as AppealCase
    const judgeId = uuid()
    const update = { appealJudgeIds: [judgeId] }
    let then: Then

    beforeEach(async () => {
      const mockFindById = mockUserService.findById as jest.Mock
      mockFindById.mockResolvedValueOnce({
        id: judgeId,
        role: UserRole.COURT_OF_APPEALS_ASSISTANT,
      })

      then = await givenWhenThen(theCase, appealCase, update)
    })

    it('should throw ForbiddenException and not touch the bench', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(
        mockAppealCaseJudgeRepositoryService.replaceForAppealCase,
      ).not.toHaveBeenCalled()
    })
  })

  describe('a judge is assigned to one slot', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const judgeIds = [uuid(), uuid(), uuid()]
    const newJudgeId = uuid()
    const appealCase = {
      id: appealCaseId,
      caseId,
      appealJudges: bench(judgeIds),
    } as AppealCase
    const update = { appealJudge2Id: newJudgeId }

    beforeEach(async () => {
      await givenWhenThen(theCase, appealCase, update)
    })

    it('should validate the new judge', () => {
      expect(mockUserService.findById).toHaveBeenCalledWith(newJudgeId, {
        transaction,
      })
    })

    it('should replace only that position on the bench', () => {
      expect(
        mockAppealCaseJudgeRepositoryService.replaceForAppealCase,
      ).toHaveBeenCalledWith(
        appealCaseId,
        [judgeIds[0], newJudgeId, judgeIds[2]],
        { transaction },
      )
    })

    it('should not write the slot to the appeal case row', () => {
      expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
    })
  })

  describe('judges are assigned to the slots of an empty bench', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const judge1Id = uuid()
    const judge3Id = uuid()
    const appealCase = { id: appealCaseId, caseId } as AppealCase
    const update = { appealJudge1Id: judge1Id, appealJudge3Id: judge3Id }

    beforeEach(async () => {
      await givenWhenThen(theCase, appealCase, update)
    })

    it('should store the judges in slot order', () => {
      expect(
        mockAppealCaseJudgeRepositoryService.replaceForAppealCase,
      ).toHaveBeenCalledWith(appealCaseId, [judge1Id, judge3Id], {
        transaction,
      })
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
