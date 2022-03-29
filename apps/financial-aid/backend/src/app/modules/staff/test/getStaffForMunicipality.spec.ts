import { StaffModel } from '../models/staff.model'

import { createTestingStaffModule } from './createTestingStaffModule'
import { Staff, StaffRole } from '@island.is/financial-aid/shared/lib'
import { Op } from 'sequelize'

interface Then {
  result: StaffModel[]
  error: Error
}

type GivenWhenThen = (staff: Staff) => Promise<Then>

describe('StaffController - Get staff for municipality', () => {
  let mockStaffModel: typeof StaffModel
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { staffModel, staffController } = await createTestingStaffModule()

    mockStaffModel = staffModel

    givenWhenThen = async (staff: Staff): Promise<Then> => {
      const then = {} as Then

      await staffController
        .getStaffForMunicipality(staff)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const staff: Staff = {
      id: '0',
      nationalId: '0000000000',
      name: 'Test name',
      municipalityIds: ['0'],
      roles: [StaffRole.EMPLOYEE],
      active: true,
      municipalityName: 'here',
    }
    let mockFindByMunicipalityId: jest.Mock

    beforeEach(async () => {
      mockFindByMunicipalityId = mockStaffModel.findAll as jest.Mock

      await givenWhenThen(staff)
    })

    it('should request staff by municipality id from the database', () => {
      expect(mockFindByMunicipalityId).toHaveBeenCalledWith({
        where: {
          municipalityIds: { [Op.overlap]: staff.municipalityIds },
        },
        order: [
          ['active', 'DESC'],
          ['name', 'ASC'],
        ],
      })
    })
  })

  describe('staff found', () => {
    let then: Then
    const staff: Staff = {
      id: '0',
      nationalId: '0000000000',
      name: 'Test name',
      municipalityIds: ['0'],
      roles: [StaffRole.EMPLOYEE],
      active: true,
      municipalityName: 'here',
    }

    const result = [
      {
        id: '1',
        nationalId: '0000000001',
        name: 'Test name 1',
        municipalityIds: ['0'],
        roles: [StaffRole.EMPLOYEE],
        active: true,
        municipalityName: 'here',
      },
      {
        id: '2',
        nationalId: '0000000002',
        name: 'Test name 2',
        municipalityIds: ['0'],
        roles: [StaffRole.EMPLOYEE],
        active: true,
        municipalityName: 'here',
      },
    ]
    let mockFindByMunicipalityId: jest.Mock

    beforeEach(async () => {
      mockFindByMunicipalityId = mockStaffModel.findAll as jest.Mock
      mockFindByMunicipalityId.mockResolvedValueOnce(result)

      then = await givenWhenThen(staff)
    })

    it('should return array of length 2', () => {
      expect(then.result.length).toBe(2)
    })

    it('should return expected result', () => {
      expect(then.result).toEqual(result)
    })
  })

  describe('database query fails', () => {
    const staff: Staff = {
      id: '0',
      nationalId: '0000000000',
      name: 'Test name',
      municipalityIds: ['0'],
      roles: [StaffRole.EMPLOYEE],
      active: true,
      municipalityName: 'here',
    }
    let then: Then

    beforeEach(async () => {
      const mockFindByMunicipalityId = mockStaffModel.findAll as jest.Mock
      mockFindByMunicipalityId.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(staff)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
