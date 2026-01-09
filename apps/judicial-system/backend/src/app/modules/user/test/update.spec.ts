import { v4 as uuid } from 'uuid'

import { createTestingUserModule } from './createTestingUserModule'

import { User } from '../../repository'

interface Then {
  result: User
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('UserController - Update', () => {
  const userId = uuid()
  const name = uuid()
  const title = uuid()
  let mockUserModel: typeof User
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { userModel, userController } = await createTestingUserModule()

    mockUserModel = userModel

    givenWhenThen = async () => {
      const then = {} as Then

      await userController
        .update(userId, { name, title })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('user updated', () => {
    const user = { id: userId } as User
    let then: Then

    beforeEach(async () => {
      const mockUpdate = mockUserModel.update as jest.Mock
      mockUpdate.mockResolvedValueOnce([1, [user]])

      then = await givenWhenThen()
    })

    it('should return the updated user', () => {
      expect(mockUserModel.update).toHaveBeenCalledWith(
        { name, title },
        { where: { id: userId }, returning: true },
      )
      expect(then.result).toBe(user)
    })
  })
})
