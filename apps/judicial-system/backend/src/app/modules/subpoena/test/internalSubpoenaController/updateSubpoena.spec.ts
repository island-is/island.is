import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import { getServiceStatusText } from '@island.is/judicial-system/formatters'
import { MessageType } from '@island.is/judicial-system/message'
import {
  CourtDocumentType,
  ServiceStatus,
  SubpoenaNotificationType,
} from '@island.is/judicial-system/types'

import { createTestingSubpoenaModule } from '../createTestingSubpoenaModule'

import {
  getOrCreateTransaction,
  getTransactionContext,
  TransactionContext,
} from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import { EventService } from '../../../event'
import {
  Case,
  CourtDocumentRepositoryService,
  Defendant,
  Subpoena,
  SubpoenaRepositoryService,
} from '../../../repository'
import { UpdateSubpoenaDto } from '../../dto/updateSubpoena.dto'

interface Then {
  result: Subpoena
  error: Error
}

type GivenWhenThen = (
  update: UpdateSubpoenaDto,
  currentCase?: Case,
  currentSubpoena?: Subpoena,
) => Promise<Then>

describe('InternalSubpoenaController - Update subpoena', () => {
  const caseId = uuid()
  const defendantId = uuid()
  const defendantName = 'Defendant'
  const subpoenaId = uuid()
  const policeSubpoenaId = uuid()

  const theCase = { id: caseId, withCourtSessions: false } as Case
  const defendant = { id: defendantId, name: defendantName } as Defendant
  const subpoena = {
    id: subpoenaId,
    caseId,
    defendantId,
    policeSubpoenaId,
  } as Subpoena
  const updatedSubpoena = { ...subpoena } as Subpoena

  let mockSubpoenaRepositoryService: SubpoenaRepositoryService
  let mockCourtDocumentRepositoryService: CourtDocumentRepositoryService
  let mockEventService: EventService
  let mockSequelize: Sequelize
  let mockQueueMessagesAfterCommit: jest.Mock
  let transaction: Transaction
  let transactionContext: TransactionContext | undefined
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.resetAllMocks()

    const {
      sequelize,
      subpoenaRepositoryService,
      courtDocumentRepositoryService,
      eventService,
      internalSubpoenaController,
      mockQueueMessagesAfterCommit: mockQueueMessages,
    } = await createTestingSubpoenaModule()

    mockSubpoenaRepositoryService = subpoenaRepositoryService
    mockCourtDocumentRepositoryService = courtDocumentRepositoryService
    mockEventService = eventService
    mockSequelize = sequelize
    mockQueueMessagesAfterCommit = mockQueueMessages

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    const mockFindById = mockSubpoenaRepositoryService.findById as jest.Mock
    mockFindById.mockResolvedValueOnce(updatedSubpoena)

    givenWhenThen = async (
      update: UpdateSubpoenaDto,
      currentCase = theCase,
      currentSubpoena = subpoena,
    ) => {
      const then = {} as Then

      // The route is guarded by CaseExistsForUpdateGuard, so the request
      // transaction is already open - and holding a lock on this case row -
      // by the time the handler runs. Guards do not execute in controller
      // unit tests, so the request context and that transaction are set up
      // here instead.
      try {
        await runInRequestContext(async () => {
          transactionContext = getTransactionContext()

          await getOrCreateTransaction(mockSequelize)

          then.result = await internalSubpoenaController.updateSubpoena(
            policeSubpoenaId,
            currentCase,
            defendant,
            currentSubpoena,
            update,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('subpoena served', () => {
    const update = { serviceStatus: ServiceStatus.ELECTRONICALLY }

    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(update)
    })

    it('should update the subpoena in the transaction the guard opened, without opening another', () => {
      // Once, by the stand-in for CaseExistsForUpdateGuard above. A second
      // call would be the handler opening a transaction of its own, which
      // would block on the guard's row lock and deadlock the request.
      expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
      expect(mockSubpoenaRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId,
        subpoenaId,
        update,
        { transaction, throwOnZeroRows: false },
      )
      expect(then.result).toBe(updatedSubpoena)
    })

    it('should queue the service notification for after the commit', () => {
      // Queued for after the commit, so a rollback sends nothing
      expect(mockQueueMessagesAfterCommit).toHaveBeenCalledWith({
        type: MessageType.SUBPOENA_NOTIFICATION,
        caseId,
        elementId: [defendantId, subpoenaId],
        body: { type: SubpoenaNotificationType.SERVICE_SUCCESSFUL },
      })
    })

    it('should register the service status event rather than posting it inline', () => {
      expect(mockEventService.postEvent).not.toHaveBeenCalled()
      expect(transactionContext?.afterCommit).toHaveLength(1)
    })

    it('should post the service status event once the transaction has committed', async () => {
      await Promise.all(
        (transactionContext?.afterCommit ?? []).map((callback) => callback()),
      )

      expect(mockEventService.postEvent).toHaveBeenCalledWith(
        'SUBPOENA_SERVICE_STATUS',
        theCase,
        { Staða: getServiceStatusText(ServiceStatus.ELECTRONICALLY) },
      )
    })

    it('should not file a service certificate on a case without court sessions', () => {
      expect(mockCourtDocumentRepositoryService.create).not.toHaveBeenCalled()
    })
  })

  describe('subpoena served on a case with court sessions', () => {
    const update = { serviceStatus: ServiceStatus.IN_PERSON }
    const caseWithCourtSessions = {
      ...theCase,
      withCourtSessions: true,
    } as Case

    beforeEach(async () => {
      await givenWhenThen(update, caseWithCourtSessions)
    })

    it('should file the service certificate in the transaction the guard opened', () => {
      const name = `Birtingarvottorð ${defendantName}`

      expect(mockCourtDocumentRepositoryService.create).toHaveBeenCalledWith(
        caseId,
        {
          documentType: CourtDocumentType.GENERATED_DOCUMENT,
          name,
          generatedPdfUri: `/api/case/${caseId}/subpoenaServiceCertificate/${defendantId}/${subpoenaId}/${name}`,
        },
        { transaction },
      )
    })
  })

  describe('service failed', () => {
    beforeEach(async () => {
      await givenWhenThen({ serviceStatus: ServiceStatus.FAILED })
    })

    it('should queue the failure notification for after the commit', () => {
      expect(mockQueueMessagesAfterCommit).toHaveBeenCalledWith({
        type: MessageType.SUBPOENA_NOTIFICATION,
        caseId,
        elementId: [defendantId, subpoenaId],
        body: { type: SubpoenaNotificationType.SERVICE_FAILED },
      })
    })

    it('should register the service status event rather than posting it inline', () => {
      expect(mockEventService.postEvent).not.toHaveBeenCalled()
      expect(transactionContext?.afterCommit).toHaveLength(1)
    })
  })

  describe('service status unchanged', () => {
    beforeEach(async () => {
      await givenWhenThen({ comment: 'Some comment' })
    })

    it('should neither notify nor register an event', () => {
      expect(mockQueueMessagesAfterCommit).not.toHaveBeenCalled()
      expect(mockEventService.postEvent).not.toHaveBeenCalled()
      expect(transactionContext?.afterCommit).toHaveLength(0)
    })
  })

  // SubpoenaOnCaseGuard hands the handler the subpoena as the locked case
  // carries it, so a status another delivery already recorded arrives here as
  // the subpoena's own. Guards do not run here - subpoenaOnCaseGuard.spec.ts
  // and the chain spec pin the swap - so this row is the handler's half: a
  // status already on the subpoena it is given changes nothing.
  describe('service status already recorded on the locked case', () => {
    const servedSubpoena = {
      ...subpoena,
      serviceStatus: ServiceStatus.ELECTRONICALLY,
    } as Subpoena
    const caseWithCourtSessions = {
      ...theCase,
      withCourtSessions: true,
    } as Case

    beforeEach(async () => {
      await givenWhenThen(
        { serviceStatus: ServiceStatus.ELECTRONICALLY },
        caseWithCourtSessions,
        servedSubpoena,
      )
    })

    it('should neither notify, nor file a second certificate, nor register an event', () => {
      expect(mockQueueMessagesAfterCommit).not.toHaveBeenCalled()
      expect(mockCourtDocumentRepositoryService.create).not.toHaveBeenCalled()
      expect(mockEventService.postEvent).not.toHaveBeenCalled()
      expect(transactionContext?.afterCommit).toHaveLength(0)
    })
  })
})
