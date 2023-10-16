import { uuid } from 'uuidv4'

import { UserRole } from '@island.is/judicial-system/types'

import { createTestingUserModule } from './createTestingUserModule'

import { Institution } from '../../institution'
import { User } from '../user.model'

interface Then {
  result: User[]
  error: Error
}

type GivenWhenThen = (role: UserRole) => Promise<Then>

describe('UserController - Get all', () => {
  let mockUserModel: typeof User
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { userModel, userController } = await createTestingUserModule()

    mockUserModel = userModel

    givenWhenThen = async (role: UserRole) => {
      const then = {} as Then

      await userController
        .getAll({ role } as User)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('Admin user gets users', () => {
    const users = [{ id: uuid() }, { id: uuid() }]
    let then: Then

    beforeEach(async () => {
      const mockFindAll = mockUserModel.findAll as jest.Mock
      mockFindAll.mockReturnValueOnce(users)

      then = await givenWhenThen(UserRole.ADMIN)
    })

    it('should return all users', () => {
      expect(mockUserModel.findAll).toHaveBeenCalledWith({
        order: ['name'],
        include: [{ model: Institution, as: 'institution' }],
      })
      expect(then.result).toEqual(users)
    })
  })

  describe.each(
    Object.values(UserRole).filter((role) => role !== UserRole.ADMIN),
  )('Non admin user gets users', (role) => {
    const users = [{ id: uuid() }, { id: uuid() }]
    let then: Then

    beforeEach(async () => {
      const mockFindAll = mockUserModel.findAll as jest.Mock
      mockFindAll.mockReturnValueOnce(users)

      then = await givenWhenThen(role)
    })

    it('should return all active users', () => {
      expect(mockUserModel.findAll).toHaveBeenCalledWith({
        order: ['name'],
        where: { active: true },
        include: [{ model: Institution, as: 'institution' }],
      })
      expect(then.result).toEqual(users)
    })
  })
})
