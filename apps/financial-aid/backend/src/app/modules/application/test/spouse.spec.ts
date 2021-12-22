import { firstDateOfMonth } from '@island.is/financial-aid/shared/lib'
import { NotFoundException } from '@nestjs/common'
import { Op } from 'sequelize'
import { uuid } from 'uuidv4'
import { FileService } from '../../file'
import { ApplicationFileModel } from '../../file/models/file.model'
import { ApplicationModel } from '../models/application.model'
import { SpouseResponse } from '../models/spouse.response'
import { createTestingApplicationModule } from './createTestingApplicationModule'

interface Then {
  result: SpouseResponse
  error: Error
}

type GivenWhenThen = (spouseNationalId: string) => Promise<Then>

describe('ApplicationController - Spouse', () => {
  let givenWhenThen: GivenWhenThen
  let mockApplicationModel: typeof ApplicationModel
  let mockFileService: FileService

  beforeEach(async () => {
    const {
      applicationController,
      applicationModel,
      fileService,
    } = await createTestingApplicationModule()

    mockApplicationModel = applicationModel
    mockFileService = fileService

    givenWhenThen = async (spouseNationalId: string): Promise<Then> => {
      const then = {} as Then

      await applicationController
        .spouse(spouseNationalId)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const spouseNationalId = '0000000000'
    let mockSpouse: jest.Mock

    beforeEach(async () => {
      mockSpouse = mockApplicationModel.findOne as jest.Mock

      await givenWhenThen(spouseNationalId)
    })

    it('should request spouse by spouse national id from the database', () => {
      expect(mockSpouse).toHaveBeenCalledWith({
        where: {
          spouseNationalId,
          created: { [Op.gte]: firstDateOfMonth() },
        },
      })
    })
  })

  describe('not found', () => {
    let then: Then
    const spouseNationalId = '0000000000'
    const expected: SpouseResponse = {
      hasPartnerApplied: false,
      hasFiles: false,
      spouseName: '',
    }

    beforeEach(async () => {
      const mockSpouse = mockApplicationModel.findOne as jest.Mock
      mockSpouse.mockReturnValueOnce(null)

      then = await givenWhenThen(spouseNationalId)
    })

    it('should return default spouse object', () => {
      expect(then.result).toEqual(expected)
    })
  })

  describe('found', () => {
    let then: Then
    const spouseNationalId = '0000000000'
    const spouse: SpouseResponse = {
      hasPartnerApplied: true,
      hasFiles: true,
      spouseName: 'Name',
    }

    beforeEach(async () => {
      const mockSpouse = mockApplicationModel.findOne as jest.Mock
      mockSpouse.mockReturnValueOnce({
        id: uuid(),
        name: spouse.spouseName,
      } as ApplicationModel)
      const mockFiles = mockFileService.getApplicationFilesByType as jest.Mock
      mockFiles.mockReturnValueOnce({} as ApplicationFileModel)

      then = await givenWhenThen(spouseNationalId)
    })

    it('should return spouse', () => {
      expect(then.result).toEqual(spouse)
    })
  })

  describe('found with no files', () => {
    let then: Then
    const spouseNationalId = '0000000000'
    const spouse: SpouseResponse = {
      hasPartnerApplied: true,
      hasFiles: false,
      spouseName: 'Name',
    }

    beforeEach(async () => {
      const mockSpouse = mockApplicationModel.findOne as jest.Mock
      mockSpouse.mockReturnValueOnce({
        id: uuid(),
        name: spouse.spouseName,
      } as ApplicationModel)
      const mockFiles = mockFileService.getApplicationFilesByType as jest.Mock
      mockFiles.mockReturnValueOnce(undefined)

      then = await givenWhenThen(spouseNationalId)
    })

    it('should return expected spouse', () => {
      expect(then.result).toEqual(spouse)
    })
  })

  describe('database query fails', () => {
    let then: Then
    const spouseNationalId = '0000000000'

    beforeEach(async () => {
      const mockSpouse = mockApplicationModel.findOne as jest.Mock
      mockSpouse.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(spouseNationalId)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
