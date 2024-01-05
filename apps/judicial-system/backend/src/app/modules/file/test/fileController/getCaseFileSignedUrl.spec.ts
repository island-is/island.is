import { uuid } from 'uuidv4'

import { NotFoundException } from '@nestjs/common'

import { createTestingFileModule } from '../createTestingFileModule'

import { AwsS3Service } from '../../../aws-s3'
import { CaseFile } from '../../models/file.model'
import { SignedUrl } from '../../models/signedUrl.model'

interface Then {
  result: SignedUrl
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  fileId: string,
  caseFile: CaseFile,
) => Promise<Then>

describe('FileController - Get case file signed url', () => {
  let mockAwsS3Service: AwsS3Service
  let mockFileModel: typeof CaseFile
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, fileModel, fileController } =
      await createTestingFileModule()

    mockAwsS3Service = awsS3Service
    mockFileModel = fileModel

    givenWhenThen = async (
      caseId: string,
      fileId: string,
      caseFile: CaseFile,
    ): Promise<Then> => {
      const then = {} as Then

      await fileController
        .getCaseFileSignedUrl(caseId, fileId, caseFile)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('AWS S3 existance check', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `uploads/${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    let mockObjectExists: jest.Mock

    beforeEach(async () => {
      mockObjectExists = mockAwsS3Service.objectExists as jest.Mock

      await givenWhenThen(caseId, fileId, caseFile)
    })

    it('should check if the file exists in AWS S3', () => {
      expect(mockObjectExists).toHaveBeenCalledWith(key)
    })
  })

  describe('AWS S3 get signed url', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `uploads/${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    let mockGetSignedUrl: jest.Mock

    beforeEach(async () => {
      mockGetSignedUrl = mockAwsS3Service.getSignedUrl as jest.Mock
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)

      await givenWhenThen(caseId, fileId, caseFile)
    })

    it('should get signed url from AWS S3', () => {
      expect(mockGetSignedUrl).toHaveBeenCalledWith(key)
    })
  })

  describe('signed url created', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `uploads/${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    const signedUrl = {} as SignedUrl
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetSignedUrl = mockAwsS3Service.getSignedUrl as jest.Mock
      mockGetSignedUrl.mockResolvedValueOnce(signedUrl)

      then = await givenWhenThen(caseId, fileId, caseFile)
    })

    it('should return the signed url', () => {
      expect(then.result).toBe(signedUrl)
    })
  })

  describe('file not stored in AWS S3', () => {
    const caseId = uuid()
    const fileId = uuid()
    const caseFile = { id: fileId } as CaseFile
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, fileId, caseFile)
    })

    it('should throw not found exceptoin', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `File ${fileId} does not exists in AWS S3`,
      )
    })
  })

  describe('file not found in AWS S3', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `uploads/${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    let mockUpdate: jest.Mock
    let then: Then

    beforeEach(async () => {
      mockUpdate = mockFileModel.update as jest.Mock
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(false)

      then = await givenWhenThen(caseId, fileId, caseFile)
    })

    it('should remove the key', () => {
      expect(mockUpdate).toHaveBeenCalledWith(
        { key: null },
        { where: { id: fileId } },
      )
    })

    it('should throw not found exceptoin', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `File ${fileId} does not exists in AWS S3`,
      )
    })
  })

  describe('remote existance check fails', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `uploads/${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, fileId, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('signed url creation fails', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `uploads/${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetSignedUrl = mockAwsS3Service.getSignedUrl as jest.Mock
      mockGetSignedUrl.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, fileId, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
