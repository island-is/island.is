import { uuid } from 'uuidv4'

import { CaseFileState } from '@island.is/judicial-system/types'

import { Case } from '../../case'
import { AwsS3Service } from '../awsS3.service'
import { CaseFile, UploadFileToCourtResponse } from '../models'
import { createTestingFileModule } from './createTestingFileModule'

interface Then {
  result: UploadFileToCourtResponse
  error: Error
}

type GivenWhenThen = (theCase: Case, caseFile: CaseFile) => Promise<Then>

describe('FileController - Upload case file to court', () => {
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
      theCase: Case,
      caseFile: CaseFile,
    ): Promise<Then> => {
      const then = {} as Then

      await fileController
        .uploadCaseFileToCourt(theCase, caseFile)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('AWS S3 existance check', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    const caseFile = {
      id: fileId,
      state: CaseFileState.STORED_IN_RVG,
      key,
    } as CaseFile
    let mockObjectExists: jest.Mock

    beforeEach(async () => {
      mockObjectExists = mockAwsS3Service.objectExists as jest.Mock

      await givenWhenThen(theCase, caseFile)
    })

    it('should check if the file exists in AWS S3', () => {
      expect(mockObjectExists).toHaveBeenCalledWith(key)
    })
  })

  describe('AWS S3 get file', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    const caseFile = {
      id: fileId,
      state: CaseFileState.STORED_IN_RVG,
      key,
    } as CaseFile
    let mockGetObject: jest.Mock

    beforeEach(async () => {
      mockGetObject = mockAwsS3Service.getObject as jest.Mock
      const mockObjectExists = mockAwsS3Service.objectExists as jest.Mock
      mockObjectExists.mockResolvedValueOnce(true)

      await givenWhenThen(theCase, caseFile)
    })

    it('should get the file from AWS S3', () => {
      expect(mockGetObject).toHaveBeenCalledWith(key)
    })
  })
})
