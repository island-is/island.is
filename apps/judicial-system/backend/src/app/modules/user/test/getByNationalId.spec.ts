import { uuid } from 'uuidv4'

import { UserRole } from '@island.is/judicial-system/types'

import { nowFactory } from '../../../factories'
import { randomDate } from '../../../test'
import { Institution } from '../../institution'
import { User } from '../user.model'
import { createTestingUserModule } from './createTestingUserModule'

jest.mock('../../../factories')

interface Then {
  result: User
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('UserController - Get by national id', () => {
  const date = randomDate()
  const nationalId = uuid()
  let mockUserModel: typeof User
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { userModel, userController } = await createTestingUserModule()

    mockUserModel = userModel

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValueOnce(date)

    givenWhenThen = async () => {
      const then = {} as Then

      await userController
        .getByNationalId(nationalId)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('admin user found', () => {
    let then: Then

    beforeEach(async () => {
      then = await givenWhenThen()
    })

    it('should return the user', () => {
      expect(mockUserModel.findOne).toHaveBeenCalledWith( {
        include: [{ model: Institution, as: 'institution' }],
        { where: { nationalId } },
      })
      expect(then.result).toEqual({
        id: '8f8f6522-95c8-46dd-98ef-cbc198544871',
        nationalId: '3333333333',
        name: 'Addi Admin',
        title: 'notendaumsjón',
        created: date,
        modified: date,
        mobileNumber: '',
        email: '',
        role: UserRole.ADMIN,
        active: true,
      })
    })
  })

  describe('user found', () => {
    const user = { id: uuid() } as User
    let then: Then

    beforeEach(async () => {
      const mockFindOne = mockUserModel.findOne as jest.Mock
      mockFindOne.mockReturnValueOnce(user)

      then = await givenWhenThen()
    })

    it('should return the user', () => {
      expect(mockUserModel.findOne).toHaveBeenCalledWith(
        {
          include: [{ model: Institution, as: 'institution' }],
        },
        { where: { nationalId } },
      )
      expect(then.result).toBe(user)
    })
  })
})
