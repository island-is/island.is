import { StaffModel } from '../models/staff.model'

import { createTestingStaffModule } from './createTestingStaffModule'
import { StaffRole } from '@island.is/financial-aid/shared/lib'
import { UpdateStaffDto } from '../dto'
import { uuid } from 'uuidv4'
import { NotFoundException } from '@nestjs/common'

interface Then {
  result: StaffModel
  error: Error
}

type GivenWhenThen = (
  id: string,
  staffToUpdate: UpdateStaffDto,
) => Promise<Then>

describe('StaffController - Update', () => {
  let mockStaffModel: typeof StaffModel
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { staffModel, staffController } = await createTestingStaffModule()

    mockStaffModel = staffModel

    givenWhenThen = async (
      id: string,
      staffToUpdate: UpdateStaffDto,
    ): Promise<Then> => {
      const then = {} as Then

      await staffController
        .update(id, staffToUpdate)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const id = uuid()
    const update = {
      active: true,
      name: 'Im a test',
      nationalId: '0000000000',
    } as UpdateStaffDto
    let mockUpdate: jest.Mock

    beforeEach(async () => {
      mockUpdate = mockStaffModel.update as jest.Mock

      await givenWhenThen(id, update)
    })

    it('should run update query', () => {
      expect(mockUpdate).toHaveBeenCalledWith(update, {
        where: { id },
        returning: true,
      })
    })
  })

  describe('failed update', () => {
    const id = uuid()
    const update = {
      active: true,
      name: 'Im a test',
      nationalId: '0000000000',
    } as UpdateStaffDto
    let then: Then
    let mockUpdate: jest.Mock
    const staff = {
      id,
      name: 'staff',
      nationalId: '0',
      municipalityIds: ['0'],
      municipalityName: 'the moon',
      roles: [StaffRole.EMPLOYEE],
      active: true,
      usePseudoName: true,
    } as StaffModel

    beforeEach(async () => {
      mockUpdate = mockStaffModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([0, [staff]])

      then = await givenWhenThen(id, update)
    })

    it('should throw NotFoundException', () => {
      expect(then.error).toBeInstanceOf(NotFoundException)
    })
  })

  describe('successful update', () => {
    const id = uuid()
    let then: Then

    const update = {
      active: true,
      name: 'Im a test',
      nationalId: '0000000000',
    } as UpdateStaffDto

    const staff = {
      id,
      name: update.name,
      nationalId: update.nationalId,
      municipalityIds: ['0'],
      municipalityName: 'the moon',
      roles: [StaffRole.EMPLOYEE],
      active: update.active,
      usePseudoName: true,
    } as StaffModel
    let mockUpdate: jest.Mock

    beforeEach(async () => {
      mockUpdate = mockStaffModel.update as jest.Mock
      mockUpdate.mockResolvedValue([1, [staff]])

      then = await givenWhenThen(id, update)
    })

    it('should return updated staff from input', () => {
      expect(then.result).toEqual(staff)
    })
  })

  describe('database query fails', () => {
    const id = uuid()
    const update = {
      active: true,
      name: 'Im a test',
      nationalId: '0000000000',
    } as UpdateStaffDto
    let mockUpdate: jest.Mock
    let then: Then

    beforeEach(async () => {
      const mockFindByMunicipalityId = mockStaffModel.update as jest.Mock
      mockFindByMunicipalityId.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(id, update)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
