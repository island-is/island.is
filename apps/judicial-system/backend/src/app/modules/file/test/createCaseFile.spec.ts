import { uuid } from 'uuidv4'

import { BadRequestException } from '@nestjs/common'

import { Case } from '../../case'
import { CreateFileDto } from '../dto'
import { CaseFile } from '../models'
import { createTestingFileModule } from './createTestingFileModule'

interface Then {
  result: CaseFile
  error: Error
}

type GivenWhenThen = (
  caseId: string,
  createCaseFile: CreateFileDto,
) => Promise<Then>

describe('FileController - Create case file', () => {
  let mockFileModel: typeof CaseFile
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { fileModel, fileController } = await createTestingFileModule()

    mockFileModel = fileModel

    givenWhenThen = async (
      caseId: string,
      createCaseFile: CreateFileDto,
    ): Promise<Then> => {
      const then = {} as Then

      await fileController
        .createCaseFile(caseId, createCaseFile)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database insert', () => {
    const caseId = uuid()
    const uuId = uuid()
    const createCaseFile: CreateFileDto = {
      type: 'text/plain',
      key: `${caseId}/${uuId}/test.txt`,
      size: 99,
    }
    let mockCreate: jest.Mock

    beforeEach(async () => {
      mockCreate = mockFileModel.create as jest.Mock

      await givenWhenThen(caseId, createCaseFile)
    })

    it('should create a case file in the database', () => {
      expect(mockCreate).toHaveBeenCalledWith({
        type: 'text/plain',
        key: `${caseId}/${uuId}/test.txt`,
        size: 99,
        caseId,
        name: 'test.txt',
      })
    })
  })

  describe('case file created', () => {
    const caseId = uuid()
    const uuId = uuid()
    const createCaseFile: CreateFileDto = {
      type: 'text/plain',
      key: `${caseId}/${uuId}/test.txt`,
      size: 99,
    }
    const fileId = uuid()
    const timeStamp = new Date()
    const caseFile = {
      type: 'text/plain',
      key: `${caseId}/${uuId}/test.txt`,
      size: 99,
      id: fileId,
      created: timeStamp,
      modified: timeStamp,
    }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockFileModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(caseFile)

      then = await givenWhenThen(caseId, createCaseFile)
    })

    it('should return a case file', () => {
      expect(then.result).toBe(caseFile)
    })
  })

  describe('malformed key', () => {
    const caseId = uuid()
    const uuId = `-${uuid()}`
    const createCaseFile: CreateFileDto = {
      type: 'text/plain',
      key: `${caseId}/${uuId}/test.txt`,
      size: 99,
    }
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(caseId, createCaseFile)
    })

    it('should throw bad gateway exception', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe(
        `${caseId}/${uuId}/test.txt is not a valid key`,
      )
    })
  })

  describe('database insert fails', () => {
    const caseId = uuid()
    const uuId = uuid()
    const createCaseFile: CreateFileDto = {
      type: 'text/plain',
      key: `${caseId}/${uuId}/test.txt`,
      size: 99,
    }
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockFileModel.create as jest.Mock
      mockCreate.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(caseId, createCaseFile)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
