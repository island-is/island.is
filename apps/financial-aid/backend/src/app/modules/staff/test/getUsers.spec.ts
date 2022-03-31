import { StaffModel } from '../models/staff.model'
import { uuid } from 'uuidv4'

import { createTestingStaffModule } from './createTestingStaffModule'
import { StaffRole } from '@island.is/financial-aid/shared/lib'
import { Op } from 'sequelize'

interface Then {
  result: StaffModel[]
  error: Error
}

type GivenWhenThen = (municipalityId: string) => Promise<Then>

describe('StaffController - Get users', () => {
  let mockStaffModel: typeof StaffModel
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { staffModel, staffController } = await createTestingStaffModule()

    mockStaffModel = staffModel

    givenWhenThen = async (municipalityId: string): Promise<Then> => {
      const then = {} as Then

      await staffController
        .getUsers(municipalityId)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const municipalityId = uuid()
    let mockGetUsers: jest.Mock

    beforeEach(async () => {
      mockGetUsers = mockStaffModel.findAll as jest.Mock

      await givenWhenThen(municipalityId)
    })

    it('should run expected query', () => {
      expect(mockGetUsers).toHaveBeenCalledWith({
        where: {
          municipalityIds: { [Op.contains]: [municipalityId] },
          roles: { [Op.contains]: [StaffRole.ADMIN] },
        },
      })
    })
  })

  describe('users found', () => {
    let then: Then
    const municipalityId = uuid()

    const result = [
      {
        id: '1',
        nationalId: '0000000001',
        name: 'Test name 1',
        municipalityId: municipalityId,
        roles: [StaffRole.ADMIN],
        active: true,
        municipalityName: 'here',
      },
      {
        id: '2',
        nationalId: '0000000002',
        name: 'Test name 2',
        municipalityId: municipalityId,
        roles: [StaffRole.ADMIN],
        active: true,
        municipalityName: 'here',
      },
    ]
    let mockGetUsers: jest.Mock

    beforeEach(async () => {
      mockGetUsers = mockStaffModel.findAll as jest.Mock
      mockGetUsers.mockResolvedValueOnce(result)

      then = await givenWhenThen(municipalityId)
    })

    it('should return array of length 2', () => {
      expect(then.result.length).toBe(2)
    })

    it('should return expected result', () => {
      expect(then.result).toEqual(result)
    })
  })

  describe('no users found', () => {
    let then: Then
    const municipalityId = uuid()

    const result = []
    let mockGetUsers: jest.Mock

    beforeEach(async () => {
      mockGetUsers = mockStaffModel.findAll as jest.Mock
      mockGetUsers.mockResolvedValueOnce(result)

      then = await givenWhenThen(municipalityId)
    })

    it('should return array of length 0', () => {
      expect(then.result.length).toBe(0)
    })

    it('should return expected result', () => {
      expect(then.result).toEqual(result)
    })
  })

  describe('database query fails', () => {
    const municipalityId = uuid()
    let then: Then

    beforeEach(async () => {
      const mockGetUsers = mockStaffModel.findAll as jest.Mock
      mockGetUsers.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(municipalityId)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
