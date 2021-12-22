import { firstDateOfMonth } from '@island.is/financial-aid/shared/lib'
import { NotFoundException } from '@nestjs/common'
import { Op } from 'sequelize'
import { ApplicationModel } from '../models/application.model'
import { createTestingApplicationModule } from './createTestingApplicationModule'

interface Then {
  result: string
  error: Error
}

type GivenWhenThen = (nationalId: string) => Promise<Then>

describe('ApplicationController - Get current application', () => {
  let givenWhenThen: GivenWhenThen
  let mockApplicationModel: typeof ApplicationModel

  beforeEach(async () => {
    const {
      applicationController,
      applicationModel,
    } = await createTestingApplicationModule()

    mockApplicationModel = applicationModel

    givenWhenThen = async (nationalId: string): Promise<Then> => {
      const then = {} as Then

      await applicationController
        .getCurrentApplication(nationalId)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const nationalId = '0000000000'
    let mockGetCurrentApplication: jest.Mock

    beforeEach(async () => {
      mockGetCurrentApplication = mockApplicationModel.findOne as jest.Mock

      await givenWhenThen(nationalId)
    })

    it('should request staff by national id from the database', () => {
      expect(mockGetCurrentApplication).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            {
              nationalId,
            },
            {
              spouseNationalId: nationalId,
            },
          ],
          created: { [Op.gte]: firstDateOfMonth() },
        },
      })
    })
  })

  describe('no application found', () => {
    let then: Then
    const nationalId = '0000000000'

    beforeEach(async () => {
      const mockFindById = mockApplicationModel.findOne as jest.Mock
      mockFindById.mockReturnValueOnce(null)

      then = await givenWhenThen(nationalId)
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })

  describe('application found', () => {
    let then: Then
    const nationalId = '0000000000'
    const applicationId = uuid()
    const application = { id: applicationId } as ApplicationModel

    beforeEach(async () => {
      const mockFindById = mockApplicationModel.findOne as jest.Mock
      mockFindById.mockReturnValueOnce(application)

      then = await givenWhenThen(nationalId)
    })

    it('should return application id', () => {
      expect(then.result).toEqual(applicationId)
    })
  })

  describe('database query fails', () => {
    let then: Then
    const nationalId = '0000000000'

    beforeEach(async () => {
      const mockFindById = mockApplicationModel.findOne as jest.Mock
      mockFindById.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(nationalId)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
