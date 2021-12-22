import { StaffModel } from '../models/staff.model'
import { uuid } from 'uuidv4'

import { createTestingStaffModule } from './createTestingStaffModule'
import { StaffRole } from '@island.is/financial-aid/shared/lib'
import { ForbiddenException } from '@nestjs/common'

interface Then {
  result: StaffModel
  error: Error
}

type GivenWhenThen = (nationalId: string) => Promise<Then>

describe('StaffController - Get staff by national id', () => {
  let mockStaffModel: typeof StaffModel
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { staffModel, staffController } = await createTestingStaffModule()

    mockStaffModel = staffModel

    givenWhenThen = async (nationalId: string): Promise<Then> => {
      const then = {} as Then

      await staffController
        .getStaffByNationalId(nationalId)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const nationalId = '0000000000'
    let mockFindByNationalId: jest.Mock

    beforeEach(async () => {
      mockFindByNationalId = mockStaffModel.findOne as jest.Mock

      await givenWhenThen(nationalId)
    })

    it('should request staff by national id from the database', () => {
      expect(mockFindByNationalId).toHaveBeenCalledWith({
        where: {
          nationalId,
        },
      })
    })
  })

  describe('staff not active', () => {
    const nationalId = '0000000000'
    const staff = {
      id: uuid(),
      name: 'Staff Tester',
      nationalId,
      municipalityId: '0',
      municipalityName: 'Someplace',
      roles: [StaffRole.EMPLOYEE],
      active: false,
    } as StaffModel
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockStaffModel.findOne as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce(staff)

      then = await givenWhenThen(nationalId)
    })

    it('should throw forbidden exception', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('staff not found', () => {
    const nationalId = '0000000000'
    const staff = null
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockStaffModel.findOne as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce(staff)

      then = await givenWhenThen(nationalId)
    })

    it('should throw forbidden exception', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('staff found', () => {
    const nationalId = '0000000000'
    const staff = {
      id: uuid(),
      name: 'Staff Tester',
      nationalId,
      municipalityId: '0',
      municipalityName: 'Someplace',
      roles: [StaffRole.EMPLOYEE],
      active: true,
    } as StaffModel
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockStaffModel.findOne as jest.Mock
      mockFindByNationalId.mockResolvedValueOnce(staff)

      then = await givenWhenThen(nationalId)
    })

    it('should return staff', () => {
      expect(then.result).toEqual(staff)
    })
  })

  describe('database query fails', () => {
    const nationalId = '0000000000'
    let then: Then

    beforeEach(async () => {
      const mockFindByNationalId = mockStaffModel.findOne as jest.Mock
      mockFindByNationalId.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(nationalId)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
