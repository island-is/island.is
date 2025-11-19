import { uuid } from 'uuidv4'

import { UserRole } from '@island.is/judicial-system/types'

import { createTestingUserModule } from './createTestingUserModule'

import { randomEnum } from '../../../test'
import { User } from '../../repository'

interface Then {
  result: User
  error: Error
}

type GivenWhenThen = () => Promise<Then>

describe('UserController - Create', () => {
  const nationalId = uuid()
  const name = uuid()
  const title = uuid()
  const mobileNumber = uuid()
  const email = uuid()
  const role = randomEnum(UserRole)
  const institutionId = uuid()
  const active = true
  const canConfirmIndictment = false
  let mockUserModel: typeof User
  let givenWhenThen: GivenWhenThen

  beforeEach(async () => {
    const { userModel, userController } = await createTestingUserModule()

    mockUserModel = userModel

    givenWhenThen = async () => {
      const then = {} as Then

      await userController
        .create({
          nationalId,
          name,
          title,
          mobileNumber,
          email,
          role,
          institutionId,
          active,
          canConfirmIndictment,
        })
        .then((result) => (then.result = result))
        .catch((error) => (then.error = error))

      return then
    }
  })

  describe('user created', () => {
    const user = { id: uuid() } as User
    let then: Then

    beforeEach(async () => {
      const mockCreate = mockUserModel.create as jest.Mock
      mockCreate.mockResolvedValueOnce(user)

      then = await givenWhenThen()
    })

    it('should return the created user', () => {
      expect(mockUserModel.create).toHaveBeenCalledWith({
        nationalId,
        name,
        title,
        mobileNumber,
        email,
        role,
        institutionId,
        active,
        canConfirmIndictment,
      })
      expect(then.result).toBe(user)
    })
  })
})
