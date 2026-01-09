import { v4 as uuid } from 'uuid'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { createTestingFileModule } from '../../test/createTestingFileModule'

import { CaseFile } from '../../../repository'
import { SplitCaseFileExistsGuard } from '../splitCaseFileExists.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Split Case File Exists Guard', () => {
  const mockRequest = jest.fn()
  let mockFileModel: typeof CaseFile
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { fileModel, fileService } = await createTestingFileModule()

    mockFileModel = fileModel

    givenWhenThen = async (): Promise<Then> => {
      const guard = new SplitCaseFileExistsGuard(fileService)
      const then = {} as Then

      try {
        then.result = await guard.canActivate({
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown as ExecutionContext)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('case file exists', () => {
    const caseId = uuid()
    const fileId = uuid()
    const caseFile = { id: fileId, caseId }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({
        params: { fileId },
        case: { id: caseId, caseFiles: [caseFile] },
      }))
      const mockFindOne = mockFileModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(caseFile)

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
    })
  })

  describe('case file exists in split case', () => {
    const caseId = uuid()
    const fileId = uuid()
    const caseFile = { id: fileId, caseId }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({
        params: { fileId },
        case: {
          id: caseId,
          caseFiles: [{ id: uuid() }],
          splitCases: [{ id: uuid(), caseFiles: [caseFile] }],
        },
      }))
      const mockFindOne = mockFileModel.findOne as jest.Mock
      mockFindOne.mockResolvedValueOnce(caseFile)

      then = await givenWhenThen()
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
    })
  })

  describe('case file does not exist', () => {
    const caseId = uuid()
    const fileId = uuid()
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({
        params: { fileId },
        case: {
          id: caseId,
          caseFiles: [{ id: uuid() }],
          splitCases: [{ id: uuid(), caseFiles: [{ id: uuid() }] }],
        },
      }))

      then = await givenWhenThen()
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
      expect(then.error.message).toBe(
        `Case file ${fileId} of case ${caseId} does not exist`,
      )
    })
  })

  describe('missing case id', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({ params: {} }))

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing case')
    })
  })

  describe('missing file id', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({
        params: {},
        case: { id: caseId, caseFiles: [{ id: uuid() }] },
      }))

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing file id')
    })
  })
})
