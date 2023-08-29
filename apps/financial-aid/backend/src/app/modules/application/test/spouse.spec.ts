import { User } from '@island.is/auth-nest-tools'
import { firstDateOfMonth } from '@island.is/financial-aid/shared/lib'
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

type GivenWhenThen = (user: User) => Promise<Then>

describe('ApplicationController - Spouse', () => {
  let givenWhenThen: GivenWhenThen
  let mockApplicationModel: typeof ApplicationModel
  let mockFileService: FileService

  beforeEach(async () => {
    const { applicationController, applicationModel, fileService } =
      await createTestingApplicationModule()

    mockApplicationModel = applicationModel
    mockFileService = fileService

    givenWhenThen = async (user: User): Promise<Then> => {
      const then = {} as Then

      await applicationController
        .spouse(user)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const user = { nationalId: '0000000000' } as User
    let mockSpouse: jest.Mock

    beforeEach(async () => {
      mockSpouse = mockApplicationModel.findOne as jest.Mock

      await givenWhenThen(user)
    })

    it('should request spouse by spouse national id from the database', () => {
      expect(mockSpouse).toHaveBeenCalledWith({
        where: {
          spouseNationalId: user.nationalId,
          created: { [Op.gte]: firstDateOfMonth() },
        },
      })
    })
  })

  describe('not found', () => {
    let then: Then
    const user = { nationalId: '0000000000' } as User
    const expected: SpouseResponse = {
      hasPartnerApplied: false,
      hasFiles: false,
      applicantName: '',
      applicantSpouseEmail: '',
    }

    beforeEach(async () => {
      const mockSpouse = mockApplicationModel.findOne as jest.Mock
      mockSpouse.mockReturnValueOnce(null)

      then = await givenWhenThen(user)
    })

    it('should return default spouse object', () => {
      expect(then.result).toEqual(expected)
    })
  })

  describe('found', () => {
    let then: Then
    const user = { nationalId: '0000000000' } as User
    const spouse: SpouseResponse = {
      hasPartnerApplied: true,
      hasFiles: true,
      applicantName: 'Name',
      applicantSpouseEmail: 'test@test.is',
    }

    beforeEach(async () => {
      const mockSpouse = mockApplicationModel.findOne as jest.Mock
      mockSpouse.mockReturnValueOnce({
        id: uuid(),
        name: spouse.applicantName,
        spouseEmail: spouse.applicantSpouseEmail,
      } as ApplicationModel)
      const mockFiles = mockFileService.getApplicationFilesByType as jest.Mock
      mockFiles.mockReturnValueOnce({} as ApplicationFileModel)

      then = await givenWhenThen(user)
    })

    it('should return spouse', () => {
      expect(then.result).toEqual(spouse)
    })
  })

  describe('found with no files', () => {
    let then: Then
    const user = { nationalId: '0000000000' } as User
    const spouse: SpouseResponse = {
      hasPartnerApplied: true,
      hasFiles: false,
      applicantName: 'Name',
      applicantSpouseEmail: 'test@test.is',
    }

    beforeEach(async () => {
      const mockSpouse = mockApplicationModel.findOne as jest.Mock
      mockSpouse.mockReturnValueOnce({
        id: uuid(),
        name: spouse.applicantName,
        spouseEmail: spouse.applicantSpouseEmail,
      } as ApplicationModel)
      const mockFiles = mockFileService.getApplicationFilesByType as jest.Mock
      mockFiles.mockReturnValueOnce(undefined)

      then = await givenWhenThen(user)
    })

    it('should return expected spouse', () => {
      expect(then.result).toEqual(spouse)
    })
  })

  describe('database query fails', () => {
    let then: Then
    const user = { nationalId: '0000000000' } as User

    beforeEach(async () => {
      const mockSpouse = mockApplicationModel.findOne as jest.Mock
      mockSpouse.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(user)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
