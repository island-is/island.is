import { Op } from 'sequelize'
import { uuid } from 'uuidv4'

import { NotFoundException } from '@nestjs/common'

import { CaseFileState } from '@island.is/judicial-system/types'

import { Case } from '../../case'
import { AwsS3Service } from '../awsS3.service'
import { CaseFile, DeleteFileResponse } from '../models'
import { createTestingFileModule } from './createTestingFileModule'

interface Then {
  result: DeleteFileResponse
  error: Error
}

type GivenWhenThen = (theCase: Case, fileId: string) => Promise<Then>

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

    givenWhenThen = async (theCase: Case, fileId: string): Promise<Then> => {
      const then = {} as Then

      await fileController
        .deleteCaseFile(theCase, fileId)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    let mockFindOne: jest.Mock

    beforeEach(async () => {
      mockFindOne = mockFileModel.findOne as jest.Mock

      await givenWhenThen(theCase, fileId)
    })

    it('should request the case file from the database', () => {
      expect(mockFindOne).toHaveBeenCalledWith({
        where: {
          id: fileId,
          caseId,
          state: { [Op.not]: CaseFileState.DELETED },
        },
      })
    })
  })

  describe('database update', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    let mockUpdate: jest.Mock

    beforeEach(async () => {
      mockUpdate = mockFileModel.update as jest.Mock
      const mockFindOne = mockFileModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce({ id: fileId, caseId })

      await givenWhenThen(theCase, fileId)
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
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    const key = `${caseId}/${uuid()}/test.txt`
    let mockDeleteObject: jest.Mock

    beforeEach(async () => {
      mockDeleteObject = mockAwsS3Service.deleteObject as jest.Mock
      const mockFindOne = mockFileModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce({
        id: fileId,
        caseId,
        state: CaseFileState.STORED_IN_RVG,
        key,
      })
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])

      await givenWhenThen(theCase, fileId)
    })

    it('should attempt to remove from AWS S3', () => {
      expect(mockDeleteObject).toHaveBeenCalledWith(key)
    })
  })

  describe('case file deleted', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFindOne = mockFileModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce({ id: fileId, caseId })
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1])

      then = await givenWhenThen(theCase, fileId)
    })

    it('should return success', () => {
      expect(then.result).toEqual({ success: true })
    })
  })

  describe('case file not deleted', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFindOne = mockFileModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce({ id: fileId, caseId })
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([0])

      then = await givenWhenThen(theCase, fileId)
    })

    it('should return failure', () => {
      expect(then.result).toEqual({ success: false })
    })
  })

  describe('case file does not exist', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(theCase, fileId)
    })

    it('should throw not found exception', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `File ${fileId} of case ${caseId} does not exist`,
      )
    })
  })

  describe('database query fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFindOne = mockFileModel.findOne as jest.Mock
      mockFindOne.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(theCase, fileId)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })

  describe('database update fails', () => {
    const caseId = uuid()
    const theCase = { id: caseId } as Case
    const fileId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFindOne = mockFileModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce({ id: fileId, caseId })
      const mockUpdate = mockFileModel.update as jest.Mock
      mockUpdate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(theCase, fileId)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
