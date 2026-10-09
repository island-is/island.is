import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import { createTestingCourtSessionModule } from '../createTestingCourtSessionModule'

import { runInRequestContext } from '../../../../test'
import {
  Case,
  CourtDocument,
  CourtDocumentRepositoryService,
  CourtSession,
} from '../../../repository'

interface Then {
  result: CourtDocument
  error: Error
}

type GivenWhenThen = (theCase: Case, courtSessionId: string) => Promise<Then>

describe('CourtDocumentController - File in court session', () => {
  const caseId = uuid()
  const courtSessionId = uuid()
  const courtDocumentId = uuid()
  const theCase = {
    id: caseId,
    courtSessions: [{ id: courtSessionId, caseId } as CourtSession],
  } as Case
  const filedCourtDocument = { id: courtDocumentId, caseId } as CourtDocument

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
    const mockFileInCourtSession =
      mockCourtDocumentRepositoryService.fileInCourtSession as jest.Mock
    mockFileInCourtSession.mockResolvedValue(filedCourtDocument)

    givenWhenThen = async (theCase: Case, courtSessionId: string) => {
      const then = {} as Then

      try {
        // The request transaction is the guard's; see create.spec.ts.
        await runInRequestContext(async () => {
          then.result = await courtDocumentController.fileInCourtSession(
            caseId,
            courtDocumentId,
            theCase,
            { courtSessionId },
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('court document filed', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, courtSessionId)
    })

    it('should file the document in the session under the request transaction', () => {
      expect(
        mockCourtDocumentRepositoryService.fileInCourtSession,
      ).toHaveBeenCalledWith(caseId, courtSessionId, courtDocumentId, {
        transaction,
      })
      expect(then.result).toBe(filedCourtDocument)
    })
  })

  // The session list is the locked case's, so a session that is not on it now
  // is not on it for the rest of this transaction either.
  describe('court session is not on the case', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, uuid())
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
    })

    it('should file nothing', () => {
      expect(
        mockCourtDocumentRepositoryService.fileInCourtSession,
      ).not.toHaveBeenCalled()
    })
  })

  describe('filing fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockFileInCourtSession =
        mockCourtDocumentRepositoryService.fileInCourtSession as jest.Mock
      mockFileInCourtSession.mockRejectedValue(new Error('Some error'))

      then = await givenWhenThen(theCase, courtSessionId)
    })

    it('should throw Error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
