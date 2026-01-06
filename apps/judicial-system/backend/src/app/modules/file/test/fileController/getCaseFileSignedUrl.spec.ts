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
      theCase: Case,
      fileId: string,
      caseFile: CaseFile,
    ): Promise<Then> => {
      const then = {} as Then

      await fileController
        .getCaseFileSignedUrl(caseId, theCase, fileId, caseFile)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('signed url created', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    const theCase = {
      id: uuid(),
      type: CaseType.ADMISSION_TO_FACILITY,
    } as Case
    const url = `uploads/${key}`
    let then: Then

    beforeEach(async () => {
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)
      const mockGetSignedUrl = mockAwsS3Service.getSignedUrl as jest.Mock
      mockGetSignedUrl.mockResolvedValueOnce(url)

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should create a signed url', () => {
      expect(mockAwsS3Service.objectExists).toHaveBeenCalledWith(
        theCase.type,
        key,
      )
      expect(mockAwsS3Service.getSignedUrl).toHaveBeenCalledWith(
        theCase.type,
        key,
        undefined,
        false,
      )
      expect(then.result).toEqual({ url })
    })
  })

  describe('file not found in AWS S3', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    const theCase = {
      id: caseId,
      type: CaseType.INDICTMENT,
    } as Case
    let mockUpdate: jest.Mock
    let then: Then

    beforeEach(async () => {
      mockUpdate = mockFileModel.update as jest.Mock
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(false)

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should set isKeyAccessible to false and throw', () => {
      expect(mockUpdate).toHaveBeenCalledWith(
        { isKeyAccessible: false },
        { where: { id: fileId } },
      )
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(`File ${fileId} does not exist in AWS S3`)
    })
  })

  describe('signed url creation fails', () => {
    const caseId = uuid()
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
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
