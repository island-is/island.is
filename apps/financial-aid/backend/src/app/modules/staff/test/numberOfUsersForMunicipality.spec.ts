import { StaffModel } from '../models/staff.model'
import { uuid } from 'uuidv4'

import { createTestingStaffModule } from './createTestingStaffModule'
import { Op } from 'sequelize'
import { StaffRole } from '@island.is/financial-aid/shared/lib'

interface Then {
  result: number
  error: Error
}

type GivenWhenThen = (municipalityId: string) => Promise<Then>

describe('StaffController - Get number of users for municipality', () => {
  let mockStaffModel: typeof StaffModel
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { staffModel, staffController } = await createTestingStaffModule()

    mockStaffModel = staffModel

    givenWhenThen = async (municipalityId: string): Promise<Then> => {
      const then = {} as Then

      await staffController
        .numberOfUsersForMunicipality(municipalityId)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const municipalityId = uuid()
    let mockNumberOfUsers: jest.Mock

    beforeEach(async () => {
      mockNumberOfUsers = mockStaffModel.count as jest.Mock

      await givenWhenThen(municipalityId)
    })

    it('should run database query', () => {
      expect(mockNumberOfUsers).toHaveBeenCalledWith({
        where: {
          municipalityIds: { [Op.contains]: [municipalityId] },
          roles: { [Op.contains]: [StaffRole.ADMIN] },
        },
      })
    })
  })

  describe('count users for municipality', () => {
    const municipalityId = uuid()
    const result = 10
    let then: Then

    beforeEach(async () => {
      const mockNumberOfUsers = mockStaffModel.count as jest.Mock
      mockNumberOfUsers.mockResolvedValueOnce(result)

      then = await givenWhenThen(municipalityId)
    })

    it('should return correct count', () => {
      expect(then.result).toBe(result)
    })
  })

  describe('database query fails', () => {
    const municipalityId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockNumberOfUsers = mockStaffModel.count as jest.Mock
      mockNumberOfUsers.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(municipalityId)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
