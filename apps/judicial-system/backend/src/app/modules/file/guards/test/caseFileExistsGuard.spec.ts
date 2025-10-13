import { Op } from 'sequelize'
import { uuid } from 'uuidv4'

import {
  BadRequestException,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common'

import { CaseFileState } from '@island.is/judicial-system/types'

import { createTestingFileModule } from '../../test/createTestingFileModule'

import { CaseFile } from '../../../repository'
import { CaseFileExistsGuard } from '../caseFileExists.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('Case File Exists Guard', () => {
  const mockRequest = jest.fn()
  let mockFileModel: typeof CaseFile
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { fileModel, fileService } = await createTestingFileModule()

    mockFileModel = fileModel

    givenWhenThen = async (): Promise<Then> => {
      const guard = new CaseFileExistsGuard(fileService)
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

  describe('database lookup', () => {
    const caseId = uuid()
    const fileId = uuid()

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({ params: { caseId, fileId } }))

      await givenWhenThen()
    })

    it('should query the database', () => {
      expect(mockFileModel.findOne).toHaveBeenCalledWith({
        where: {
          id: fileId,
          caseId,
          state: { [Op.not]: CaseFileState.DELETED },
        },
      })
    })
  })

  describe('case file exists', () => {
    const caseId = uuid()
    const fileId = uuid()
    const caseFile = { id: fileId, caseId }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({ params: { caseId, fileId } }))
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
      mockRequest.mockImplementationOnce(() => ({ params: { caseId, fileId } }))

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
      expect(then.error.message).toBe('Missing case id')
    })
  })

  describe('missing file id', () => {
    const caseId = uuid()
    let then: Then

    beforeEach(async () => {
      mockRequest.mockImplementationOnce(() => ({ params: { caseId } }))

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing file id')
    })
  })
})
