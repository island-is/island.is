import { from, lastValueFrom } from 'rxjs'
import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { ExecutionContext } from '@nestjs/common'

import type { Logger } from '@island.is/logging'

import { CaseFileState, CaseType } from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { TransactionCommitInterceptor } from '../../../../interceptors/transactionCommit.interceptor'
import { getOrCreateTransaction } from '../../../../middleware'
import { runInRequestContext } from '../../../../test'
import { AwsS3Service } from '../../../aws-s3'
import { Case, CaseFile, CaseFileRepositoryService } from '../../../repository'
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

describe('LimitedAccessFileController - Delete case file', () => {
  const interceptor = new TransactionCommitInterceptor({
    error: jest.fn(),
  } as unknown as Logger)

  let mockAwsS3Service: AwsS3Service
  let mockDeleteObject: jest.Mock
  let mockCaseFileRepositoryService: CaseFileRepositoryService
  let mockTransaction: jest.Mock
  let mockCommit: jest.Mock
  let transaction: Transaction
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      awsS3Service,
      caseFileRepositoryService,
      limitedAccessFileController,
      sequelize,
    } = await createTestingFileModule()

    mockAwsS3Service = awsS3Service
    mockCaseFileRepositoryService = caseFileRepositoryService

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

      // The route is guarded by LimitedAccessCaseExistsForUpdateGuard, so the
      // request transaction is already open - and holding a lock on this case
      // row - by the time the handler runs. Guards do not execute in controller
      // unit tests, so the request context and that transaction are set up
      // here instead. The handler runs under the interceptor that commits that
      // transaction in production, because what happens to the file in S3 is
      // decided by how the commit goes.
      try {
        then.result = await runInRequestContext(async () => {
          await getOrCreateTransaction(sequelize)

          return lastValueFrom(
            interceptor.intercept({} as ExecutionContext, {
              handle: () =>
                from(
                  limitedAccessFileController.deleteCaseFile(
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

  describe('case file deleted', () => {
    const caseId = uuid()
    const caseType = CaseType.RESTRAINING_ORDER
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

    it('should update the case file status in the database', () => {
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

  describe('case file not deleted', () => {
    const caseId = uuid()
    const theCase = { id: caseId, type: CaseType.RESTRAINING_ORDER } as Case
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

  describe('database update fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId, type: CaseType.RESTRAINING_ORDER } as Case
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
})
