import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { BadRequestException, ForbiddenException } from '@nestjs/common'

import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import { MessageType } from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCaseType,
  AppealRulingType,
  CaseFileCategory,
  CaseType,
  InstitutionType,
  User,
  UserRole,
  VerdictAppealStatus,
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
import { FileService } from '../../../file'
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
  let mockFileService: FileService
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
      fileService,
      sequelize,
    } = await createTestingAppealCaseModule()

    mockFileService = fileService

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

      // The reload after a change returns the appeal case as stored, with
      // the bench when it was replaced.
      const mockFindById = mockAppealCaseRepositoryService.findById as jest.Mock
      mockFindById.mockResolvedValueOnce({
        ...updatedAppealCase,
        appealJudges: appealJudgeIds
          ? bench(appealJudgeIds)
          : appealCase.appealJudges,
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
    })

    // The row the update returns carries ids only, so the response is read
    // back with its associations.
    it('should return the appeal case as stored', () => {
      expect(mockAppealCaseRepositoryService.findById).toHaveBeenCalledWith(
        appealCaseId,
        { transaction },
      )
      expect(then.result).toEqual({ ...appealCase, ...update })
    })

    // An update announces nothing, so nothing waits for the commit.
    it('should register nothing to run after the commit', () => {
      expect(transactionContext?.afterCommit).toHaveLength(0)
    })
  })

  describe('a ruling type is set on a verdict appeal', () => {
    const theCase = { id: caseId, type: CaseType.INDICTMENT } as Case
    const appealCase = {
      id: appealCaseId,
      caseId,
      appealType: AppealCaseType.VERDICT,
    } as AppealCase
    const update = { appealRulingType: AppealRulingType.RULING }
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, appealCase, update)
    })

    it('should store the ruling type', () => {
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        { appealRulingType: AppealRulingType.RULING },
        { transaction },
      )
      expect(then.result.appealRulingType).toBe(AppealRulingType.RULING)
    })
  })

  describe('a ruling type is set on a ruling appeal', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const appealCase = {
      id: appealCaseId,
      caseId,
      appealType: AppealCaseType.RULING,
    } as AppealCase
    const update = {
      appealRulingType: AppealRulingType.VERDICT,
      appealConclusion: 'Conclusion',
    }
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, appealCase, update)
    })

    it('should throw BadRequestException and store nothing', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
    })
  })

  describe('verdict appeal status', () => {
    const theCase = { id: caseId, type: CaseType.INDICTMENT } as Case
    const update = { verdictAppealStatus: VerdictAppealStatus.UNDER_ADVISEMENT }

    it('should store the status on a verdict appeal', async () => {
      const appealCase = {
        id: appealCaseId,
        caseId,
        appealType: AppealCaseType.VERDICT,
      } as AppealCase

      const then = await givenWhenThen(theCase, appealCase, update)

      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        { verdictAppealStatus: VerdictAppealStatus.UNDER_ADVISEMENT },
        { transaction },
      )
      expect(then.result.verdictAppealStatus).toBe(
        VerdictAppealStatus.UNDER_ADVISEMENT,
      )
    })

    // The status belongs to the verdict appeal's own steps; a ruling appeal
    // has none, so the column must stay empty there.
    it('should refuse the status on a ruling appeal', async () => {
      const appealCase = {
        id: appealCaseId,
        caseId,
        appealType: AppealCaseType.RULING,
      } as AppealCase

      const then = await givenWhenThen(theCase, appealCase, update)

      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
    })
  })

  describe('the outcome of a verdict appeal', () => {
    const theCase = { id: caseId, type: CaseType.INDICTMENT } as Case
    const recorded = {
      id: appealCaseId,
      caseId,
      appealType: AppealCaseType.VERDICT,
      verdictAppealStatus: VerdictAppealStatus.COMPLETED,
      appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
      appealRulingType: AppealRulingType.VERDICT,
      appealConclusion: 'The appealed judgment stands.',
      appealRulingDate: new Date('2024-01-10T00:00:00Z'),
    }
    const changes: [string, UpdateAppealCaseDto][] = [
      [
        'appealRulingDecision',
        { appealRulingDecision: AppealCaseRulingDecision.CHANGED },
      ],
      ['appealRulingType', { appealRulingType: AppealRulingType.RULING }],
      ['appealConclusion', { appealConclusion: 'The judgment is set aside.' }],
      [
        'appealRulingDate',
        { appealRulingDate: new Date('2024-01-12T00:00:00Z') },
      ],
      ['appealRulingModifiedHistory', { appealRulingModifiedHistory: 'Typo' }],
      [
        'verdictAppealStatus',
        { verdictAppealStatus: VerdictAppealStatus.UNDER_ADVISEMENT },
      ],
    ]

    // The court can still correct what it recorded until the outcome is
    // released.
    it.each(changes)(
      'should store a change of %s once the appeal is confirmed',
      async (_, update) => {
        const then = await givenWhenThen(
          theCase,
          {
            ...recorded,
            appealState: AppealCaseState.READY_TO_COMPLETE,
          } as AppealCase,
          update,
        )

        expect(then.error).toBeUndefined()
        expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledTimes(1)
      },
    )

    // Once released, the outcome is everyone's.
    it.each(changes)(
      'should refuse a change of %s once the appeal is completed',
      async (_, update) => {
        const then = await givenWhenThen(
          theCase,
          { ...recorded, appealState: AppealCaseState.COMPLETED } as AppealCase,
          update,
        )

        expect(then.error).toBeInstanceOf(ForbiddenException)
        expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
        expect(
          mockFileService.invalidateVerdictAppealRulingConfirmation,
        ).not.toHaveBeenCalled()
        expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
      },
    )

    // A form that saves every field it shows sends the outcome back as it is.
    it('should store an update of a completed appeal that repeats its outcome', async () => {
      const then = await givenWhenThen(
        theCase,
        { ...recorded, appealState: AppealCaseState.COMPLETED } as AppealCase,
        {
          appealRulingDecision: recorded.appealRulingDecision,
          appealRulingType: recorded.appealRulingType,
          appealConclusion: recorded.appealConclusion,
          appealRulingDate: new Date(recorded.appealRulingDate),
          verdictAppealStatus: recorded.verdictAppealStatus,
          caseName: 'A v. B',
        },
      )

      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledTimes(1)
    })

    // An empty history is written over the stored one, so it would blank it.
    it.each([
      ['an empty', ''],
      ['a null', null],
    ])(
      'should refuse %s modification history once the appeal is completed',
      async (_, appealRulingModifiedHistory) => {
        const then = await givenWhenThen(
          theCase,
          {
            ...recorded,
            appealState: AppealCaseState.COMPLETED,
            appealRulingModifiedHistory: 'An earlier correction',
          } as AppealCase,
          { appealRulingModifiedHistory } as unknown as UpdateAppealCaseDto,
        )

        expect(then.error).toBeInstanceOf(ForbiddenException)
        expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
      },
    )

    it('should store a null modification history on a completed appeal that has none', async () => {
      const then = await givenWhenThen(
        theCase,
        { ...recorded, appealState: AppealCaseState.COMPLETED } as AppealCase,
        { appealRulingModifiedHistory: null } as unknown as UpdateAppealCaseDto,
      )

      expect(then.error).toBeUndefined()
    })

    it('should store a change outside the outcome of a completed appeal', async () => {
      const then = await givenWhenThen(
        theCase,
        { ...recorded, appealState: AppealCaseState.COMPLETED } as AppealCase,
        { caseName: 'A v. B' },
      )

      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        { caseName: 'A v. B' },
        { transaction },
      )
    })

    // A ruling appeal's outcome is not withheld, so nothing about it is locked
    // by its completion here.
    it.each([
      [
        'appealRulingDecision',
        { appealRulingDecision: AppealCaseRulingDecision.CHANGED },
      ],
      ['appealConclusion', { appealConclusion: 'The ruling is set aside.' }],
      ['appealRulingModifiedHistory', { appealRulingModifiedHistory: 'Typo' }],
    ])(
      'should store a change of %s on a completed ruling appeal',
      async (_, update) => {
        const then = await givenWhenThen(
          { id: caseId, type: CaseType.CUSTODY } as Case,
          {
            id: appealCaseId,
            caseId,
            appealType: AppealCaseType.RULING,
            appealState: AppealCaseState.COMPLETED,
            appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
            appealConclusion: 'The ruling stands.',
          } as AppealCase,
          update as UpdateAppealCaseDto,
        )

        expect(then.error).toBeUndefined()
        expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledTimes(1)
      },
    )
  })

  // The court's case number, bench and assistant are frozen with the outcome
  // once a verdict appeal is completed.
  describe('the court record of a verdict appeal', () => {
    const theCase = { id: caseId, type: CaseType.INDICTMENT } as Case
    const assistantId = uuid()
    const otherAssistantId = uuid()
    const judgeIds = [uuid(), uuid(), uuid()]
    const recorded = {
      id: appealCaseId,
      caseId,
      appealType: AppealCaseType.VERDICT,
      appealCaseNumber: '1/2024',
      appealAssistantId: assistantId,
      appealJudges: bench(judgeIds),
    }
    const changes: [string, UpdateAppealCaseDto][] = [
      ['a new case number', { appealCaseNumber: '2/2024' }],
      ['an empty case number', { appealCaseNumber: '' }],
      [
        'a null case number',
        { appealCaseNumber: null } as unknown as UpdateAppealCaseDto,
      ],
      ['a new assistant', { appealAssistantId: otherAssistantId }],
      [
        'a null assistant',
        { appealAssistantId: null } as unknown as UpdateAppealCaseDto,
      ],
      ['a new judge', { appealJudgeIds: [judgeIds[0], judgeIds[1], uuid()] }],
      [
        'a reordered bench',
        { appealJudgeIds: [judgeIds[1], judgeIds[0], judgeIds[2]] },
      ],
      ['an empty bench', { appealJudgeIds: [] }],
    ]

    beforeEach(() => {
      const mockFindById = mockUserService.findById as jest.Mock
      mockFindById.mockImplementation(async (id: string) => ({
        id,
        role:
          id === assistantId || id === otherAssistantId
            ? UserRole.COURT_OF_APPEALS_ASSISTANT
            : UserRole.COURT_OF_APPEALS_JUDGE,
      }))
    })

    it.each(changes)(
      'should store %s once the appeal is confirmed',
      async (_, update) => {
        const then = await givenWhenThen(
          theCase,
          {
            ...recorded,
            appealState: AppealCaseState.READY_TO_COMPLETE,
          } as AppealCase,
          update,
        )

        expect(then.error).toBeUndefined()
      },
    )

    it.each(changes)(
      'should refuse %s once the appeal is completed',
      async (_, update) => {
        const then = await givenWhenThen(
          theCase,
          { ...recorded, appealState: AppealCaseState.COMPLETED } as AppealCase,
          update,
        )

        expect(then.error).toBeInstanceOf(ForbiddenException)
        expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
        expect(
          mockAppealCaseJudgeRepositoryService.replaceForAppealCase,
        ).not.toHaveBeenCalled()
        expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
      },
    )

    // A form that saves every field it shows sends the record back as it is,
    // and a null bench is not sent at all.
    it.each([
      ['the case number', { appealCaseNumber: '1/2024' }],
      ['the assistant', { appealAssistantId: assistantId }],
      ['the bench', { appealJudgeIds: [...judgeIds] }],
      [
        'a null bench',
        { appealJudgeIds: null } as unknown as UpdateAppealCaseDto,
      ],
    ])(
      'should accept %s re-sent unchanged once the appeal is completed',
      async (_, update) => {
        const then = await givenWhenThen(
          theCase,
          { ...recorded, appealState: AppealCaseState.COMPLETED } as AppealCase,
          update,
        )

        expect(then.error).toBeUndefined()
        expect(
          mockAppealCaseJudgeRepositoryService.replaceForAppealCase,
        ).not.toHaveBeenCalled()
        expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
      },
    )

    it.each(changes)(
      'should store %s on a completed ruling appeal',
      async (_, update) => {
        const then = await givenWhenThen(
          { id: caseId, type: CaseType.CUSTODY } as Case,
          {
            ...recorded,
            appealType: AppealCaseType.RULING,
            appealState: AppealCaseState.COMPLETED,
          } as AppealCase,
          update,
        )

        expect(then.error).toBeUndefined()
      },
    )
  })

  describe('date of conclusion', () => {
    const theCase = { id: caseId, type: CaseType.INDICTMENT } as Case
    const enteredDate = new Date('2024-01-10T00:00:00Z')

    it('should store the date on a verdict appeal and leave its ruling document alone before it is confirmed', async () => {
      const appealCase = {
        id: appealCaseId,
        caseId,
        appealType: AppealCaseType.VERDICT,
        appealState: AppealCaseState.APPEALED,
      } as AppealCase

      const then = await givenWhenThen(theCase, appealCase, {
        appealRulingDate: enteredDate,
      })

      expect(then.error).toBeUndefined()
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        { appealRulingDate: enteredDate },
        { transaction },
      )
      expect(
        mockFileService.invalidateVerdictAppealRulingConfirmation,
      ).not.toHaveBeenCalled()
    })

    // The confirmed copy of the ruling document is stamped with this date.
    it.each([AppealCaseState.READY_TO_COMPLETE])(
      'should have the ruling document stamped again when the date of a %s verdict appeal changes',
      async (appealState) => {
        const appealCase = {
          id: appealCaseId,
          caseId,
          appealType: AppealCaseType.VERDICT,
          appealState,
          appealRulingDate: new Date('2024-01-05T00:00:00Z'),
        } as AppealCase

        const then = await givenWhenThen(theCase, appealCase, {
          appealRulingDate: enteredDate,
        })

        expect(then.error).toBeUndefined()
        expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
          appealCaseId,
          { appealRulingDate: enteredDate },
          { transaction },
        )
        expect(
          mockFileService.invalidateVerdictAppealRulingConfirmation,
        ).toHaveBeenCalledWith(caseId, transaction)
      },
    )

    it.each([AppealCaseState.READY_TO_COMPLETE, AppealCaseState.COMPLETED])(
      'should leave the ruling document alone when a %s verdict appeal is sent the date it has',
      async (appealState) => {
        const appealCase = {
          id: appealCaseId,
          caseId,
          appealType: AppealCaseType.VERDICT,
          appealState,
          appealRulingDate: new Date(enteredDate),
        } as AppealCase

        const then = await givenWhenThen(theCase, appealCase, {
          appealRulingDate: enteredDate,
        })

        expect(then.error).toBeUndefined()
        expect(
          mockFileService.invalidateVerdictAppealRulingConfirmation,
        ).not.toHaveBeenCalled()
      },
    )

    it.each([
      ['a verdict appeal', AppealCaseType.VERDICT, AppealCaseState.COMPLETED],
      ['a ruling appeal', AppealCaseType.RULING, AppealCaseState.COMPLETED],
    ])(
      'should refuse to clear the date on %s',
      async (_, appealType, appealState) => {
        const appealCase = {
          id: appealCaseId,
          caseId,
          appealType,
          appealState,
          appealRulingDate: new Date('2024-01-05T00:00:00Z'),
        } as AppealCase

        const then = await givenWhenThen(theCase, appealCase, {
          appealRulingDate: null,
        } as unknown as UpdateAppealCaseDto)

        expect(then.error).toBeInstanceOf(BadRequestException)
        expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
        expect(
          mockFileService.invalidateVerdictAppealRulingConfirmation,
        ).not.toHaveBeenCalled()
      },
    )

    // A ruling appeal is dated when it is completed.
    it('should refuse the date on a ruling appeal', async () => {
      const appealCase = {
        id: appealCaseId,
        caseId,
        appealType: AppealCaseType.RULING,
        appealState: AppealCaseState.RECEIVED,
      } as AppealCase

      const then = await givenWhenThen(
        { id: caseId, type: CaseType.CUSTODY } as Case,
        appealCase,
        { appealRulingDate: enteredDate },
      )

      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
      expect(
        mockFileService.invalidateVerdictAppealRulingConfirmation,
      ).not.toHaveBeenCalled()
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

  describe('the bench is sent as null', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const appealCase = {
      id: appealCaseId,
      caseId,
      appealCaseNumber: 'LANDSRÉTTUR 1/2024',
      appealAssistantId: uuid(),
      appealJudges: bench([uuid(), uuid(), uuid()]),
    } as AppealCase
    const update = { appealJudgeIds: null } as unknown as UpdateAppealCaseDto
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, appealCase, update)
    })

    it('should keep the bench and queue nothing', () => {
      expect(
        mockAppealCaseJudgeRepositoryService.replaceForAppealCase,
      ).not.toHaveBeenCalled()
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
