import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { MessageType } from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealEventType,
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

type GivenWhenThen = (theCase: Case) => Promise<Then>

describe('LimitedAccessAppealCaseController - Create event log', () => {
  const caseId = uuid()
  const appealCaseId = uuid()
  const defendantId = uuid()
  const defenderNationalId = '0101302129'

  const appealCase = { id: appealCaseId, caseId } as AppealCase

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

    givenWhenThen = async (theCase) => {
      const then = {} as Then

      const dto: CreateAppealEventLogDto = {
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
            appealCase,
            dto,
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
