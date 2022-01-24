import { StaffModel } from '../models/staff.model'
import { uuid } from 'uuidv4'

import { createTestingStaffModule } from './createTestingStaffModule'
import { StaffRole } from '@island.is/financial-aid/shared/lib'
import { ForbiddenException } from '@nestjs/common'

interface Then {
  result: StaffModel
  error: Error
}

type GivenWhenThen = (user: StaffModel) => Promise<Then>

describe('StaffController - Get staff by national id', () => {
  let mockStaffModel: typeof StaffModel
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { staffModel, staffController } = await createTestingStaffModule()

    mockStaffModel = staffModel

    givenWhenThen = async (user: StaffModel): Promise<Then> => {
      const then = {} as Then

      await staffController
        .getStaffByNationalId(user)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const user = { nationalId: '0000000000' } as StaffModel
    let mockFindByNationalId: jest.Mock

    beforeEach(async () => {
      mockFindByNationalId = mockStaffModel.findOne as jest.Mock

      await givenWhenThen(user)
    })

    it('should request staff by national id from the database', () => {
      expect(mockFindByNationalId).toHaveBeenCalledWith({
        where: {
          nationalId: user.nationalId,
        },
      })
    })
  })

  describe('staff not active', () => {
    const user = { nationalId: '0000000000' } as StaffModel
    const staff = {
      id: uuid(),
      name: 'Staff Tester',
      nationalId: user.nationalId,
      municipalityId: '0',
      municipalityName: 'Someplace',
      roles: [StaffRole.EMPLOYEE],
      active: false,
    } as StaffModel
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockStaffModel.findOne as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce(staff)

      then = await givenWhenThen(user)
    })

    it('should throw forbidden exception', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('staff not found', () => {
    const user = { nationalId: '0000000000' } as StaffModel
    const staff = null
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockStaffModel.findOne as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce(staff)

      then = await givenWhenThen(user)
    })

    it('should throw forbidden exception', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('staff found', () => {
    const user = { nationalId: '0000000000' } as StaffModel
    const staff = {
      id: uuid(),
      name: 'Staff Tester',
      nationalId: user.nationalId,
      municipalityId: '0',
      municipalityName: 'Someplace',
      roles: [StaffRole.EMPLOYEE],
      active: true,
    } as StaffModel
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockStaffModel.findOne as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce(staff)

      then = await givenWhenThen(user)
    })

    it('should return staff', () => {
      expect(then.result).toEqual(staff)
    })
  })

  describe('database query fails', () => {
    const user = { nationalId: '0000000000' } as StaffModel
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockStaffModel.findOne as jest.Mock
      mockFindByNationalId.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(user)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
