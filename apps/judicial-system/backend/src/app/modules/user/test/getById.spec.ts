import { v4 as uuid } from 'uuid'

import { createTestingUserModule } from './createTestingUserModule'

import { User, UserRepositoryService } from '../../repository'

interface Then {
  result: User
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('UserController - Get by id', () => {
  const userId = uuid()
  let mockUserRepositoryService: UserRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { userRepositoryService, userController } =
      await createTestingUserModule()

    mockUserRepositoryService = userRepositoryService

    givenWhenThen = async () => {
      const then = {} as Then

      await userController
        .getById(userId)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('user found', () => {
    const user = { id: userId } as User
    let then: Then

    beforeEach(async () => {
      const mockFindById = mockUserRepositoryService.findById as jest.Mock
      mockFindById.mockResolvedValueOnce(user)

      then = await givenWhenThen()
    })

    it('should return the user', () => {
      expect(mockUserRepositoryService.findById).toHaveBeenCalledWith(userId)
      expect(then.result).toBe(user)
    })
  })
})
