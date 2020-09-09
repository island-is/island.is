import { Test } from '@nestjs/testing'

import { AuthService } from './auth.service'
import { UserService } from '../user'

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
      const role = await authService.validateUser(user)

      // Assert
      expect(role).toBeNull()
    })
  })
})
