import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { BadRequestException } from '@nestjs/common'

import {
  CaseFileCategory,
  CaseFileState,
  CaseType,
} from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { getOrCreateTransaction } from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import {
  Case,
  CaseFile,
  CaseFileRepositoryService,
  CourtDocument,
  CourtDocumentRepositoryService,
  CourtSession,
} from '../../../repository'

interface Then {
  result: CaseFile
  error: Error
}

describe('FileController - Reject case file', () => {
  const caseId = uuid()
  const fileId = uuid()
  const caseFile = {
    id: fileId,
    caseId,
    category: CaseFileCategory.DEFENDANT_CASE_FILE,
  } as CaseFile
  const rejectedCaseFile = { ...caseFile, state: CaseFileState.REJECTED }

  const sessionFiling = (id: string, isConfirmed: boolean) =>
    ({
      isConfirmed,
      filedDocuments: [{ caseFileId: id } as CourtDocument],
    } as CourtSession)

  const makeCase = (courtSessions: CourtSession[] = []) =>
    ({ id: caseId, type: CaseType.INDICTMENT, courtSessions } as Case)

  let mockCaseFileRepositoryService: CaseFileRepositoryService
  let mockCourtDocumentRepositoryService: CourtDocumentRepositoryService
  let mockTransaction: jest.Mock
  let transaction: Transaction
  let givenWhenThen: (theCase: Case, caseFile: CaseFile) => Promise<Then>

  beforeEach(async () => {
    const {
      caseFileRepositoryService,
      courtDocumentRepositoryService,
      fileController,
      sequelize,
    } = await createTestingFileModule()

    mockCaseFileRepositoryService = caseFileRepositoryService
    mockCourtDocumentRepositoryService = courtDocumentRepositoryService

    mockTransaction = sequelize.transaction as jest.Mock
    transaction = {} as Transaction
    mockTransaction.mockResolvedValue(transaction)

    const mockUpdate =
      mockCaseFileRepositoryService.updateByIdAndCase as jest.Mock
    mockUpdate.mockResolvedValueOnce({
      numberOfAffectedRows: 1,
      caseFiles: [rejectedCaseFile],
    })

    givenWhenThen = async (theCase, caseFile) => {
      const then = {} as Then

      // The route is guarded by CaseExistsForUpdateGuard, so the request
      // transaction is already open - and holding a lock on this case row -
      // by the time the handler runs. Guards do not execute in controller
      // unit tests, so the request context and that transaction are set up
      // here instead.
      try {
        then.result = await runInRequestContext(async () => {
          await getOrCreateTransaction(sequelize)

          return fileController.rejectCaseFile(
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

  const expectNothingWritten = () => {
    expect(
      mockCourtDocumentRepositoryService.deleteByCaseFileId,
    ).not.toHaveBeenCalled()
    expect(
      mockCaseFileRepositoryService.updateByIdAndCase,
    ).not.toHaveBeenCalled()
  }

  describe('file rejected', () => {
    let then: Then

    beforeEach(async () => {
      // Filed in a session that is still open, and another file in a
      // confirmed one: neither stands in the way.
      then = await givenWhenThen(
        makeCase([sessionFiling(fileId, false), sessionFiling(uuid(), true)]),
        caseFile,
      )
    })

    it('should unfile and reject the file in the transaction the guard opened', () => {
      // Once, by the stand-in for the guard above. A second call would be the
      // handler opening a transaction of its own, which would block on the
      // guard's row lock and deadlock the request.
      expect(mockTransaction).toHaveBeenCalledTimes(1)
      expect(
        mockCourtDocumentRepositoryService.deleteByCaseFileId,
      ).toHaveBeenCalledWith(caseId, fileId, { transaction })
      expect(
        mockCaseFileRepositoryService.updateByIdAndCase,
      ).toHaveBeenCalledWith(
        fileId,
        caseId,
        { state: CaseFileState.REJECTED },
        { transaction },
      )
    })

    it('should return the rejected case file', () => {
      expect(then.result).toBe(rejectedCaseFile)
    })
  })

  describe('file is already rejected', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(makeCase(), {
        ...caseFile,
        state: CaseFileState.REJECTED,
      } as CaseFile)
    })

    it('should be refused without writing anything', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('File is already rejected')
      expectNothingWritten()
    })
  })

  describe.each([CaseFileCategory.RULING, undefined])(
    'file of category %s',
    (category) => {
      let then: Then

      beforeEach(async () => {
        then = await givenWhenThen(makeCase(), {
          ...caseFile,
          category,
        } as CaseFile)
      })

      it('should be refused without writing anything', () => {
        expect(then.error).toBeInstanceOf(BadRequestException)
        expect(then.error.message).toBe(
          'Only uploaded prosecutor, defendant, civil claimant and court case files can be rejected',
        )
        expectNothingWritten()
      })
    },
  )

  describe('file has been filed in a confirmed court session', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(
        makeCase([sessionFiling(fileId, true)]),
        caseFile,
      )
    })

    it('should be refused without writing anything', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        'Cannot reject a file that has been filed in a court session',
      )
      expectNothingWritten()
    })
  })
})
