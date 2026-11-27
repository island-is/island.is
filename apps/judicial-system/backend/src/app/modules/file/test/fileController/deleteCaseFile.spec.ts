import { from, lastValueFrom } from 'rxjs'
import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { ExecutionContext, InternalServerErrorException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'

import {
  AppealCaseState,
  AppealCaseType,
  CaseFileCategory,
  CaseFileState,
  CaseType,
} from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { TransactionCommitInterceptor } from '../../../../interceptors/transactionCommit.interceptor'
import { getOrCreateTransaction } from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import { AwsS3Service } from '../../../aws-s3'
import {
  AppealCase,
  AppealCaseRepositoryService,
  Case,
  CaseFile,
  CaseFileRepositoryService,
} from '../../../repository'
import { FileService } from '../../file.service'
import { DeleteFileResponse } from '../../models/deleteFile.response'

interface Then {
  result: DeleteFileResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  fileId: string,
  casefile: CaseFile,
) => Promise<Then>

describe('FileController - Delete case file', () => {
  const interceptor = new TransactionCommitInterceptor({
    error: jest.fn(),
  } as unknown as Logger)

  let mockAwsS3Service: AwsS3Service
  let mockDeleteObject: jest.Mock
  let mockCaseFileRepositoryService: CaseFileRepositoryService
  let mockAppealCaseRepositoryService: AppealCaseRepositoryService
  let fileServiceUnderTest: FileService
  let mockTransaction: jest.Mock
  let mockCommit: jest.Mock
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      awsS3Service,
      caseFileRepositoryService,
      appealCaseRepositoryService,
      fileController,
      fileService,
      sequelize,
    } = await createTestingFileModule()

    mockAwsS3Service = awsS3Service
    mockCaseFileRepositoryService = caseFileRepositoryService
    mockAppealCaseRepositoryService = appealCaseRepositoryService
    fileServiceUnderTest = fileService

    mockDeleteObject = mockAwsS3Service.deleteObject as jest.Mock
    mockDeleteObject.mockResolvedValue(true)

    mockCommit = jest.fn().mockResolvedValue(undefined)
    transaction = { commit: mockCommit } as unknown as Transaction
    mockTransaction = sequelize.transaction as jest.Mock
    mockTransaction.mockResolvedValue(transaction)

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      fileId: string,
      caseFile: CaseFile,
    ): Promise<Then> => {
      const then = {} as Then

      // The route is guarded by CaseExistsForUpdateGuard, so the request
      // transaction is already open - and holding a lock on this case row -
      // by the time the handler runs. Guards do not execute in controller
      // unit tests, so the request context and that transaction are set up
      // here instead. The handler runs under the interceptor that commits
      // that transaction in production, because what happens to the file in
      // S3 is decided by how the commit goes.
      try {
        then.result = await runInRequestContext(async () => {
          await getOrCreateTransaction(sequelize)

          return lastValueFrom(
            interceptor.intercept({} as ExecutionContext, {
              handle: () =>
                from(
                  fileController.deleteCaseFile(
                    caseId,
                    theCase,
                    fileId,
                    caseFile,
                  ),
                ),
            }),
          ) as Promise<DeleteFileResponse>
        })
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('file of a request case deleted', () => {
    const caseId = uuid()
    const caseType = CaseType.CUSTODY
    const theCase = { id: caseId, type: caseType } as Case
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    let deletedFromS3BeforeCommit: boolean
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseFileRepositoryService.updateById as jest.Mock
      mockUpdate.mockResolvedValueOnce(1)
      mockCommit.mockImplementationOnce(async () => {
        deletedFromS3BeforeCommit = mockDeleteObject.mock.calls.length > 0
      })

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should delete the case file in the transaction the guard opened', () => {
      // Once, by the stand-in for the guard above. A second call would be the
      // handler opening a transaction of its own, which would block on the
      // guard's row lock and deadlock the request.
      expect(mockTransaction).toHaveBeenCalledTimes(1)
      expect(mockCaseFileRepositoryService.updateById).toHaveBeenCalledWith(
        fileId,
        { state: CaseFileState.DELETED, isKeyAccessible: false },
        { transaction },
      )
      expect(then.result).toEqual({ success: true })
    })

    it('should delete the file from S3 once the transaction has committed', () => {
      expect(mockCommit).toHaveBeenCalledTimes(1)
      expect(deletedFromS3BeforeCommit).toBe(false)
      expect(mockDeleteObject).toHaveBeenCalledTimes(1)
      expect(mockDeleteObject).toHaveBeenCalledWith(caseType, key)
    })
  })

  // The interceptor awaits its after-commit callbacks before the response is
  // sent. A callback that waited for S3 would hold every response back for
  // S3 - here for ever, and the spec would time out.
  describe('S3 does not answer', () => {
    const caseId = uuid()
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const fileId = uuid()
    const caseFile = { id: fileId, key: `${uuid()}/test.txt` } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseFileRepositoryService.updateById as jest.Mock
      mockUpdate.mockResolvedValueOnce(1)
      mockDeleteObject.mockReturnValue(new Promise(() => undefined))

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should not make the response wait for S3', () => {
      expect(mockDeleteObject).toHaveBeenCalledTimes(1)
      expect(then.result).toEqual({ success: true })
    })
  })

  describe('S3 delete fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const fileId = uuid()
    const caseFile = { id: fileId, key: `${uuid()}/test.txt` } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseFileRepositoryService.updateById as jest.Mock
      mockUpdate.mockResolvedValueOnce(1)
      mockDeleteObject.mockRejectedValue(new Error('Some error'))

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)

      // Let the rejection reach the service's catch. An unhandled one would
      // fail the run.
      await new Promise(setImmediate)
    })

    it('should tolerate the failure', () => {
      expect(mockDeleteObject).toHaveBeenCalledTimes(1)
      expect(then.result).toEqual({ success: true })
    })
  })

  // Postgres has rolled the transaction back, or nobody can tell whether it
  // committed: the case file may well still be live, so its object stays.
  describe('commit fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const fileId = uuid()
    const caseFile = { id: fileId, key: `${uuid()}/test.txt` } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseFileRepositoryService.updateById as jest.Mock
      mockUpdate.mockResolvedValueOnce(1)
      mockCommit.mockRejectedValueOnce(new Error('Some commit error'))

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should fail the request', () => {
      expect(then.error.message).toBe('Some commit error')
    })

    it('should keep the file in S3', () => {
      expect(mockDeleteObject).not.toHaveBeenCalled()
    })
  })

  describe('file of an indictment case deleted', () => {
    const caseId = uuid()
    const theCase = { id: caseId, type: CaseType.INDICTMENT } as Case
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseFileRepositoryService.updateById as jest.Mock
      mockUpdate.mockResolvedValueOnce(1)

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should delete the case file', () => {
      expect(mockCaseFileRepositoryService.updateById).toHaveBeenCalledWith(
        fileId,
        { state: CaseFileState.DELETED, isKeyAccessible: false },
        { transaction },
      )
      expect(mockCommit).toHaveBeenCalledTimes(1)
      expect(then.result).toEqual({ success: true })
    })

    it('should keep the file in S3 without looking the key up', () => {
      expect(
        mockCaseFileRepositoryService.existsLiveByKey,
      ).not.toHaveBeenCalled()
      expect(mockDeleteObject).not.toHaveBeenCalled()
    })
  })

  // The object goes with the last case file that points at it.
  describe('another case file still points at the same key', () => {
    const caseId = uuid()
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseFileRepositoryService.updateById as jest.Mock
      mockUpdate.mockResolvedValueOnce(1)
      const mockExists =
        mockCaseFileRepositoryService.existsLiveByKey as jest.Mock
      mockExists.mockResolvedValueOnce(true)

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should delete the case file', () => {
      expect(mockCaseFileRepositoryService.updateById).toHaveBeenCalledWith(
        fileId,
        { state: CaseFileState.DELETED, isKeyAccessible: false },
        { transaction },
      )
      expect(mockCommit).toHaveBeenCalledTimes(1)
      expect(then.result).toEqual({ success: true })
    })

    it('should look the key up after the delete, in the same transaction', () => {
      const mockUpdate = mockCaseFileRepositoryService.updateById as jest.Mock
      const mockExists =
        mockCaseFileRepositoryService.existsLiveByKey as jest.Mock

      expect(mockExists).toHaveBeenCalledWith(key, { transaction })
      expect(mockUpdate.mock.invocationCallOrder[0]).toBeLessThan(
        mockExists.mock.invocationCallOrder[0],
      )
    })

    it('should keep the file in S3', () => {
      expect(mockDeleteObject).not.toHaveBeenCalled()
    })
  })

  describe('case file not deleted', () => {
    const caseId = uuid()
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const fileId = uuid()
    const caseFile = { id: fileId } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseFileRepositoryService.updateById as jest.Mock
      mockUpdate.mockResolvedValueOnce(0)

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should return failure', () => {
      expect(then.result).toEqual({ success: false })
    })

    it('should keep the file in S3', () => {
      expect(mockDeleteObject).not.toHaveBeenCalled()
    })
  })

  // The handler throws, so the interceptor neither commits nor runs the
  // callbacks, and the middleware rolls the transaction back.
  describe('database update fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const fileId = uuid()
    const caseFile = { id: fileId } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseFileRepositoryService.updateById as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })

    it('should not commit or delete the file from S3', () => {
      expect(mockCommit).not.toHaveBeenCalled()
      expect(mockDeleteObject).not.toHaveBeenCalled()
    })
  })

  describe('ruling of a verdict appeal deleted', () => {
    const caseId = uuid()
    const verdictAppealCaseId = uuid()
    const fileId = uuid()
    const rulingFile = {
      id: fileId,
      key: `${caseId}/${uuid()}/ruling.pdf`,
      category: CaseFileCategory.VERDICT_APPEAL_RULING,
    } as CaseFile
    const caseWithAppeal = (appealState: AppealCaseState): Case =>
      ({
        id: caseId,
        type: CaseType.INDICTMENT,
        verdictAppealCase: {
          id: verdictAppealCaseId,
          appealType: AppealCaseType.VERDICT,
          appealState,
        } as AppealCase,
      } as Case)

    describe('once the verdict appeal is confirmed', () => {
      let then: Then

      beforeEach(async () => {
        const mockUpdate = mockCaseFileRepositoryService.updateById as jest.Mock
        mockUpdate.mockResolvedValueOnce(1)

        then = await givenWhenThen(
          caseId,
          caseWithAppeal(AppealCaseState.READY_TO_COMPLETE),
          fileId,
          rulingFile,
        )
      })

      // The appeal cannot stay confirmed without the document it was
      // confirmed with.
      it('should delete the file and take the confirmation back in the same transaction', () => {
        expect(then.result).toEqual({ success: true })
        expect(mockCaseFileRepositoryService.updateById).toHaveBeenCalledWith(
          fileId,
          { state: CaseFileState.DELETED, isKeyAccessible: false },
          { transaction },
        )
        expect(mockAppealCaseRepositoryService.update).toHaveBeenCalledWith(
          verdictAppealCaseId,
          { appealState: AppealCaseState.APPEALED },
          { transaction },
        )
        expect(
          mockCaseFileRepositoryService.clearHashesForCaseAndCategory,
        ).toHaveBeenCalledWith(caseId, CaseFileCategory.VERDICT_APPEAL_RULING, {
          transaction,
        })
      })
    })

    describe('once the verdict appeal is confirmed, but the file is not deleted', () => {
      let then: Then

      beforeEach(async () => {
        const mockUpdate = mockCaseFileRepositoryService.updateById as jest.Mock
        mockUpdate.mockResolvedValueOnce(0)

        then = await givenWhenThen(
          caseId,
          caseWithAppeal(AppealCaseState.READY_TO_COMPLETE),
          fileId,
          rulingFile,
        )
      })

      it('should leave the appeal confirmed', () => {
        expect(then.result).toEqual({ success: false })
        expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
        expect(
          mockCaseFileRepositoryService.clearHashesForCaseAndCategory,
        ).not.toHaveBeenCalled()
      })
    })

    describe.each([AppealCaseState.APPEALED, AppealCaseState.COMPLETED])(
      'when the verdict appeal is %s',
      (appealState) => {
        let then: Then

        beforeEach(async () => {
          const mockUpdate =
            mockCaseFileRepositoryService.updateById as jest.Mock
          mockUpdate.mockResolvedValueOnce(1)

          then = await givenWhenThen(
            caseId,
            caseWithAppeal(appealState),
            fileId,
            rulingFile,
          )
        })

        it('should delete the file and leave the appeal in its state', () => {
          expect(then.result).toEqual({ success: true })
          expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
          expect(
            mockCaseFileRepositoryService.clearHashesForCaseAndCategory,
          ).not.toHaveBeenCalled()
        })
      },
    )

    describe('another file deleted once the verdict appeal is confirmed', () => {
      let then: Then

      beforeEach(async () => {
        const mockUpdate = mockCaseFileRepositoryService.updateById as jest.Mock
        mockUpdate.mockResolvedValueOnce(1)

        then = await givenWhenThen(
          caseId,
          caseWithAppeal(AppealCaseState.READY_TO_COMPLETE),
          fileId,
          { ...rulingFile, category: CaseFileCategory.APPEAL_COURT_RECORD },
        )
      })

      it('should leave the appeal confirmed', () => {
        expect(then.result).toEqual({ success: true })
        expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
        expect(
          mockCaseFileRepositoryService.clearHashesForCaseAndCategory,
        ).not.toHaveBeenCalled()
      })
    })

    // Every route deletes in a transaction; without one the confirmation
    // could not be taken back together with the file.
    describe('without a transaction once the verdict appeal is confirmed', () => {
      let error: unknown

      beforeEach(async () => {
        error = undefined

        try {
          await fileServiceUnderTest.deleteCaseFile(
            caseWithAppeal(AppealCaseState.READY_TO_COMPLETE),
            rulingFile,
          )
        } catch (reason) {
          error = reason
        }
      })

      it('should refuse to delete the file', () => {
        expect(error).toBeInstanceOf(InternalServerErrorException)
        expect(mockCaseFileRepositoryService.updateById).not.toHaveBeenCalled()
        expect(mockAppealCaseRepositoryService.update).not.toHaveBeenCalled()
      })
    })
  })
})
