import { v4 as uuid } from 'uuid'

import { UserRole } from '@island.is/judicial-system/types'

import { createTestingUserModule } from './createTestingUserModule'

import { nowFactory } from '../../../factories'
import { randomDate } from '../../../test'
import { User, UserRepositoryService } from '../../repository'

jest.mock('../../../factories')

interface Then {
  result: User
  error: Error
}

type GivenWhenThen = (nationalId: string) => Promise<Then>

describe('UserController - Get by national id', () => {
  const date = randomDate()
  let mockUserRepositoryService: UserRepositoryService
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { userRepositoryService, userController } =
      await createTestingUserModule()

    mockUserRepositoryService = userRepositoryService

    const mockToday = nowFactory as jest.Mock
    mockToday.mockReturnValue(date)

    givenWhenThen = async (nationalId: string) => {
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
      then = await givenWhenThen('3333333333')
    })

    it('should return the user', () => {
      expect(then.result).toEqual([
        {
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
          canConfirmIndictment: false,
          canManageMessageSuspension: false,
        },
      ])
    })
  })

  describe('user found', () => {
    const nationalId = uuid()
    const user1 = { id: uuid() } as User
    const user2 = { id: uuid() } as User
    let then: Then

    beforeEach(async () => {
      const mockFindActiveByNationalId =
        mockUserRepositoryService.findActiveByNationalId as jest.Mock
      mockFindActiveByNationalId.mockResolvedValueOnce([user1, user2])

      then = await givenWhenThen(nationalId)
    })

    it('should return the user', () => {
      expect(
        mockUserRepositoryService.findActiveByNationalId,
      ).toHaveBeenCalledWith(nationalId)
      expect(then.result).toEqual([user1, user2])
    })
  })
})
