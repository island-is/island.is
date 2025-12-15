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
      theCase: Case,
      fileId: string,
      caseFile: CaseFile,
    ): Promise<Then> => {
      const then = {} as Then

      await fileController
        .deleteCaseFile(caseId, theCase, fileId, caseFile)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database update', () => {
    const caseId = uuid()
    const caseType = CaseType.INDICTMENT
    const theCase = { id: caseId, type: caseType } as Case
    const fileId = uuid()
    const key = `${uuid()}/${uuid()}/test.txt`
    const caseFile = { id: fileId, key, isKeyAccessible: true } as CaseFile
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])

      then = await givenWhenThen(caseId, theCase, fileId, caseFile)
    })

    it('should delete the case file', () => {
      expect(mockFileModel.update).toHaveBeenCalledWith(
        { state: CaseFileState.DELETED, isKeyAccessible: false },
        { where: { id: fileId } },
      )
      expect(then.result).toEqual({ success: true })
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
