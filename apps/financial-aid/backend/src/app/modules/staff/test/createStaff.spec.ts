import { StaffModel } from '../models/staff.model'

import { createTestingStaffModule } from './createTestingStaffModule'
import { Staff, StaffRole } from '@island.is/financial-aid/shared/lib'
import { CreateStaffDto } from '../dto'
import { uuid } from 'uuidv4'

interface Then {
  result: StaffModel
  error: Error
}

type GivenWhenThen = (
  staff: Staff,
  createStaffInput: CreateStaffDto,
) => Promise<Then>

describe('StaffController - createStaff', () => {
  let mockStaffModel: typeof StaffModel
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { staffModel, staffController } = await createTestingStaffModule()

    mockStaffModel = staffModel

    givenWhenThen = async (
      staff: Staff,
      createStaffInput: CreateStaffDto,
    ): Promise<Then> => {
      const then = {} as Then

      await staffController
        .createStaff(staff, createStaffInput)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('database query', () => {
    const input: CreateStaffDto = {
      name: 'Im a test',
      nationalId: '0000000000',
      email: 'test@test.test',
      roles: [StaffRole.EMPLOYEE],
      municipalityIds: ['10'],
      municipalityName: 'Island',
    }
    const staff: Staff = {
      municipalityIds: ['0'],
      municipalityName: 'Saturn',
      id: '',
      nationalId: '',
      name: '',
      roles: [],
      active: false,
    }
    let mockUpdate: jest.Mock

    beforeEach(async () => {
      mockUpdate = mockStaffModel.create as jest.Mock

      await givenWhenThen(staff, input)
    })

    it('should run create query', () => {
      expect(mockUpdate).toHaveBeenCalledWith(
        {
          nationalId: input.nationalId,
          name: input.name,
          municipalityIds: input.municipalityIds,
          email: input.email,
          roles: input.roles,
          active: true,
          municipalityName: input.municipalityName,
        },
        { transaction: undefined },
      )
    })
  })

  describe('database query with inherit data', () => {
    const id = uuid()
    const input: CreateStaffDto = {
      name: 'Im a test',
      nationalId: '0000000000',
      email: 'test@test.test',
      roles: [StaffRole.EMPLOYEE],
      municipalityIds: ['10'],
      municipalityName: undefined,
    }
    const staff: Staff = {
      municipalityIds: ['10'],
      id: '',
      nationalId: '',
      name: '',
      roles: [],
      active: false,
    }
    let mockUpdate: jest.Mock

    beforeEach(async () => {
      mockUpdate = mockStaffModel.create as jest.Mock

      await givenWhenThen(staff, input)
    })

    it('should run create query with inherit municipality data from staff', () => {
      expect(mockUpdate).toHaveBeenCalledWith(
        {
          nationalId: input.nationalId,
          name: input.name,
          municipalityIds: staff.municipalityIds,
          email: input.email,
          roles: input.roles,
          active: true,
          municipalityName: staff.municipalityName,
        },
        { transaction: undefined },
      )
    })
  })

  describe('successful creation', () => {
    const id = uuid()
    const input: CreateStaffDto = {
      name: 'Im a test',
      nationalId: '0000000000',
      email: 'test@test.test',
      roles: [StaffRole.EMPLOYEE],
      municipalityIds: ['10'],
      municipalityName: 'A place',
    }
    const staff: Staff = {
      municipalityIds: ['0'],
      municipalityName: 'Saturn',
      id: '',
      nationalId: '',
      name: '',
      roles: [],
      active: false,
    }
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockStaffModel.create as jest.Mock
      mockUpdate.mockResolvedValueOnce(input)

      then = await givenWhenThen(staff, input)
    })

    it('should create staff', () => {
      expect(then.result).toEqual(input)
    })
  })

  describe('database query fails', () => {
    const input: CreateStaffDto = {
      name: 'Im a test',
      nationalId: '0000000000',
      email: 'test@test.test',
      roles: [StaffRole.EMPLOYEE],
      municipalityIds: [],
      municipalityName: '',
    }
    const staff: Staff = {
      municipalityIds: ['0'],
      municipalityName: 'Saturn',
      id: '',
      nationalId: '',
      name: '',
      roles: [],
      active: false,
    }
    let then: Then

    beforeEach(async () => {
      const mockFindByMunicipalityId = mockStaffModel.create as jest.Mock
      mockFindByMunicipalityId.mockRejectedValueOnce(new Error('Some error'))

      then = await givenWhenThen(staff, input)
    })

    it('should throw error', () => {
      expect(then.error).toBeInstanceOf(Error)
      expect(then.error.message).toBe('Cannot create staff')
    })
  })
})
