import { Transaction } from 'sequelize'
import { v4 as uuid } from 'uuid'

import { CaseFileState, CaseType } from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

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

describe('FileController - Delete case file', () => {
  let mockAwsS3Service: AwsS3Service
  let mockCaseFileRepositoryService: CaseFileRepositoryService
  let mockTransaction: jest.Mock
  let transaction: Transaction
  let afterCommitHooks: Array<() => unknown>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const {
      awsS3Service,
      caseFileRepositoryService,
      fileController,
      sequelize,
    } = await createTestingFileModule()

    mockAwsS3Service = awsS3Service
    mockCaseFileRepositoryService = caseFileRepositoryService

    const mockDeleteObject = mockAwsS3Service.deleteObject as jest.Mock
    mockDeleteObject.mockResolvedValue(true)

    // Sequelize runs a transaction's after-commit hooks when it commits and
    // never when it rolls back. The stand-in only collects them, so a spec
    // decides whether the commit happens.
    afterCommitHooks = []
    transaction = {
      afterCommit: (hook: () => unknown) => {
        afterCommitHooks.push(hook)
      },
    } as unknown as Transaction
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
      // here instead.
      try {
        then.result = await runInRequestContext(async () => {
          await getOrCreateTransaction(sequelize)

          return fileController.deleteCaseFile(
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

  describe('file of a request case deleted', () => {
    const caseId = uuid()
    const caseType = CaseType.CUSTODY
    const theCase = { id: caseId, type: caseType } as Case
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseFileRepositoryService.updateById as jest.Mock
      mockUpdate.mockResolvedValueOnce(1)

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

    // The handler has returned and nothing has committed. A request that rolls
    // back from here never runs the hook, so the row and the object both stay.
    it('should leave the file in S3 until the transaction commits', () => {
      expect(afterCommitHooks).toHaveLength(1)
      expect(mockAwsS3Service.deleteObject).not.toHaveBeenCalled()
    })

    it('should delete the file from S3 once the transaction commits', () => {
      afterCommitHooks.forEach((hook) => hook())

      expect(mockAwsS3Service.deleteObject).toHaveBeenCalledTimes(1)
      expect(mockAwsS3Service.deleteObject).toHaveBeenCalledWith(caseType, key)
    })

    // Sequelize awaits what an after-commit hook returns before commit()
    // resolves. Returning the S3 promise would hold every response back for
    // S3.
    it('should not make the commit wait for S3', () => {
      expect(afterCommitHooks.map((hook) => hook())).toEqual([undefined])
    })
  })

  describe('file of a request case deleted but not from S3', () => {
    const caseId = uuid()
    const theCase = { id: caseId, type: CaseType.CUSTODY } as Case
    const fileId = uuid()
    const caseFile = { id: fileId, key: `${uuid()}/test.txt` } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockCaseFileRepositoryService.updateById as jest.Mock
      mockUpdate.mockResolvedValueOnce(1)
      const mockDeleteObject = mockAwsS3Service.deleteObject as jest.Mock
      mockDeleteObject.mockRejectedValue(new Error('Some error'))

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)

      afterCommitHooks.forEach((hook) => hook())
      // Let the rejection reach the service's catch. An unhandled one would
      // fail the run.
      await new Promise(setImmediate)
    })

    it('should tolerate the failure', () => {
      expect(mockAwsS3Service.deleteObject).toHaveBeenCalledTimes(1)
      expect(then.result).toEqual({ success: true })
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
      expect(then.result).toEqual({ success: true })
    })

    it('should keep the file in S3', () => {
      expect(afterCommitHooks).toHaveLength(0)
      expect(mockAwsS3Service.deleteObject).not.toHaveBeenCalled()
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
      expect(afterCommitHooks).toHaveLength(0)
      expect(mockAwsS3Service.deleteObject).not.toHaveBeenCalled()
    })
  })

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

    it('should keep the file in S3', () => {
      expect(afterCommitHooks).toHaveLength(0)
      expect(mockAwsS3Service.deleteObject).not.toHaveBeenCalled()
    })
  })
})
