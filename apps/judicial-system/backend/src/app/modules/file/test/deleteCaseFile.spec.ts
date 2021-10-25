import { uuid } from 'uuidv4'

import { CaseFileState } from '@island.is/judicial-system/types'

import { AwsS3Service } from '../../aws-S3'
import { CaseFile, DeleteFileResponse } from '../models'
import { createTestingFileModule } from './createTestingFileModule'

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
    const {
      awsS3Service,
      fileModel,
      fileController,
    } = await createTestingFileModule()

    mockAwsS3Service = awsS3Service
    mockFileModel = fileModel

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
    let mockUpdate: jest.Mock

    beforeEach(async () => {
      mockUpdate = mockFileModel.update as jest.Mock

      await givenWhenThen(caseId, fileId, caseFile)
    })

    it('should update the case file status in the database', () => {
      expect(mockUpdate).toHaveBeenCalledWith(
        { state: CaseFileState.DELETED },
        { where: { id: fileId } },
      )
    })
  })

  describe('AWS S3 removal', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = {
      id: fileId,
      state: CaseFileState.STORED_IN_RVG,
      key,
    } as CaseFile
    let mockDeleteObject: jest.Mock

    beforeEach(async () => {
      mockDeleteObject = mockAwsS3Service.deleteObject as jest.Mock
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])

      await givenWhenThen(caseId, fileId, caseFile)
    })

    it('should attempt to remove from AWS S3', () => {
      expect(mockDeleteObject).toHaveBeenCalledWith(key)
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
