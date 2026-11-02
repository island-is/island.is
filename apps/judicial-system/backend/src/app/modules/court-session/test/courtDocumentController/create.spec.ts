import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { CourtDocumentType } from '@island.is/judicial-system/types'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

import { getOrCreateTransaction } from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import {
  CourtDocument,
  CourtDocumentRepositoryService,
} from '../../../repository'
import { CreateCourtDocumentDto } from '../../dto/createCourtDocument.dto'

interface Then {
  result: CourtDocument
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('CourtDocumentController - Create', () => {
  const caseId = uuid()
  const courtSessionId = uuid()
  const createDto = { name: 'Skjal' } as CreateCourtDocumentDto
  const createdCourtDocument = { id: uuid(), caseId } as CourtDocument

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
    const mockCreateInCourtSession =
      mockCourtDocumentRepositoryService.createInCourtSession as jest.Mock
    mockCreateInCourtSession.mockResolvedValue(createdCourtDocument)

    givenWhenThen = async () => {
      const then = {} as Then

      try {
        // The routes are guarded by CaseExistsForUpdateGuard, so the request
        // transaction is already open by the time the handler runs. Guards do
        // not execute in controller unit tests, so the request context is set
        // up here instead.
        await runInRequestContext(async () => {
          // Stand in for CaseExistsForUpdateGuard, which opens the request
          // transaction before the handler runs.
          await getOrCreateTransaction(sequelize)

          then.result = await courtDocumentController.create(
            caseId,
            courtSessionId,
            createDto,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('court document created', () => {
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

    it('should create the document in the session under the request transaction', () => {
      expect(
        mockCourtDocumentRepositoryService.createInCourtSession,
      ).toHaveBeenCalledWith(
        caseId,
        courtSessionId,
        { ...createDto, documentType: CourtDocumentType.EXTERNAL_DOCUMENT },
        { transaction },
      )
      expect(then.result).toBe(createdCourtDocument)
    })
  })

  describe('court document creation fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockCreateInCourtSession =
        mockCourtDocumentRepositoryService.createInCourtSession as jest.Mock
      mockCreateInCourtSession.mockRejectedValue(new Error('Some error'))

      then = await givenWhenThen()
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
