import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'

import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCaseType,
  AppealEventType,
  AppealRulingType,
  CaseFileCategory,
  CaseFileState,
  CaseType,
  InstitutionType,
  User,
  UserRole,
  VerdictAppealStatus,
} from '@island.is/judicial-system/types'

import { createTestingAppealCaseModule } from '../createTestingAppealCaseModule'

import { nowFactory } from '../../../../factories'
import {
  getTransactionContext,
  queueMessagesAfterCommit,
  TransactionContext,
} from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import { EventService } from '../../../event'
import {
  AppealCase,
  AppealCaseRepositoryService,
  AppealEventLogRepositoryService,
  Case,
  CaseRepositoryService,
} from '../../../repository'

jest.mock('../../../../middleware/queueMessagesAfterCommit')
jest.mock('../../../../factories')

interface Then {
  result: AppealCase[]
  error: Error
}

type GivenWhenThen = (
  appealCaseIds: string[],
  actingUser?: User,
) => Promise<Then>

// A confirmed verdict appeal with everything on record, on a case the court
// of appeals can open.
const confirmedVerdictAppeal = (
  appealCase: Partial<AppealCase> = {},
  theCase: Partial<Case> = {},
): { theCase: Case; appealCase: AppealCase } => {
  const caseId = uuid()
  const verdictAppealCase = {
    id: uuid(),
    caseId,
    appealType: AppealCaseType.VERDICT,
    appealState: AppealCaseState.READY_TO_COMPLETE,
    appealCaseNumber: '1/2024',
    sentAppealSummonses: [{ id: uuid() }],
    verdictAppealStatus: VerdictAppealStatus.COMPLETED,
    appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
    appealRulingType: AppealRulingType.VERDICT,
    appealConclusion: 'The appealed judgment stands.',
    appealRulingDate: new Date('2024-01-10T00:00:00Z'),
    ...appealCase,
  } as AppealCase

  return {
    appealCase: verdictAppealCase,
    theCase: {
      id: caseId,
      type: CaseType.INDICTMENT,
      caseFiles: [
        {
          id: uuid(),
          key: `${caseId}/${uuid()}/domur.pdf`,
          type: 'application/pdf',
          category: CaseFileCategory.VERDICT_APPEAL_RULING,
          state: CaseFileState.STORED_IN_RVG,
          isKeyAccessible: true,
        },
      ],
      verdictAppealCase,
      ...theCase,
    } as unknown as Case,
  }
}

