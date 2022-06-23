import { StaffModel } from '../models/staff.model'

import { createTestingStaffModule } from './createTestingStaffModule'
import { StaffRole } from '@island.is/financial-aid/shared/lib'
import { Op } from 'sequelize'

interface Then {
  result: StaffModel[]
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('StaffController - Get supervisors', () => {
  let mockStaffModel: typeof StaffModel
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { staffModel, staffController } = await createTestingStaffModule()

    mockStaffModel = staffModel

    givenWhenThen = async (): Promise<Then> => {
      const then = {} as Then

      await staffController
        .getSupervisors()
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    let mockGetSupervisors: jest.Mock

    beforeEach(async () => {
      mockGetSupervisors = mockStaffModel.findAll as jest.Mock

      await givenWhenThen()
    })

    it('should run expected query', () => {
      expect(mockGetSupervisors).toHaveBeenCalledWith({
        where: {
          roles: { [Op.contains]: [StaffRole.SUPERADMIN] },
        },
      })
    })
  })

  describe('supervisors found', () => {
    let then: Then

    const result = [
      {
        id: '1',
        nationalId: '0000000001',
        name: 'Test name 1',
        municipalityId: '01',
        roles: [StaffRole.SUPERADMIN],
        active: true,
      },
      {
        id: '2',
        nationalId: '0000000002',
        name: 'Test name 2',
        municipalityId: '02',
        roles: [StaffRole.SUPERADMIN],
        active: true,
      },
    ]
    let mockGetSupervisors: jest.Mock

    beforeEach(async () => {
      mockGetSupervisors = mockStaffModel.findAll as jest.Mock
      mockGetSupervisors.mockResolvedValueOnce(result)

      then = await givenWhenThen()
    })

    it('should return array of length 2', () => {
      expect(then.result.length).toBe(2)
    })

    it('should return expected result', () => {
      expect(then.result).toEqual(result)
    })
  })

  describe('no supervisors found', () => {
    let then: Then
    const result = []
    let mockGetSupervisors: jest.Mock

    beforeEach(async () => {
      mockGetSupervisors = mockStaffModel.findAll as jest.Mock
      mockGetSupervisors.mockResolvedValueOnce(result)

      then = await givenWhenThen()
    })

    it('should return array of length 0', () => {
      expect(then.result.length).toBe(0)
    })

    it('should return expected result', () => {
      expect(then.result).toEqual(result)
    })
  })

  describe('database query fails', () => {
    let then: Then

    beforeEach(async () => {
      const mockGetSupervisors = mockStaffModel.findAll as jest.Mock
      mockGetSupervisors.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen()
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Some error')
    })
  })
})
