import { uuid } from 'uuidv4'

import { StaffModel } from '../models'
import { createTestingStaffModule } from './createTestingStaffModule'

interface Then {
  result: StaffModel
  error: Error
}

type GivenWhenThen = (staffId: string) => Promise<Then>

describe('StaffController - Get by id', () => {
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { staffController } = await createTestingStaffModule()

    givenWhenThen = async (staffId: string) => {
      const then = {} as Then

      try {
        then.result = await staffController.getStaffById(staffId)
      } catch (error) {
        then.error = error as Error
      }

      return then
    }
  })

  describe('staff exists', () => {
    const staffId = uuid()
    const theStaff = { id: staffId } as StaffModel
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen(staffId)
    })

    it('should return the staff', () => {
      expect(then.result).toBe(theStaff)
    })
  })
})
