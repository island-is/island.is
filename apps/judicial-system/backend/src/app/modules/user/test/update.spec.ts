import { v4 as uuid } from 'uuid'

import { createTestingUserModule } from './createTestingUserModule'

import { User, UserRepositoryService } from '../../repository'

interface Then {
  result: User
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('UserController - Update', () => {
  const userId = uuid()
  const name = uuid()
  const title = uuid()
  let mockUserRepositoryService: UserRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { userRepositoryService, userController } =
      await createTestingUserModule()

    mockUserRepositoryService = userRepositoryService

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
      const mockUpdateById = mockUserRepositoryService.updateById as jest.Mock
      mockUpdateById.mockResolvedValueOnce({
        numberOfAffectedRows: 1,
        users: [user],
      })

      then = await givenWhenThen()
    })

    it('should return the updated user', () => {
      expect(mockUserRepositoryService.updateById).toHaveBeenCalledWith(
        userId,
        { name, title },
      )
      expect(then.result).toBe(user)
    })
  })
})
