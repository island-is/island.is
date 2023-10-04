import { uuid } from 'uuidv4'

import { createTestingFileModule } from '../createTestingFileModule'

import { AwsS3Service } from '../../../aws-s3'
import { DeliverResponse } from '../../models/deliver.response'
import { CaseFile } from '../../models/file.model'

interface Then {
  result: DeliverResponse
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  fileId: string,
  caseFile: CaseFile,
) => Promise<Then>

describe('InternalFileController - Archive case files', () => {
  let mockAwsS3Service: AwsS3Service
  let mockFileModel: typeof CaseFile
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, fileModel, internalFileController } =
      await createTestingFileModule()

    mockAwsS3Service = awsS3Service
    mockFileModel = fileModel

    givenWhenThen = async (
      caseId: string,
      fileId: string,
      caseFile: CaseFile,
    ): Promise<Then> => {
      const then = {} as Then

      await internalFileController
        .archiveCaseFile(caseId, fileId, caseFile)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('case file delivered', () => {
    const caseId = uuid()
    const fileId = uuid()
    const surrogateKey = uuid()
    const key = `indictments/${caseId}/${surrogateKey}/test.txt`
    const newKey = `indictments/completed/${caseId}/${surrogateKey}/test.txt`
    const fileName = 'test.txt'
    const fileType = 'text/plain'
    const caseFile = {
      id: fileId,
      caseId,
      key,
      name: fileName,
      type: fileType,
    } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockCopyObject = mockAwsS3Service.copyObject as jest.Mock
      mockCopyObject.mockResolvedValueOnce(newKey)
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])
      const mockDeleteObject = mockAwsS3Service.deleteObject as jest.Mock
      mockDeleteObject.mockResolvedValueOnce(true)

      then = await givenWhenThen(caseId, fileId, caseFile)
    })

    it('should copy the file to archive bucket in AWS S3', () => {
      expect(mockAwsS3Service.copyObject).toHaveBeenCalledWith(key, newKey)
    })

    it('should update case file state', () => {
      expect(mockFileModel.update).toHaveBeenCalledWith(
        { key: newKey },
        { where: { id: fileId } },
      )
    })

    it('should try to delete the file from AWS S3', () => {
      expect(mockAwsS3Service.deleteObject).toHaveBeenCalledWith(key)
    })

    it('should return success', () => {
      expect(then.result).toEqual({ delivered: true })
    })
  })
})
