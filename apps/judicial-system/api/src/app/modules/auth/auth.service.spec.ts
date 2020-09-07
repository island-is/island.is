import { Test } from '@nestjs/testing'

import { AuthService } from './auth.service'

describe('AuthService', () => {
  let authService: AuthService

  const user = {
    nationalId: '1501933119',
    name: 'tester',
    mobile: '',
    role: 'developer',
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService],
    }).compile()

    authService = moduleRef.get(AuthService)
  })

  describe('validateUser', () => {
    it('should be an unknown user', () => {
      // Arrange & Act
      const role = authService.validateUser(user)

      // Assert
      expect(role).toBeNull()
    })
  })
})