describe('AppealCaseController - Complete verdict appeals', () => {
  const user = {
    id: uuid(),
    role: UserRole.COURT_OF_APPEALS_REGISTRAR,
    nationalId: '0000000000',
    name: 'Test Ritari',
    title: 'aðstoðarmaður dómara',
    institution: { type: InstitutionType.COURT_OF_APPEALS },
  } as User

  const now = new Date('2024-01-15T10:00:00Z')

  let appeals: { theCase: Case; appealCase: AppealCase }[]
  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let mockCaseRepositoryService: CaseRepositoryService
  let mockEventService: EventService
  let mockSequelize: Sequelize
  let transaction: Transaction
  let transactionContext: TransactionContext | undefined
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const {
      appealCaseController,
      appealCaseRepositoryService,
      appealEventLogRepositoryService,
      caseRepositoryService,
      eventService,
      sequelize,
    } = await createTestingAppealCaseModule()

    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockAppealEventLogRepositoryService = appealEventLogRepositoryService
    mockCaseRepositoryService = caseRepositoryService
    mockEventService = eventService

    const mockNowFactory = nowFactory as jest.Mock
    mockNowFactory.mockReturnValue(now)

    mockSequelize = sequelize
    transactionContext = undefined
    appeals = []

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    // The repositories answer from the appeals a test sets up.
    const mockFindByIds = mockAppealCaseRepositoryService.findByIds as jest.Mock
    mockFindByIds.mockImplementation(async (ids: string[]) =>
      appeals
        .map(({ appealCase }) => appealCase)
        .filter((appealCase) => ids.includes(appealCase.id))
        .sort((a, b) => a.id.localeCompare(b.id)),
    )

    const mockLockByIdForUpdate =
      mockCaseRepositoryService.lockByIdForUpdate as jest.Mock
    mockLockByIdForUpdate.mockResolvedValue(true)

    const mockFindLiveById = mockCaseRepositoryService.findLiveById as jest.Mock
    mockFindLiveById.mockImplementation(
      async (caseId: string) =>
        appeals.find(({ theCase }) => theCase.id === caseId)?.theCase ?? null,
    )

    const mockUpdate = mockAppealCaseRepositoryService.update as jest.Mock
    mockUpdate.mockImplementation(async (id: string, data: object) => ({
      ...appeals.find(({ appealCase }) => appealCase.id === id)?.appealCase,
      ...data,
    }))

    givenWhenThen = async (appealCaseIds, actingUser = user) => {
      const then = {} as Then

      try {
        await runInRequestContext(async () => {
          transactionContext = getTransactionContext()

          then.result = await appealCaseController.completeVerdictAppeals(
            actingUser,
            { appealCaseIds },
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  const expectNothingWritten = () => {
    expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
    expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
    expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
    expect(transactionContext?.afterCommit ?? []).toHaveLength(0)
  }

  describe('several confirmed verdict appeals', () => {
    let then: Then

    beforeEach(async () => {
      appeals = [
        confirmedVerdictAppeal(),
        confirmedVerdictAppeal(),
        confirmedVerdictAppeal(),
      ]

      then = await givenWhenThen(appeals.map(({ appealCase }) => appealCase.id))
    })

    it('should open one transaction for the whole request', () => {
      expect(then.error).toBeUndefined()
      expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
    })

    // Case rows before appeal rows, each in id order, as the single route
    // takes them.
    it('should lock every case and then every appeal, in id order', () => {
      const caseIds = appeals.map(({ theCase }) => theCase.id).sort()
      const appealCaseIds = appeals
        .map(({ appealCase }) => appealCase.id)
        .sort()

      expect(
        (mockCaseRepositoryService.lockByIdForUpdate as jest.Mock).mock.calls,
      ).toEqual(caseIds.map((caseId) => [caseId, transaction]))
      expect(mockAppealCaseRepositoryService.findByIds).toHaveBeenCalledWith(
        appealCaseIds,
        { transaction, forUpdate: true },
      )

      const lastCaseLock = Math.max(
        ...(mockCaseRepositoryService.lockByIdForUpdate as jest.Mock).mock
          .invocationCallOrder,
      )
      const appealLock = (
        mockAppealCaseRepositoryService.findByIds as jest.Mock
      ).mock.invocationCallOrder[1]
      const firstCaseRead = Math.min(
        ...(mockCaseRepositoryService.findLiveById as jest.Mock).mock
          .invocationCallOrder,
      )

      expect(lastCaseLock).toBeLessThan(appealLock)
      expect(appealLock).toBeLessThan(firstCaseRead)
    })

    it('should complete each appeal through the state machine, dating the release and keeping the date the court entered', () => {
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledTimes(3)

      for (const { appealCase } of appeals) {
        expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
          appealCase.id,
          { appealState: AppealCaseState.COMPLETED, appealCompletedDate: now },
          { transaction },
        )
      }
    })

    it('should record one release event per appeal, with the court user as its actor', () => {
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledTimes(
        3,
      )

      for (const { theCase, appealCase } of appeals) {
        expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
          {
            caseId: theCase.id,
            appealCaseId: appealCase.id,
            eventType: AppealEventType.APPEAL_COMPLETED,
            appealOrigin: undefined,
            userRole: user.role,
            userId: user.id,
            nationalId: user.nationalId,
            userName: user.name,
            userTitle: user.title,
            institutionName: undefined,
          },
          { transaction },
        )
      }
    })

    it('should return the completed appeals', () => {
      expect(then.result).toHaveLength(3)
      expect(then.result.map((appealCase) => appealCase.appealState)).toEqual([
        AppealCaseState.COMPLETED,
        AppealCaseState.COMPLETED,
        AppealCaseState.COMPLETED,
      ])
      expect(
        then.result.map((appealCase) => appealCase.appealRulingDate),
      ).toEqual(appeals.map(({ appealCase }) => appealCase.appealRulingDate))
    })

    it('should queue nothing and deliver nothing', () => {
      expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
    })

    // Each is an áfrýjun, announced as the per-appeal route announces it.
    it('should announce each completion of a verdict appeal once the transaction has committed', async () => {
      expect(mockEventService.postEvent).not.toHaveBeenCalled()
      expect(transactionContext?.afterCommit).toHaveLength(3)

      await Promise.all(
        (transactionContext?.afterCommit ?? []).map((callback) => callback()),
      )

      expect(mockEventService.postEvent).toHaveBeenCalledTimes(3)

      for (const { theCase } of appeals) {
        expect(mockEventService.postEvent).toHaveBeenCalledWith(
          'COMPLETE_VERDICT_APPEAL',
          theCase,
        )
      }
    })
  })

  // One appeal that cannot be completed refuses the whole request. Each is
  // put last, after appeals that would have been completed.
  describe.each([
    [
      'a ruling appeal',
      () =>
        confirmedVerdictAppeal({
          appealType: AppealCaseType.RULING,
          appealState: AppealCaseState.RECEIVED,
        }),
      BadRequestException,
    ],
    [
      'an appeal that is not confirmed',
      () => confirmedVerdictAppeal({ appealState: AppealCaseState.APPEALED }),
      ForbiddenException,
    ],
    [
      'an appeal that is already completed',
      () => confirmedVerdictAppeal({ appealState: AppealCaseState.COMPLETED }),
      ForbiddenException,
    ],
    [
      'an appeal with an incomplete record',
      () => confirmedVerdictAppeal({ appealConclusion: ' ' }),
      BadRequestException,
    ],
    [
      'an appeal without its ruling document',
      () => confirmedVerdictAppeal({}, { caseFiles: [] }),
      BadRequestException,
    ],
  ])('with %s', (_, refused, errorType) => {
    let then: Then

    beforeEach(async () => {
      appeals = [confirmedVerdictAppeal(), confirmedVerdictAppeal(), refused()]

      // The refused appeal is completed last whatever its id.
      const refusedAppeal = appeals[2]
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockImplementation(
        async (caseId: string) =>
          appeals.find(({ theCase }) => theCase.id === caseId)?.theCase ?? null,
      )
      const mockFindByIds =
        mockAppealCaseRepositoryService.findByIds as jest.Mock
      mockFindByIds.mockImplementation(async (ids: string[]) => [
        ...appeals
          .slice(0, 2)
          .map(({ appealCase }) => appealCase)
          .filter((appealCase) => ids.includes(appealCase.id)),
        ...(ids.includes(refusedAppeal.appealCase.id)
          ? [refusedAppeal.appealCase]
          : []),
      ])

      then = await givenWhenThen(appeals.map(({ appealCase }) => appealCase.id))
    })

    it('should refuse the whole request', () => {
      expect(then.error).toBeInstanceOf(errorType)
    })

    // Appeals completed before the refusal are written in the transaction,
    // which the refusal rolls back; nothing is announced or queued.
    it('should announce nothing and queue nothing', () => {
      expect(queueMessagesAfterCommit).not.toHaveBeenCalled()
      expect(transactionContext?.afterCommit ?? []).toHaveLength(0)
      expect(mockEventService.postEvent).not.toHaveBeenCalled()
    })

    it('should not complete the refused appeal', () => {
      expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalledWith(
        appeals[2].appealCase.id,
        expect.anything(),
        expect.anything(),
      )
    })
  })

  describe('with an appeal that does not exist', () => {
    let then: Then
    const missingId = uuid()

    beforeEach(async () => {
      appeals = [confirmedVerdictAppeal(), confirmedVerdictAppeal()]

      then = await givenWhenThen([
        ...appeals.map(({ appealCase }) => appealCase.id),
        missingId,
      ])
    })

    it('should refuse the whole request, naming the missing appeal', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toContain(missingId)
    })

    it('should lock nothing and write nothing', () => {
      expect(mockCaseRepositoryService.lockByIdForUpdate).not.toHaveBeenCalled()
      expectNothingWritten()
    })
  })

  describe('with a ruling appeal', () => {
    let then: Then

    beforeEach(async () => {
      appeals = [
        confirmedVerdictAppeal(),
        confirmedVerdictAppeal({ appealType: AppealCaseType.RULING }),
      ]

      then = await givenWhenThen(appeals.map(({ appealCase }) => appealCase.id))
    })

    it('should refuse the whole request, naming the ruling appeal', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toContain(appeals[1].appealCase.id)
    })

    it('should lock nothing and write nothing', () => {
      expect(mockCaseRepositoryService.lockByIdForUpdate).not.toHaveBeenCalled()
      expectNothingWritten()
    })
  })

  describe('with an appeal on a case that is no longer live', () => {
    let then: Then

    beforeEach(async () => {
      appeals = [confirmedVerdictAppeal(), confirmedVerdictAppeal()]

      const gone = appeals[1].theCase.id
      const mockFindLiveById =
        mockCaseRepositoryService.findLiveById as jest.Mock
      mockFindLiveById.mockImplementation(async (caseId: string) =>
        caseId === gone
          ? null
          : appeals.find(({ theCase }) => theCase.id === caseId)?.theCase,
      )

      then = await givenWhenThen(appeals.map(({ appealCase }) => appealCase.id))
    })

    it('should refuse the whole request and write nothing', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expectNothingWritten()
    })
  })

  // The court of appeals opens a verdict appeal once a summons has been sent
  // to it; until then the case is not the court's to write.
  describe('with an appeal on a case the user cannot write', () => {
    let then: Then

    beforeEach(async () => {
      appeals = [
        confirmedVerdictAppeal(),
        confirmedVerdictAppeal({ sentAppealSummonses: [] }),
      ]

      then = await givenWhenThen(appeals.map(({ appealCase }) => appealCase.id))
    })

    it('should refuse the whole request before completing anything', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expect(then.error.message).toContain('write access')
      expect(then.error.message).toContain(appeals[1].appealCase.id)
      expectNothingWritten()
    })
  })

  // A court of appeals role at another institution passes the roles guard but
  // not the access check on the case.
  describe('requested by a user outside the court of appeals', () => {
    let then: Then

    beforeEach(async () => {
      appeals = [confirmedVerdictAppeal()]

      then = await givenWhenThen([appeals[0].appealCase.id], {
        ...user,
        role: UserRole.COURT_OF_APPEALS_JUDGE,
        institution: { type: InstitutionType.DISTRICT_COURT },
      } as User)
    })

    it('should be refused on the case and write nothing', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
      expectNothingWritten()
    })
  })
})
