import { Staff } from '@island.is/financial-aid/shared/lib'
import { Op } from 'sequelize'
import { ApplicationModel } from '../models/application.model'
import { createTestingApplicationModule } from './createTestingApplicationModule'
import type { User } from '@island.is/auth-nest-tools'
import { ApplicationFileModel } from '../../file/models/file.model'

interface Then {
  result: ApplicationModel[]
  error: Error
}

type GivenWhenThen = (
  nationalId: string,
  staff: Staff,
  user: User,
) => Promise<Then>

describe('ApplicationController - find application', () => {
  let givenWhenThen: GivenWhenThen
  let mockApplicationModel: typeof ApplicationModel

  beforeEach(async () => {
    const { applicationController, applicationModel } =
      await createTestingApplicationModule()

    mockApplicationModel = applicationModel

    givenWhenThen = async (
      nationalId: string,
      staff: Staff,
      user: User,
    ): Promise<Then> => {
      const then = {} as Then

      await applicationController
        .findApplication(nationalId, staff, user)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const nationalId = '0000000000'
    const municipalityCodes = ['0']
    const staff = { municipalityIds: municipalityCodes } as Staff
    const user = {} as User
    let mockFindApplication: jest.Mock

    beforeEach(async () => {
      mockFindApplication = mockApplicationModel.findAll as jest.Mock

      await givenWhenThen(nationalId, staff, user)
    })

    it('should request staff by national id and municipality code from the database', () => {
      expect(mockFindApplication).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            {
              nationalId,
              municipalityCode: { [Op.in]: municipalityCodes },
            },
            {
              spouseNationalId: nationalId,
              municipalityCode: { [Op.in]: municipalityCodes },
            },
          ],
        },
        order: [['modified', 'DESC']],
        include: [
          {
            model: ApplicationFileModel,
            as: 'files',
            separate: true,
            order: [['created', 'DESC']],
          },
        ],
      })
    })
  })

  describe('no application found', () => {
    let then: Then
    const nationalId = '0000000000'
    const municipalityCode = '0'
    const staff = { municipalityIds: [municipalityCode] } as Staff
    const user = {} as User
    const expected = []

    beforeEach(async () => {
      const mockFindApplication = mockApplicationModel.findAll as jest.Mock
      mockFindApplication.mockReturnValueOnce(expected)

      then = await givenWhenThen(nationalId, staff, user)
    })

    it('should return empty array', () => {
      expect(then.result.length).toBe(0)
    })

    it('should return expected array', () => {
      expect(then.result).toBe(expected)
    })
  })

  describe('applications found', () => {
    let then: Then
    const nationalId = '0000000000'
    const municipalityCode = '0'
    const staff = { municipalityIds: [municipalityCode] } as Staff
    const user = {} as User
    const expected = [
      { id: '1' } as ApplicationModel,
      { id: '2' } as ApplicationModel,
    ]

    beforeEach(async () => {
      const mockFindApplication = mockApplicationModel.findAll as jest.Mock
      mockFindApplication.mockReturnValueOnce(expected)

      then = await givenWhenThen(nationalId, staff, user)
    })

    it('should return array of length 2', () => {
      expect(then.result.length).toBe(2)
    })

    it('should return expected array', () => {
      expect(then.result).toBe(expected)
    })
  })

  describe('database query fails', () => {
    let then: Then
    const nationalId = '0000000000'
    const municipalityCode = '0'
    const staff = { municipalityIds: [municipalityCode] } as Staff
    const user = {} as User

    beforeEach(async () => {
      const mockFindApplication = mockApplicationModel.findAll as jest.Mock
      mockFindApplication.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(nationalId, staff, user)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
