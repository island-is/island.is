import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { MessageType } from '@island.is/judicial-system/message'
import {
  ServiceStatus,
  SubpoenaNotificationType,
} from '@island.is/judicial-system/types'

import { createTestingSubpoenaModule } from '../createTestingSubpoenaModule'

import {
  Case,
  Defendant,
  Subpoena,
  SubpoenaRepositoryService,
} from '../../../repository'
import { UpdateSubpoenaDto } from '../../dto/updateSubpoena.dto'

interface Then {
  result: Subpoena
  error: Error
}

type GivenWhenThen = (update: UpdateSubpoenaDto) => Promise<Then>

describe('InternalSubpoenaController - Update subpoena', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const subpoenaId = uuid()
  const policeSubpoenaId = uuid()

  const theCase = { id: caseId, withCourtSessions: false } as Case
  const defendant = { id: defendantId } as Defendant
  const subpoena = {
    id: subpoenaId,
    caseId,
    defendantId,
    policeSubpoenaId,
    case: theCase,
    defendant,
  } as Subpoena
  const updatedSubpoena = { ...subpoena } as Subpoena

  let mockSubpoenaRepositoryService: SubpoenaRepositoryService
  let mockAddMessagesToQueueAfterCommit: jest.Mock
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      sequelize,
      subpoenaRepositoryService,
      internalSubpoenaController,
      mockAddMessagesToQueueAfterCommit: mockAddMessages,
    } = await createTestingSubpoenaModule()

    mockSubpoenaRepositoryService = subpoenaRepositoryService
    mockAddMessagesToQueueAfterCommit = mockAddMessages
    mockAddMessagesToQueueAfterCommit.mockClear()

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    const mockFindById = mockSubpoenaRepositoryService.findById as jest.Mock
    mockFindById.mockResolvedValueOnce(updatedSubpoena)

    givenWhenThen = async (update: UpdateSubpoenaDto) => {
      const then = {} as Then

      await internalSubpoenaController
        .updateSubpoena(policeSubpoenaId, subpoena, update)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('subpoena served', () => {
    const update = { serviceStatus: ServiceStatus.ELECTRONICALLY }

    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(update)
    })

    it('should queue the service notification against the transaction', () => {
      expect(mockSubpoenaRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId,
        subpoenaId,
        update,
        { transaction, throwOnZeroRows: false },
      )
      // Queued against the transaction, so a rollback sends nothing
      expect(mockAddMessagesToQueueAfterCommit).toHaveBeenCalledWith(
        transaction,
        {
          type: MessageType.SUBPOENA_NOTIFICATION,
          caseId,
          elementId: [defendantId, subpoenaId],
          body: { type: SubpoenaNotificationType.SERVICE_SUCCESSFUL },
        },
      )
      expect(then.result).toBe(updatedSubpoena)
    })
  })

  describe('service failed', () => {
    beforeEach(async () => {
      await givenWhenThen({ serviceStatus: ServiceStatus.FAILED })
    })

    it('should queue the failure notification against the transaction', () => {
      expect(mockAddMessagesToQueueAfterCommit).toHaveBeenCalledWith(
        transaction,
        {
          type: MessageType.SUBPOENA_NOTIFICATION,
          caseId,
          elementId: [defendantId, subpoenaId],
          body: { type: SubpoenaNotificationType.SERVICE_FAILED },
        },
      )
    })
  })

  describe('service status unchanged', () => {
    beforeEach(async () => {
      await givenWhenThen({ comment: 'Some comment' })
    })

    it('should queue nothing', () => {
      expect(mockAddMessagesToQueueAfterCommit).not.toHaveBeenCalled()
    })
  })
})
