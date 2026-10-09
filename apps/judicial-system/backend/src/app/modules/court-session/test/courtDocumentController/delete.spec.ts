import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

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
  let mockCourtDocumentRepositoryService: CourtDocumentRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      sequelize,
      courtDocumentRepositoryService,
      courtDocumentController,
    } = await createTestingCourtSessionModule()

    const mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    mockCourtDocumentRepositoryService = courtDocumentRepositoryService

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        // The request transaction is the guard's; see create.spec.ts.
        await runInRequestContext(async () => {
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
