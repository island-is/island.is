import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { MessageType } from '@island.is/judicial-system/message'
import { ServiceRequirement, User } from '@island.is/judicial-system/types'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import {
  getOrCreateTransaction,
  queueMessagesAfterCommit,
} from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import { Case, Defendant, Verdict } from '../../../repository'

interface Then {
  result: { queued: boolean }
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('VerdictController - Deliver case verdict', () => {
  const user = { id: uuid() } as User
  const caseId = uuid()
  const defendantId = uuid()
  const theCase = {
    id: caseId,
    defendants: [
      {
        id: defendantId,
        caseId,
        verdicts: [
          {
            id: uuid(),
            caseId,
            defendantId,
            serviceRequirement: ServiceRequirement.REQUIRED,
          } as Verdict,
        ],
      } as Defendant,
    ],
  } as Case

  let mockSequelize: Sequelize
  let mockQueueMessagesAfterCommit: jest.Mock
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.resetAllMocks()

    const { verdictController, sequelize } = await createTestingVerdictModule()

    mockSequelize = sequelize
    mockQueueMessagesAfterCommit = queueMessagesAfterCommit as jest.Mock

    const mockTransaction = sequelize.transaction as jest.Mock
    mockTransaction.mockResolvedValue({} as Transaction)

    givenWhenThen = async () => {
      const then = {} as Then

      // The route is guarded by CaseExistsForUpdateGuard, so the request
      // transaction is already open - and holding a lock on this case row -
      // by the time the handler runs. Guards do not execute in controller
      // unit tests, so the request context and that transaction are set up
      // here instead.
      try {
        await runInRequestContext(async () => {
          await getOrCreateTransaction(mockSequelize)

          then.result = await verdictController.deliverCaseVerdict(
            caseId,
            user,
            theCase,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('verdict delivery queued', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should run in the transaction the guard opened, without opening another', () => {
      // Once, by the stand-in for CaseExistsForUpdateGuard above. A second
      // call would be the handler opening a transaction of its own, which
      // would block on the guard's row lock and deadlock the request.
      expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
      expect(then.result).toEqual({ queued: true })
    })

    it('should queue the delivery for after the commit', () => {
      expect(mockQueueMessagesAfterCommit).toHaveBeenCalledWith({
        type: MessageType.DELIVERY_TO_NATIONAL_COMMISSIONERS_OFFICE_VERDICT,
        user,
        caseId,
        elementId: [defendantId],
      })
    })
  })
})
