import { User } from '@island.is/auth-nest-tools'
import { firstDateOfMonth } from '@island.is/financial-aid/shared/lib'
import { NotFoundException } from '@nestjs/common'
import { Op } from 'sequelize'
import { uuid } from 'uuidv4'
import { ApplicationModel } from '../models/application.model'
import { createTestingApplicationModule } from './createTestingApplicationModule'

interface Then {
  result: string
  error: Error
}

type GivenWhenThen = (user: User) => Promise<Then>

describe('ApplicationController - Get current application', () => {
  let givenWhenThen: GivenWhenThen
  let mockApplicationModel: typeof ApplicationModel

  beforeEach(async () => {
    const { applicationController, applicationModel } =
      await createTestingApplicationModule()

    mockApplicationModel = applicationModel

    givenWhenThen = async (user: User): Promise<Then> => {
      const then = {} as Then

      await applicationController
        .getCurrentApplication(user)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const user = { nationalId: '0000000000' } as User
    let mockGetCurrentApplication: jest.Mock

    beforeEach(async () => {
      mockGetCurrentApplication = mockApplicationModel.findOne as jest.Mock

      await givenWhenThen(user)
    })

    it('should request staff by national id from the database', () => {
      expect(mockGetCurrentApplication).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            {
              nationalId: user.nationalId,
            },
            {
              spouseNationalId: user.nationalId,
            },
          ],
          created: { [Op.gte]: firstDateOfMonth() },
        },
      })
    })
  })

  describe('no application found', () => {
    let then: Then
    const user = { nationalId: '0000000000' } as User

    beforeEach(async () => {
      const mockFindById = mockApplicationModel.findOne as jest.Mock
      mockFindById.mockReturnValueOnce(null)

      then = await givenWhenThen(user)
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })

  describe('application found', () => {
    let then: Then
    const user = { nationalId: '0000000000' } as User
    const applicationId = uuid()
    const application = { id: applicationId } as ApplicationModel

    beforeEach(async () => {
      const mockFindById = mockApplicationModel.findOne as jest.Mock
      mockFindById.mockReturnValueOnce(application)

      then = await givenWhenThen(user)
    })

    it('should return application id', () => {
      expect(then.result).toEqual(applicationId)
    })
  })

  describe('database query fails', () => {
    let then: Then
    const user = { nationalId: '0000000000' } as User

    beforeEach(async () => {
      const mockFindById = mockApplicationModel.findOne as jest.Mock
      mockFindById.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(user)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
