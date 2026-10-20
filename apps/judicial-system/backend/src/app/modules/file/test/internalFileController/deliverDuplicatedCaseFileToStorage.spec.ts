import { v4 as uuid } from 'uuid'

import { CaseType } from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { AwsS3Service } from '../../../aws-s3'
import { Case, CaseFile, CaseFileRepositoryService } from '../../../repository'
import { DeliverResponse } from '../../models/deliver.response'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (caseFile: CaseFile) => Promise<Then>

describe('InternalFileController - Deliver duplicated case file to storage', () => {
  const caseId = uuid()
  const theCase = { id: caseId, type: CaseType.INDICTMENT } as Case
  const fileId = uuid()
  const sourceKey = `${uuid()}/${uuid()}/document.pdf`
  const key = `${caseId}/${uuid()}/document.pdf`

  let mockAwsS3Service: jest.Mocked<AwsS3Service>
  let mockCaseFileRepositoryService: jest.Mocked<CaseFileRepositoryService>
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, caseFileRepositoryService, internalFileController } =
      await createTestingFileModule()

    mockAwsS3Service = awsS3Service as jest.Mocked<AwsS3Service>
    mockCaseFileRepositoryService =
      caseFileRepositoryService as jest.Mocked<CaseFileRepositoryService>

    givenWhenThen = async (caseFile: CaseFile): Promise<Then> => {
      const then = {} as Then

      try {
        then.result =
          await internalFileController.deliverDuplicatedCaseFileToStorage(
            caseId,
            fileId,
            theCase,
            caseFile,
            { sourceKey },
          )
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('object copied', () => {
    const caseFile = { id: fileId, key, isKeyAccessible: false } as CaseFile
    let then: Then

    beforeEach(async () => {
      mockCaseFileRepositoryService.updateById.mockResolvedValueOnce(1)

      then = await givenWhenThen(caseFile)
    })

    it('should copy the object from the original key to the copy', () => {
      expect(mockAwsS3Service.copyObject).toHaveBeenCalledWith(
        CaseType.INDICTMENT,
        sourceKey,
        key,
      )
    })

    it('should mark the object accessible once it is there', () => {
      expect(mockCaseFileRepositoryService.updateById).toHaveBeenCalledWith(
        fileId,
        { isKeyAccessible: true },
      )
    })

    it('should complete the delivery', () => {
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('object already copied', () => {
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseFile)
    })

    it('should not touch S3 or the row', () => {
      expect(mockAwsS3Service.copyObject).not.toHaveBeenCalled()
      expect(mockCaseFileRepositoryService.updateById).not.toHaveBeenCalled()
    })

    it('should complete the delivery so that it is not retried', () => {
      expect(then.result).toEqual({ delivered: true })
    })
  })

  describe('copy fails', () => {
    const caseFile = { id: fileId, key, isKeyAccessible: false } as CaseFile
    let then: Then

    beforeEach(async () => {
      mockAwsS3Service.copyObject.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseFile)
    })

    // The row stays as it is - inaccessible but visible - and the message
    // handler retries
    it('should leave the row untouched', () => {
      expect(mockCaseFileRepositoryService.updateById).not.toHaveBeenCalled()
    })

    it('should not complete the delivery', () => {
      expect(then.result).toEqual({ delivered: false })
    })
  })

  describe('row not updated', () => {
    const caseFile = { id: fileId, key, isKeyAccessible: false } as CaseFile
    let then: Then

    beforeEach(async () => {
      mockCaseFileRepositoryService.updateById.mockResolvedValueOnce(0)

      then = await givenWhenThen(caseFile)
    })

    it('should not complete the delivery', () => {
      expect(then.result).toEqual({ delivered: false })
    })
  })

  describe('row update fails', () => {
    const caseFile = { id: fileId, key, isKeyAccessible: false } as CaseFile
    let then: Then

    beforeEach(async () => {
      mockCaseFileRepositoryService.updateById.mockRejectedValueOnce(
        new Error('Some error'),
      )

      then = await givenWhenThen(caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
