import { uuid } from 'uuidv4'

import { BadRequestException, ExecutionContext } from '@nestjs/common'

import { UserService } from '../../../user'
import { createTestingDefendantModule } from '../../test/createTestingDefendantModule'
import { UserExistsGuard } from '../userExistsGuard'

interface Then {
  result: boolean
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('User exists guard', () => {
  const mockRequest = jest.fn()
  let mockeUserService: UserService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { userService } = await createTestingDefendantModule()

    mockeUserService = userService

    givenWhenThen = async (): Promise<Then> => {
      const guard = new UserExistsGuard(mockeUserService)
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

      const mockFindById = mockeUserService.findById as jest.Mock
      mockFindById.mockResolvedValueOnce(user)

      then = await givenWhenThen()
    })

    it('should lookup user', () => {
      expect(mockeUserService.findById).toHaveBeenCalledWith(userId)
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
