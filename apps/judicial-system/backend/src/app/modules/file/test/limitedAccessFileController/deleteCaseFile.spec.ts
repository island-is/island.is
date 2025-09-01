import { uuid } from 'uuidv4'

import { CaseFileState, CaseType } from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../createTestingFileModule'

import { AwsS3Service } from '../../../aws-s3'
import { Case, CaseFile } from '../../../repository'
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
  let mockAwsS3Service: AwsS3Service
  let mockFileModel: typeof CaseFile
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { awsS3Service, fileModel, limitedAccessFileController } =
      await createTestingFileModule()

    mockAwsS3Service = awsS3Service
    mockFileModel = fileModel

    const mockDeleteObject = mockAwsS3Service.deleteObject as jest.Mock
    mockDeleteObject.mockRejectedValue(new Error('Some Error'))

    givenWhenThen = async (
      caseId: string,
      theCase: Case,
      fileId: string,
      caseFile: CaseFile,
    ): Promise<Then> => {
      const then = {} as Then

      await limitedAccessFileController
        .deleteCaseFile(caseId, theCase, fileId, caseFile)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('case file deleted', () => {
    const caseId = uuid()
    const caseType = CaseType.RESTRAINING_ORDER
    const theCase = { id: caseId, type: caseType } as Case
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should update the case file status in the database', () => {
      expect(mockFileModel.update).toHaveBeenCalledWith(
        { state: CaseFileState.DELETED, key: null },
        { where: { id: fileId } },
      )
      expect(mockAwsS3Service.deleteObject).toHaveBeenCalledWith(caseType, key)
      expect(then.result).toEqual({ success: true })
    })
  })

  describe('AWS S3 removal skipped', () => {
    const caseId = uuid()
    const caseType = CaseType.CUSTODY
    const theCase = { id: caseId, type: caseType } as Case
    const fileId = uuid()
    const caseFile = { id: fileId } as CaseFile

    beforeEach(async () => {
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])

      await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should not attempt to remove from AWS S3', () => {
      expect(mockAwsS3Service.deleteObject).not.toHaveBeenCalled()
    })
  })

  describe('case file not deleted', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = { id: fileId } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([0])

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should return failure', () => {
      expect(then.result).toEqual({ success: false })
    })
  })

  describe('database update fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const caseFile = { id: fileId } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
