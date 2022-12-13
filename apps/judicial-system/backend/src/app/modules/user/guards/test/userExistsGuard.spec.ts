import { uuid } from 'uuidv4'

import { BadRequestException, ExecutionContext } from '@nestjs/common'

import { Institution } from '../../../institution'
import { User } from '../../user.model'
import { createTestingUserModule } from '../../test/createTestingUserModule'
import { UserExistsGuard } from '../userExists.guard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('User exists guard', () => {
  const mockRequest = jest.fn()
  let mockUserModel: typeof User
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { userModel, userService } = await createTestingUserModule()

    mockUserModel = userModel

    givenWhenThen = async (): Promise<Then> => {
      const guard = new UserExistsGuard(userService)
      const then: Then = {} as Then

      try {
        then.result = await guard.canActivate(({
          switchToHttp: () => ({ getRequest: mockRequest }),
        } as unknown) as ExecutionContext)
      } catch (error) {
        then.error = error
      }

      return then
    }
  })

  describe('user exists', () => {
    const userId = uuid()
    const user = { id: userId }
    const request = { body: { userId }, user: undefined }
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce(request)

      const mockFindByPk = mockUserModel.findByPk as jest.Mock
      mockFindByPk.mockResolvedValueOnce(user)

      then = await givenWhenThen()
    })

    it('should lookup user', () => {
      expect(mockUserModel.findByPk).toHaveBeenCalledWith(userId, {
        include: [{ model: Institution, as: 'institution' }],
      })
    })

    it('should activate', () => {
      expect(then.result).toBe(true)
      expect(request.user).toBe(user)
    })
  })

  describe('missing user id', () => {
    let then: Then

    beforeEach(async () => {
      mockRequest.mockReturnValueOnce({})

      then = await givenWhenThen()
    })

    it('should throw BadRequestException', () => {
      expect(then.error).toBeInstanceOf(BadRequestException)
      expect(then.error.message).toBe('Missing user id')
    })
  })
})
