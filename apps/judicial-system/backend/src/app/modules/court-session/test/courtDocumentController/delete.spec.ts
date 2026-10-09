import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

import { getOrCreateTransaction } from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import { CourtDocumentRepositoryService } from '../../../repository'
import { DeleteCourtDocumentResponse } from '../../dto/deleteCourtDocument.response'

interface Then {
  result: DeleteCourtDocumentResponse
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('CourtDocumentController - Delete', () => {
  const caseId = uuid()
  const courtSessionId = uuid()
  const courtDocumentId = uuid()

  let transaction: Transaction
  let mockTransaction: jest.Mock
  let mockCourtDocumentRepositoryService: CourtDocumentRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      sequelize,
      courtDocumentRepositoryService,
      courtDocumentController,
    } = await createTestingCourtSessionModule()

    mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    mockCourtDocumentRepositoryService = courtDocumentRepositoryService

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        // The request transaction is the guard's; see create.spec.ts.
        await runInRequestContext(async () => {
          // Stand in for CaseExistsForUpdateGuard, which opens the request
          // transaction before the handler runs.
          await getOrCreateTransaction(sequelize)

          then.result = await courtDocumentController.delete(
            caseId,
            courtSessionId,
            courtDocumentId,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('court document deleted', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    // One call to sequelize.transaction: the guard's. A handler that opened a
    // transaction of its own - the deadlock the controller warns about - would
    // make it two, and the mock would resolve the same stub for both.
    it('should join the transaction the guard opened rather than open one', () => {
      expect(mockTransaction).toHaveBeenCalledTimes(1)
    })

    it('should remove the document from the session under the request transaction', () => {
      expect(
        mockCourtDocumentRepositoryService.removeFromCourtSession,
      ).toHaveBeenCalledWith(caseId, courtSessionId, courtDocumentId, {
        transaction,
      })
      expect(then.result).toEqual({ deleted: true })
    })
  })

  describe('court document deletion fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockRemoveFromCourtSession =
        mockCourtDocumentRepositoryService.removeFromCourtSession as jest.Mock
      mockRemoveFromCourtSession.mockRejectedValue(new Error('Some error'))

      then = await givenWhenThen()
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
