import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { MessageType } from '@island.is/judicial-system/message'
import {
  AppealCaseNotificationType,
  AppealCaseState,
  AppealCaseTransition,
  CaseType,
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
import { EventService } from '../../../event'
import {
  AppealCase,
  AppealCaseRepositoryService,
  Case,
} from '../../../repository'
import { TransitionAppealCaseDto } from '../../dto/transitionAppealCase.dto'

jest.mock('../../../../middleware/queueMessagesAfterCommit')
jest.mock('../../../../factories')

interface Then {
  result: AppealCase
  error: Error
}

type GivenWhenThen = (
  theCase: Case,
  appealCase: AppealCase,
  transition: AppealCaseTransition,
) => Promise<Then>

describe('LimitedAccessAppealCaseController - Transition', () => {
  const caseId = uuid()
  const appealCaseId = uuid()

  const defender = {
    id: uuid(),
    role: UserRole.DEFENDER,
    nationalId: '1111111111',
  } as User

  const now = new Date('2024-01-15T10:00:00Z')

  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let mockEventService: EventService
  let mockSequelize: Sequelize
  let transaction: Transaction
  let transactionContext: TransactionContext | undefined
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.clearAllMocks()

    const {
      limitedAccessAppealCaseController,
      appealCaseRepositoryService,
      eventService,
      sequelize,
    } = await createTestingAppealCaseModule()

    mockAppealCaseRepositoryService = appealCaseRepositoryService
    mockEventService = eventService

    const mockNowFactory = nowFactory as jest.Mock
    mockNowFactory.mockReturnValue(now)

    mockSequelize = sequelize
    transactionContext = undefined

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    givenWhenThen = async (theCase, appealCase, transition) => {
      const then = {} as Then

      const dto: TransitionAppealCaseDto = { transition }

      const updatedAppealCase = { ...appealCase } as AppealCase
      const mockUpdate = mockAppealCaseRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedAppealCase)

      // The route is guarded by LimitedAccessCaseExistsForUpdateGuard, so the
      // request transaction is already open - and holding a lock on this case
      // row - by the time the handler runs. Guards do not execute in
      // controller unit tests, so the request context and that transaction
      // are set up here instead.
      try {
        await runInRequestContext(async () => {
          transactionContext = getTransactionContext()

          await getOrCreateTransaction(mockSequelize)

          then.result = await limitedAccessAppealCaseController.transition(
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

  describe('defence user withdraws an appeal', () => {
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const appealCase = {
      id: appealCaseId,
      appealState: AppealCaseState.APPEALED,
    } as AppealCase
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        theCase,
        appealCase,
        AppealCaseTransition.WITHDRAW_APPEAL,
      )
    })

    it('should move the appeal case to withdrawn in the transaction the guard opened, without opening another', () => {
      // Once, by the stand-in for LimitedAccessCaseExistsForUpdateGuard above.
      // A second call would be the handler opening a transaction of its own,
      // which would block on the guard's row lock and deadlock the request.
      expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        expect.objectContaining({ appealState: AppealCaseState.WITHDRAWN }),
        { transaction },
      )
      expect(then.result).toEqual(
        expect.objectContaining({ appealState: AppealCaseState.APPEALED }),
      )
    })

    it('should queue the appeal withdrawn notification', () => {
      expect(queueMessagesAfterCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          caseId,
          body: { type: AppealCaseNotificationType.APPEAL_WITHDRAWN },
        }),
      )
    })

    it('should register the transition event rather than posting it inline', () => {
      expect(mockEventService.postEvent).not.toHaveBeenCalled()
      expect(transactionContext?.afterCommit).toHaveLength(1)
    })

    it('should post the transition event once the transaction has committed', async () => {
      await Promise.all(
        (transactionContext?.afterCommit ?? []).map((callback) => callback()),
      )

      expect(mockEventService.postEvent).toHaveBeenCalledWith(
        AppealCaseTransition.WITHDRAW_APPEAL,
        theCase,
      )
    })
  })

  describe('ruling-order appeals queue case notifications', () => {
    const theCase = { id: caseId, type: CaseType.INDICTMENT } as Case
    const appealCase = {
      id: appealCaseId,
      appealState: AppealCaseState.APPEALED,
      rulingFileId: uuid(),
    } as AppealCase

    beforeEach(async () => {
      await givenWhenThen(
        theCase,
        appealCase,
        AppealCaseTransition.WITHDRAW_APPEAL,
      )
    })

    it('should still transition the appeal case', () => {
      expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
        appealCaseId,
        expect.objectContaining({ appealState: AppealCaseState.WITHDRAWN }),
        { transaction },
      )
    })

    it('should queue the withdrawn notification for the ruling-order appeal', () => {
      expect(queueMessagesAfterCommit).toHaveBeenCalledWith(
        expect.objectContaining({
          type: MessageType.APPEAL_CASE_NOTIFICATION,
          caseId,
          elementId: appealCaseId,
          body: { type: AppealCaseNotificationType.APPEAL_WITHDRAWN },
        }),
      )
    })
  })
})
