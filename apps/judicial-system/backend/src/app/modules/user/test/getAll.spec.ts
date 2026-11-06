import { v4 as uuid } from 'uuid'

import {
  InstitutionType,
  User as TUser,
  UserRole,
} from '@island.is/judicial-system/types'

import { createTestingUserModule } from './createTestingUserModule'

import { User, UserRepositoryService } from '../../repository'

interface Then {
  result: User[]
  error: Error
}

type GivenWhenThen = (role: UserRole) => Promise<Then>

describe('UserController - Get all', () => {
  let mockUserRepositoryService: UserRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { userRepositoryService, userController } =
      await createTestingUserModule()

    mockUserRepositoryService = userRepositoryService

    givenWhenThen = async (role: UserRole) => {
      const then = {} as Then

      await userController
        .getAll({
          role,
          institution: { type: InstitutionType.POLICE_PROSECUTORS_OFFICE },
        } as TUser)
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('Admin user gets users', () => {
    const users = [{ id: uuid() }, { id: uuid() }]
    let then: Then

    beforeEach(async () => {
      const mockFindAllForAdmin =
        mockUserRepositoryService.findAllForAdmin as jest.Mock
      mockFindAllForAdmin.mockResolvedValueOnce(users)

      then = await givenWhenThen(UserRole.ADMIN)
    })

    it('should return all users', () => {
      expect(mockUserRepositoryService.findAllForAdmin).toHaveBeenCalledWith(
        UserRole.ADMIN,
        Object.values(InstitutionType),
      )
      expect(then.result).toEqual(users)
    })
  })

  describe('Local admin user gets users', () => {
    const users = [{ id: uuid() }, { id: uuid() }]
    let then: Then

    beforeEach(async () => {
      const mockFindAllForAdmin =
        mockUserRepositoryService.findAllForAdmin as jest.Mock
      mockFindAllForAdmin.mockResolvedValueOnce(users)

      then = await givenWhenThen(UserRole.LOCAL_ADMIN)
    })

    it('should return all users', () => {
      expect(mockUserRepositoryService.findAllForAdmin).toHaveBeenCalledWith(
        UserRole.LOCAL_ADMIN,
        [InstitutionType.POLICE_PROSECUTORS_OFFICE],
      )
      expect(then.result).toEqual(users)
    })
  })

  describe.each(
    Object.values(UserRole).filter(
      (role) => ![UserRole.ADMIN, UserRole.LOCAL_ADMIN].includes(role),
    ),
  )('Non admin user gets users', (role) => {
    const users = [{ id: uuid() }, { id: uuid() }]
    let then: Then

    beforeEach(async () => {
      const mockFindAllActive =
        mockUserRepositoryService.findAllActive as jest.Mock
      mockFindAllActive.mockResolvedValueOnce(users)

      then = await givenWhenThen(role)
    })

    it('should return all active users', () => {
      expect(mockUserRepositoryService.findAllActive).toHaveBeenCalled()
      expect(then.result).toEqual(users)
    })
  })
})
