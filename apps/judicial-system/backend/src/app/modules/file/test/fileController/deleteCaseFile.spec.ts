import { uuid } from 'uuidv4'

import { CaseFileState } from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { AwsS3Service } from '../../../aws-s3'
import { DeleteFileResponse } from '../../models/deleteFile.response'
import { CaseFile } from '../../models/file.model'

interface Then {
  result: DeleteFileResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  fileId: string,
  casefile: CaseFile,
) => Promise<Then>

describe('FileController - Delete case file', () => {
  let mockAwsS3Service: AwsS3Service
  let mockFileModel: typeof CaseFile
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, fileModel, fileController } =
      await createTestingFileModule()

    mockAwsS3Service = awsS3Service
    mockFileModel = fileModel

    const mockDeleteObject = mockAwsS3Service.deleteObject as jest.Mock
    mockDeleteObject.mockRejectedValue(new Error('Some Error'))

    givenWhenThen = async (
      caseId: string,
      fileId: string,
      caseFile: CaseFile,
    ): Promise<Then> => {
      const then = {} as Then

      await fileController
        .deleteCaseFile(caseId, fileId, caseFile)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database update', () => {
    const caseId = uuid()
    const fileId = uuid()
    const caseFile = { id: fileId } as CaseFile

    beforeEach(async () => {
      await givenWhenThen(caseId, fileId, caseFile)
    })

    it('should update the case file status in the database', () => {
      expect(mockFileModel.update).toHaveBeenCalledWith(
        { state: CaseFileState.DELETED, key: null },
        { where: { id: fileId } },
      )
    })
  })

  describe('AWS S3 removal', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `uploads/${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile

    beforeEach(async () => {
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])

      await givenWhenThen(caseId, fileId, caseFile)
    })

    it('should attempt to remove from AWS S3', () => {
      expect(mockAwsS3Service.deleteObject).toHaveBeenCalledWith(key)
    })
  })

  describe('AWS S3 removal skipped', () => {
    const caseId = uuid()
    const fileId = uuid()
    const caseFile = { id: fileId } as CaseFile

    beforeEach(async () => {
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])

      await givenWhenThen(caseId, fileId, caseFile)
    })

    it('should not attempt to remove from AWS S3', () => {
      expect(mockAwsS3Service.deleteObject).not.toHaveBeenCalled()
    })
  })

  describe('case file deleted', () => {
    const caseId = uuid()
    const fileId = uuid()
    const caseFile = { id: fileId } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])

      then = await givenWhenThen(caseId, fileId, caseFile)
    })

    it('should return success', () => {
      expect(then.result).toEqual({ success: true })
    })
  })

  describe('case file not deleted', () => {
    const caseId = uuid()
    const fileId = uuid()
    const caseFile = { id: fileId } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([0])

      then = await givenWhenThen(caseId, fileId, caseFile)
    })

    it('should return failure', () => {
      expect(then.result).toEqual({ success: false })
    })
  })

  describe('database update fails', () => {
    const caseId = uuid()
    const fileId = uuid()
    const caseFile = { id: fileId } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, fileId, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
