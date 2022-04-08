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

  describe('staff not active', () => {
    const user = { nationalId: '0000000000', active: false } as StaffModel
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(user)
    })

    it('should throw forbidden exception', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('staff not found', () => {
    const user = undefined as StaffModel
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(user)
    })

    it('should throw forbidden exception', () => {
      expect(then.error).toBeInstanceOf(ForbiddenException)
    })
  })

  describe('staff found', () => {
    const staff = {
      id: uuid(),
      name: 'Staff Tester',
      nationalId: '0000000000',
      municipalityIds: ['0'],
      roles: [StaffRole.EMPLOYEE],
      active: true,
    } as StaffModel
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(staff)
    })

    it('should return staff', () => {
      expect(then.result).toEqual(staff)
    })
  })
})
