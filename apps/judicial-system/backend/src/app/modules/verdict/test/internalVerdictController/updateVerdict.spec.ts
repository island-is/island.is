import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { MessageType } from '@island.is/judicial-system/message'
import {
  IndictmentCaseNotificationType,
  VerdictServiceStatus,
} from '@island.is/judicial-system/types'

import { createTestingVerdictModule } from '../createTestingVerdictModule'

import { queueMessagesAfterCommit } from '../../../../middleware'
import { Case, Verdict, VerdictRepositoryService } from '../../../repository'
import { PoliceUpdateVerdictDto } from '../../dto/policeUpdateVerdict.dto'

// Mocked here as well as in the harness: this spec imports the helper before
// the harness, so the harness's mock would come too late for it
jest.mock('../../../../middleware/queueMessagesAfterCommit')

interface Then {
  result: Verdict
  error: Error
}

type GivenWhenThen = (theCase: Case) => Promise<Then>

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
  let mockQueueMessagesAfterCommit: jest.Mock
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    jest.resetAllMocks()

    const { sequelize, internalVerdictController, verdictRepositoryService } =
      await createTestingVerdictModule()

    mockVerdictRepositoryService = verdictRepositoryService
    mockQueueMessagesAfterCommit = queueMessagesAfterCommit as jest.Mock

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockImplementationOnce(
      (fn: (transaction: Transaction) => unknown) => fn(transaction),
    )

    givenWhenThen = async (theCase: Case): Promise<Then> => {
      const then = {} as Then

      await internalVerdictController
        .updateVerdict(externalPoliceDocumentId, verdict, theCase, dto)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('verdict updated', () => {
    const updatedVerdict = { ...verdict, ...dto }

    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockVerdictRepositoryService.update as jest.Mock
      mockUpdate.mockResolvedValueOnce(updatedVerdict)

      then = await givenWhenThen(theCase)
    })

    it('should update the verdict ', () => {
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
  })
})
