import { uuid } from 'uuidv4'

import { NotFoundException } from '@nestjs/common'

import { CaseType } from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { AwsS3Service } from '../../../aws-s3'
import { Case, CaseFile } from '../../../repository'
import { SignedUrl } from '../../models/signedUrl.model'

interface Then {
  result: SignedUrl
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  theCase: Case,
  fileId: string,
  caseFile: CaseFile,
) => Promise<Then>

describe('LimitedAccessFileController - Get case file signed url', () => {
  let mockAwsS3Service: AwsS3Service
  let mockFileModel: typeof CaseFile
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, fileModel, limitedAccessFileController } =
      await createTestingFileModule()

    mockAwsS3Service = awsS3Service
    mockFileModel = fileModel

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      fileId: string,
      caseFile: CaseFile,
    ): Promise<Then> => {
      const then = {} as Then

      await limitedAccessFileController
        .getCaseFileSignedUrl(caseId, theCase, fileId, caseFile)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('AWS S3 existance check', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    const theCase = {
      id: caseId,
      type: CaseType.INTERNET_USAGE,
    } as Case

    beforeEach(async () => {
      await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should check if the file exists in AWS S3', () => {
      expect(mockAwsS3Service.objectExists).toHaveBeenCalledWith(
        theCase.type,
        key,
      )
    })
  })

  describe('AWS S3 get signed url', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    const theCase = {
      id: uuid(),
      type: CaseType.PHONE_TAPPING,
    } as Case

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)

      await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should get signed url from AWS S3', () => {
      expect(mockAwsS3Service.getSignedUrl).toHaveBeenCalledWith(
        theCase.type,
        key,
        undefined,
        false,
      )
    })
  })

  describe('signed url created', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    const theCase = {} as Case

    const url = uuid()
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetSignedUrl = mockAwsS3Service.getSignedUrl as jest.Mock
      mockGetSignedUrl.mockResolvedValueOnce(url)

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should return the signed url', () => {
      expect(then.result).toEqual({ url })
    })
  })

  describe('file not stored in AWS S3', () => {
    const caseId = uuid()
    const fileId = uuid()
    const caseFile = { id: fileId } as CaseFile
    const theCase = {} as Case

    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should throw not found exceptoin', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(`File ${fileId} does not exist in AWS S3`)
    })
  })

  describe('file not found in AWS S3', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    const theCase = {} as Case
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(false)

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should remove the key', () => {
      expect(mockFileModel.update).toHaveBeenCalledWith(
        { key: null },
        { where: { id: fileId } },
      )
    })

    it('should throw not found exceptoin', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(`File ${fileId} does not exist in AWS S3`)
    })
  })

  describe('remote existance check fails', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    const theCase = {} as Case

    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('signed url creation fails', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    const theCase = {} as Case

    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetSignedUrl = mockAwsS3Service.getSignedUrl as jest.Mock
      mockGetSignedUrl.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
