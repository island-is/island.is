import { Test } from '@nestjs/testing'

import { UserService } from '../user'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let authService: AuthService

  const user = {
    nationalId: '1501933119',
    name: 'tester',
    mobile: '',
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService, UserService],
    }).compile()

    authService = moduleRef.get(AuthService)
  })

  describe('validateUser', () => {
    it('should be an unknown user', async () => {
      // Arrange & Act
      const found = await authService.validateUser(user)

      // Assert
      expect(found).toBeFalsy()
    })
  })
})
