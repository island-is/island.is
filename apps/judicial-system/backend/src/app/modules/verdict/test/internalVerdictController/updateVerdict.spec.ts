import { Transaction } from 'sequelize'
import { Sequelize } from 'sequelize-typescript'
import { v4 as uuid } from 'uuid'

import {
  formatDate,
  getVerdictServiceStatusText,
} from '@island.is/judicial-system/formatters'
import { MessageType } from '@island.is/judicial-system/message'
import {
  IndictmentCaseNotificationType,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import {
  getOrCreateTransaction,
  getTransactionContext,
  queueMessagesAfterCommit,
  TransactionContext,
} from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import { EventService } from '../../../event'
import { Case, Verdict, VerdictRepositoryService } from '../../../repository'
import { PoliceUpdateVerdictDto } from '../../dto/policeUpdateVerdict.dto'

interface Then {
  result: Verdict
  error: Error
}

type GivenWhenThen = (theCase: Case, currentVerdict?: Verdict) => Promise<Then>

describe('InternalVerdictController - Update verdict', () => {
  const verdictId = uuid()
  const externalPoliceDocumentId = uuid()

  const defendantId1 = uuid()
  const caseId = uuid()
  const policeCaseNumber = uuid()
  const courtCaseNumber = uuid()
  const policeCaseNumbers = [uuid(), policeCaseNumber, uuid()]
  const caseFileId = uuid()
  const caseFile = { id: caseFileId, caseId, policeCaseNumber }
  const theCase = {
    id: caseId,
    defendants: [{ id: defendantId1 }],
    policeCaseNumbers,
    caseFiles: [caseFile],
    courtCaseNumber,
  } as Case
  const verdict = {
    id: verdictId,
    caseId,
    defendantId: defendantId1,
    externalPoliceDocumentId,
  } as Verdict

  const dto = {
    serviceDate: new Date(2025, 1, 1),
    serviceStatus: VerdictServiceStatus.ELECTRONICALLY,
    comment: 'test',
  } as PoliceUpdateVerdictDto

  let mockVerdictRepositoryService: VerdictRepositoryService
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
      internalVerdictController,
      verdictRepositoryService,
      eventService,
    } = await createTestingVerdictModule()

    mockVerdictRepositoryService = verdictRepositoryService
    mockEventService = eventService
    mockSequelize = sequelize
    mockQueueMessagesAfterCommit = queueMessagesAfterCommit as jest.Mock

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    givenWhenThen = async (
      theCase: Case,
      currentVerdict = verdict,
    ): Promise<Then> => {
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

          then.result = await internalVerdictController.updateVerdict(
            externalPoliceDocumentId,
            currentVerdict,
            theCase,
            dto,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('verdict served', () => {
    const updatedVerdict = { ...verdict, ...dto }

    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockVerdictRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedVerdict)

      then = await givenWhenThen(theCase)
    })

    it('should update the verdict in the transaction the guard opened, without opening another', () => {
      // Once, by the stand-in for CaseExistsForUpdateGuard above. A second
      // call would be the handler opening a transaction of its own, which
      // would block on the guard's row lock and deadlock the request.
      expect(mockSequelize.transaction).toHaveBeenCalledTimes(1)
      expect(mockVerdictRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        defendantId1,
        verdictId,
        dto,
        { transaction },
      )
      expect(mockQueueMessagesAfterCommit).not.toHaveBeenCalled()
      expect(then.result).toBe(updatedVerdict)
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
        'VERDICT_SERVICE_STATUS',
        theCase,
        {
          Staða: getVerdictServiceStatusText(
            VerdictServiceStatus.ELECTRONICALLY,
          ),
          Birt: formatDate(dto.serviceDate, 'dd.MM.y HH:mm'),
        },
      )
    })
  })

  describe('verdict served to a defendant with a suspended driving license', () => {
    const updatedVerdict = { ...verdict, ...dto }
    const suspendedCase = {
      ...theCase,
      defendants: [{ id: defendantId1, isDrivingLicenseSuspended: true }],
    } as Case

    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockVerdictRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedVerdict)

      then = await givenWhenThen(suspendedCase)
    })

    it('should queue the suspension notification for after the commit', () => {
      expect(mockQueueMessagesAfterCommit).toHaveBeenCalledWith({
        type: MessageType.INDICTMENT_CASE_NOTIFICATION,
        caseId,
        body: {
          type: IndictmentCaseNotificationType.DRIVING_LICENSE_SUSPENSION,
        },
      })
      expect(then.result).toBe(updatedVerdict)
    })

    // One callback, the event's: the suspension notification goes through
    // queueMessagesAfterCommit, which the testing module mocks, so it never
    // registers one of its own here.
    it('should register the service status event rather than posting it inline', () => {
      expect(mockEventService.postEvent).not.toHaveBeenCalled()
      expect(transactionContext?.afterCommit).toHaveLength(1)
    })
  })

  // The police-id guard reads the verdict before the lock; the copy on the
  // locked case is what the status comparison trusts. Here the two disagree:
  // another delivery served the verdict between that read and the lock.
  describe('verdict already served on the locked case', () => {
    const servedCase = {
      ...theCase,
      defendants: [
        {
          id: defendantId1,
          isDrivingLicenseSuspended: true,
          verdicts: [
            {
              ...verdict,
              serviceStatus: VerdictServiceStatus.ELECTRONICALLY,
            } as Verdict,
          ],
        },
      ],
    } as Case
    const updatedVerdict = { ...verdict, ...dto }

    beforeEach(async () => {
      const mockUpdate = mockVerdictRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedVerdict)

      await givenWhenThen(servedCase)
    })

    it('should neither notify nor register an event', () => {
      expect(mockQueueMessagesAfterCommit).not.toHaveBeenCalled()
      expect(mockEventService.postEvent).not.toHaveBeenCalled()
      expect(transactionContext?.afterCommit).toHaveLength(0)
    })
  })

  describe('service status unchanged', () => {
    const servedVerdict = {
      ...verdict,
      serviceStatus: VerdictServiceStatus.ELECTRONICALLY,
    } as Verdict
    const updatedVerdict = { ...servedVerdict, ...dto }

    beforeEach(async () => {
      const mockUpdate = mockVerdictRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedVerdict)

      await givenWhenThen(theCase, servedVerdict)
    })

    it('should neither notify nor register an event', () => {
      expect(mockQueueMessagesAfterCommit).not.toHaveBeenCalled()
      expect(mockEventService.postEvent).not.toHaveBeenCalled()
      expect(transactionContext?.afterCommit).toHaveLength(0)
    })
  })
})
