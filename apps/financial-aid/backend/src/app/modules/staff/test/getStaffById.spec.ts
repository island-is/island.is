import { StaffModel } from '../models/staff.model'
import { uuid } from 'uuidv4'

import { createTestingStaffModule } from './createTestingStaffModule'
import { NotFoundException } from '@nestjs/common'
import { StaffRole } from '@island.is/financial-aid/shared/lib'

interface Then {
  result: StaffModel
  error: Error
}

type GivenWhenThen = (id: string) => Promise<Then>

describe('StaffController - Get staff by id', () => {
  let mockStaffModel: typeof StaffModel
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { staffModel, staffController } = await createTestingStaffModule()

    mockStaffModel = staffModel

    givenWhenThen = async (id: string): Promise<Then> => {
      const then = {} as Then

      await staffController
        .getStaffById(id)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const id = uuid()
    let mockFindById: jest.Mock

    beforeEach(async () => {
      mockFindById = mockStaffModel.findOne as jest.Mock

      await givenWhenThen(id)
    })

    it('should request staff by national id from the database', () => {
      expect(mockFindById).toHaveBeenCalledWith({
        where: {
          id,
        },
      })
    })
  })

  describe('staff not found', () => {
    const id = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFindById = mockStaffModel.findOne as jest.Mock
      mockFindById.mockResolvedValueOnce(null)

      then = await givenWhenThen(id)
    })

    it('should throw not found exception', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })

  describe('staff found', () => {
    const id = uuid()
    const staff = {
      id,
      name: 'Staff Tester',
      nationalId: '0000000000',
      municipalityIds: ['0'],
      municipalityName: 'Someplace',
      roles: [StaffRole.EMPLOYEE],
      active: true,
    } as StaffModel
    let then: Then

    beforeEach(async () => {
      const mockFindById = mockStaffModel.findOne as jest.Mock
      mockFindById.mockResolvedValueOnce(staff)

      then = await givenWhenThen(id)
    })

    it('should return staff', () => {
      expect(then.result).toEqual(staff)
    })
  })

  describe('database query fails', () => {
    const id = uuid()
    let then: Then

    beforeEach(async () => {
      const mockFindById = mockStaffModel.findOne as jest.Mock
      mockFindById.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(id)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
