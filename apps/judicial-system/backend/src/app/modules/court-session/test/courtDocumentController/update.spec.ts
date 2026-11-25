import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

import { getOrCreateTransaction } from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import {
  CourtDocument,
  CourtDocumentRepositoryService,
} from '../../../repository'
import { UpdateCourtDocumentDto } from '../../dto/updateCourtDocument.dto'

interface Then {
  result: CourtDocument
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('CourtDocumentController - Update', () => {
  const caseId = uuid()
  const courtSessionId = uuid()
  const courtDocumentId = uuid()
  const updateDto = { name: 'Nýtt nafn' } as UpdateCourtDocumentDto
  const updatedCourtDocument = { id: courtDocumentId, caseId } as CourtDocument

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
    const mockUpdate = mockCourtDocumentRepositoryService.update as jest.Mock
    mockUpdate.mockResolvedValue(updatedCourtDocument)

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        // The request transaction is the guard's; see create.spec.ts.
        await runInRequestContext(async () => {
          // Stand in for CaseExistsForUpdateGuard, which opens the request
          // transaction before the handler runs.
          await getOrCreateTransaction(sequelize)

          then.result = await courtDocumentController.update(
            caseId,
            courtSessionId,
            courtDocumentId,
            updateDto,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('court document updated', () => {
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

    it('should update the document under the request transaction', () => {
      expect(mockCourtDocumentRepositoryService.update).toHaveBeenCalledWith(
        caseId,
        courtSessionId,
        courtDocumentId,
        updateDto,
        { transaction },
      )
      expect(then.result).toBe(updatedCourtDocument)
    })
  })

  describe('court document update fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCourtDocumentRepositoryService.update as jest.Mock
      mockUpdate.mockRejectedValue(new Error('Some error'))

      then = await givenWhenThen()
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
