import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import { Message } from '@island.is/judicial-system/message'
import { CaseFileCategory } from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { getOrCreateTransaction } from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import { Case, CaseFile, CaseFileRepositoryService } from '../../../repository'

interface Then {
  result: CaseFile
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  fileId: string,
  theCase: Case,
  caseFile: CaseFile,
) => Promise<Then>

describe('FileController - Confirm ruling order', () => {
  let mockCaseFileRepositoryService: CaseFileRepositoryService
  let queuedMessagesAfterCommit: Message[]
  let mockTransaction: jest.Mock
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      caseFileRepositoryService,
      fileController,
      sequelize,
      queuedMessagesAfterCommit: messages,
    } = await createTestingFileModule()

    mockCaseFileRepositoryService = caseFileRepositoryService
    queuedMessagesAfterCommit = messages

    mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    givenWhenThen = async (
      caseId: string,
      fileId: string,
      theCase: Case,
      caseFile: CaseFile,
    ): Promise<Then> => {
      const then = {} as Then

      // The route is guarded by CaseExistsForUpdateGuard, so the request
      // transaction is already open - and holding a lock on this case row -
      // by the time the handler runs. Guards do not execute in controller
      // unit tests, so the request context and that transaction are set up
      // here instead.
      try {
        then.result = await runInRequestContext(async () => {
          await getOrCreateTransaction(sequelize)

          return fileController.confirmRulingOrder(
            caseId,
            theCase,
            fileId,
            caseFile,
          )
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('ruling order confirmed', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = {
      id: fileId,
      caseId,
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
    } as CaseFile
    const updatedCaseFile = { ...caseFile, submissionDate: new Date() }
    let then: Then

    beforeEach(async () => {
      const mockUpdate =
        mockCaseFileRepositoryService.updateByIdAndCase as jest.Mock
      mockUpdate.mockResolvedValueOnce({
        numberOfAffectedRows: 1,
        caseFiles: [updatedCaseFile],
      })

      then = await givenWhenThen(caseId, fileId, theCase, caseFile)
    })

    it('should set the submission date on the file in the transaction the guard opened', () => {
      // Once, by the stand-in for the guard above. A second call would be the
      // handler opening a transaction of its own, which would block on the
      // guard's row lock and deadlock the request.
      expect(mockTransaction).toHaveBeenCalledTimes(1)
      expect(
        mockCaseFileRepositoryService.updateByIdAndCase,
      ).toHaveBeenCalledWith(
        fileId,
        caseId,
        { submissionDate: expect.any(String) },
        { transaction },
      )
    })

    it('should return the updated case file', () => {
      expect(then.result).toBe(updatedCaseFile)
    })

    it('should not queue any notification', () => {
      expect(queuedMessagesAfterCommit).toHaveLength(0)
    })
  })

  describe('file is not a ruling order', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = {
      id: fileId,
      caseId,
      category: CaseFileCategory.RULING,
    } as CaseFile
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, fileId, theCase, caseFile)
    })

    it('should throw a bad request exception', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(
        mockCaseFileRepositoryService.updateByIdAndCase,
      ).not.toHaveBeenCalled()
    })
  })

  describe('ruling order already confirmed', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = {
      id: fileId,
      caseId,
      category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
      submissionDate: new Date(),
    } as CaseFile
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, fileId, theCase, caseFile)
    })

    it('should throw a bad request exception', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(
        mockCaseFileRepositoryService.updateByIdAndCase,
      ).not.toHaveBeenCalled()
    })
  })
})
