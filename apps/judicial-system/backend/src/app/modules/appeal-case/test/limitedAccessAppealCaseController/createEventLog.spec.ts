import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { MessageType } from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealCaseState,
  AppealCaseType,
  AppealEventType,
  CaseFileCategory,
  CaseFileState,
  CaseType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingAppealCaseModule } from '../createTestingAppealCaseModule'

import {
  getOrCreateTransaction,
  getTransactionContext,
  queueMessagesAfterCommit,
  TransactionContext,
} from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import {
  AppealCase,
  AppealEventLogRepositoryService,
  Case,
} from '../../../repository'
import { CreateAppealEventLogDto } from '../../dto/createAppealEventLog.dto'

jest.mock('../../../../middleware/queueMessagesAfterCommit')

interface Then {
  result: AppealCase
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  dto?: CreateAppealEventLogDto,
  targetAppealCase?: AppealCase,
) => Promise<Then>

describe('LimitedAccessAppealCaseController - Create event log', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const defenderNationalId = '0101302129'

  const appealCase = {
    id: appealCaseId,
    caseId,
    appealType: AppealCaseType.RULING,
  } as AppealCase
  const openStatementDeadline = new Date()
  openStatementDeadline.setDate(openStatementDeadline.getDate() + 14)
  const verdictAppealCase = {
    id: appealCaseId,
    caseId,
    appealType: AppealCaseType.VERDICT,
    statementDeadlines: [
      {
        id: uuid(),
        defendantId,
        deadline: openStatementDeadline,
      },
    ],
  } as AppealCase

  const defender = {
    id: uuid(),
    role: UserRole.DEFENDER,
    nationalId: defenderNationalId,
  } as User

  let mockAppealEventLogRepositoryService: AppealEventLogRepositoryService
  let mockSequelize: Sequelize
  let transaction: Transaction
  let transactionContext: TransactionContext | undefined
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const {
      limitedAccessAppealCaseController,
      appealEventLogRepositoryService,
      sequelize,
    } = await createTestingAppealCaseModule()

    mockAppealEventLogRepositoryService = appealEventLogRepositoryService

    mockSequelize = sequelize
    transactionContext = undefined

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    givenWhenThen = async (theCase, dto, targetAppealCase = appealCase) => {
      const then = {} as Then

      const body: CreateAppealEventLogDto = dto ?? {
        eventType: AppealEventType.APPEAL_STATEMENT_SENT,
      }

      // The route is guarded by LimitedAccessCaseExistsForUpdateGuard, so the
      // request transaction is already open - and holding a lock on this case
      // row - by the time the handler runs. Guards do not execute in
      // controller unit tests, so the request context and that transaction
      // are set up here instead.
      try {
        await runInRequestContext(async () => {
          transactionContext = getTransactionContext()

          await getOrCreateTransaction(mockSequelize)

          then.result = await limitedAccessAppealCaseController.createEventLog(
            caseId,
            appealCaseId,
            defender,
            theCase,
            targetAppealCase,
            body,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('confirmed defender sends an appeal statement on an indictment case', () => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [
        {
          id: defendantId,
          isDefenderChoiceConfirmed: true,
          defenderNationalId,
        },
      ],
    } as unknown as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase)
    })

    it('should tie the event log to the represented defendant, in the transaction the guard opened, without opening another', () => {
      // Once, by the stand-in for LimitedAccessCaseExistsForUpdateGuard above.
      // A second call would be the handler opening a transaction of its own,
      // which would block on the guard's row lock and deadlock the request.
      expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        {
          caseId,
          appealCaseId,
          eventType: AppealEventType.APPEAL_STATEMENT_SENT,
          userRole: UserRole.DEFENDER,
          defendantId,
          nationalId: defender.nationalId,
          userName: defender.name,
          userTitle: defender.title,
          institutionName: defender.institution?.name,
        },
        { transaction },
      )
    })

    it('should queue the appeal statement notification', () => {
      expect(queueMessagesAfterCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          caseId,
          body: { type: AppealCaseNotificationType.APPEAL_STATEMENT },
        }),
      )
    })

    it('should return the appeal case', () => {
      expect(then.result).toBe(appealCase)
    })

    // An event log announces nothing, so nothing waits for the commit.
    it('should register nothing to run after the commit', () => {
      expect(transactionContext?.afterCommit).toHaveLength(0)
    })
  })

  describe('appeal-confirmed defender sends a verdict-appeal statement for one of several parties', () => {
    const otherDefendantId = uuid()
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [
        {
          id: defendantId,
          isAppealDefenderConfirmed: true,
          appealDefenderNationalId: defenderNationalId,
        },
        {
          id: otherDefendantId,
          isAppealDefenderConfirmed: true,
          appealDefenderNationalId: defenderNationalId,
        },
      ],
      caseFiles: [
        {
          id: uuid(),
          category: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
          state: CaseFileState.STORED_IN_RVG,
          isKeyAccessible: true,
          defendantId,
        },
      ],
    } as unknown as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        theCase,
        {
          eventType: AppealEventType.APPEAL_STATEMENT_SENT,
          defendantId,
        },
        verdictAppealCase,
      )
    })

    it('should tie the event log only to the named defendant', () => {
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledTimes(
        1,
      )
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        {
          caseId,
          appealCaseId,
          eventType: AppealEventType.APPEAL_STATEMENT_SENT,
          userRole: UserRole.DEFENDER,
          defendantId,
          nationalId: defender.nationalId,
          userName: defender.name,
          userTitle: defender.title,
          institutionName: defender.institution?.name,
        },
        { transaction },
      )
      expect(then.error).toBeUndefined()
    })
  })

  describe('appeal-confirmed defender sends a verdict-appeal statement without a statement file', () => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [
        {
          id: defendantId,
          isAppealDefenderConfirmed: true,
          appealDefenderNationalId: defenderNationalId,
        },
      ],
      caseFiles: [],
    } as unknown as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        theCase,
        {
          eventType: AppealEventType.APPEAL_STATEMENT_SENT,
          defendantId,
        },
        verdictAppealCase,
      )
    })

    it('should reject the request', () => {
      expect(then.error).toBeDefined()
      expect(then.error.message).toBe(
        `No verdict appeal statement file for the party on appeal case ${appealCaseId} of case ${caseId}`,
      )
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
    })
  })

  describe('verdict appeal statement without a party id', () => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [
        {
          id: defendantId,
          isAppealDefenderConfirmed: true,
          appealDefenderNationalId: defenderNationalId,
        },
      ],
    } as unknown as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        theCase,
        { eventType: AppealEventType.APPEAL_STATEMENT_SENT },
        verdictAppealCase,
      )
    })

    it('should reject the request', () => {
      expect(then.error).toBeDefined()
      expect(then.error.message).toBe(
        'Verdict appeal statement events require defendantId or civilClaimantId',
      )
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
    })
  })

  describe('district-only confirmed defender sends a verdict-appeal statement', () => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [
        {
          id: defendantId,
          isDefenderChoiceConfirmed: true,
          defenderNationalId: defenderNationalId,
        },
      ],
    } as unknown as Case
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        theCase,
        {
          eventType: AppealEventType.APPEAL_STATEMENT_SENT,
          defendantId,
        },
        verdictAppealCase,
      )
    })

    it('should forbid the request', () => {
      expect(then.error).toBeDefined()
      expect(then.error.message).toBe(
        `Current user is not a confirmed appeal defender of defendant ${defendantId}`,
      )
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
    })
  })

  describe('appeal-confirmed defender sends a statement after the deadline', () => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [
        {
          id: defendantId,
          isAppealDefenderConfirmed: true,
          appealDefenderNationalId: defenderNationalId,
        },
      ],
    } as unknown as Case
    const expiredDeadline = new Date()
    expiredDeadline.setDate(expiredDeadline.getDate() - 2)
    const expiredAppealCase = {
      ...verdictAppealCase,
      statementDeadlines: [
        {
          id: uuid(),
          defendantId,
          deadline: expiredDeadline,
        },
      ],
    } as AppealCase
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        theCase,
        {
          eventType: AppealEventType.APPEAL_STATEMENT_SENT,
          defendantId,
        },
        expiredAppealCase,
      )
    })

    it('should reject the request', () => {
      expect(then.error).toBeDefined()
      expect(then.error.message).toBe(
        `The statement deadline for the party on appeal case ${appealCaseId} of case ${caseId} has expired`,
      )
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
    })
  })

  describe('appeal-confirmed defender sends a statement on a completed verdict appeal', () => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [
        {
          id: defendantId,
          isAppealDefenderConfirmed: true,
          appealDefenderNationalId: defenderNationalId,
        },
      ],
    } as unknown as Case
    const completedAppealCase = {
      ...verdictAppealCase,
      appealState: AppealCaseState.COMPLETED,
    } as AppealCase
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        theCase,
        {
          eventType: AppealEventType.APPEAL_STATEMENT_SENT,
          defendantId,
        },
        completedAppealCase,
      )
    })

    it('should reject the request', () => {
      expect(then.error).toBeDefined()
      expect(then.error.message).toBe(
        `Cannot record a statement for completed or withdrawn appeal case ${appealCaseId} of case ${caseId}`,
      )
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
    })
  })

  describe('appeal-confirmed defender sends a verdict-appeal statement already filed', () => {
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
      defendants: [
        {
          id: defendantId,
          isAppealDefenderConfirmed: true,
          appealDefenderNationalId: defenderNationalId,
        },
      ],
    } as unknown as Case
    const alreadyFiledAppealCase = {
      ...verdictAppealCase,
      appealEventLogs: [
        {
          id: uuid(),
          eventType: AppealEventType.APPEAL_STATEMENT_SENT,
          defendantId,
        },
      ],
    } as AppealCase
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        theCase,
        {
          eventType: AppealEventType.APPEAL_STATEMENT_SENT,
          defendantId,
        },
        alreadyFiledAppealCase,
      )
    })

    it('should reject a duplicate filing', () => {
      expect(then.error).toBeDefined()
      expect(then.error.message).toBe(
        `The party has already filed its statement in appeal case ${appealCaseId} of case ${caseId}`,
      )
      expect(mockAppealEventLogRepositoryService.create).not.toHaveBeenCalled()
    })
  })

  describe('defender sends an appeal statement on a non-indictment case', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case

    beforeEach(async () => {
      await givenWhenThen(theCase)
    })

    it('should not resolve any defence party for the event log', () => {
      expect(mockAppealEventLogRepositoryService.create).toHaveBeenCalledWith(
        {
          caseId,
          appealCaseId,
          eventType: AppealEventType.APPEAL_STATEMENT_SENT,
          userRole: UserRole.DEFENDER,
          nationalId: defender.nationalId,
          userName: defender.name,
          userTitle: defender.title,
          institutionName: defender.institution?.name,
        },
        { transaction },
      )
    })
  })
})
