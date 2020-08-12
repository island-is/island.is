import { Test } from '@nestjs/testing'

import { AuthService } from './auth.service'
import { AuthRepository } from './auth.repository'

describe('AuthService', () => {
  let authRepository: AuthRepository
  let authService: AuthService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService, AuthRepository],
    }).compile()

    authService = moduleRef.get(AuthService)
    authRepository = moduleRef.get(AuthRepository)
  })

  describe('getMessage', () => {
    it('should return a greeting', () => {
      // Arrange
      jest
        .spyOn(authRepository, 'getAuth')
        .mockImplementation(() => 'Hi')

      // Act
      const message = authService.getMessage('test')

      // Assert
      expect(message).toBe('Hi test!')
    })
  })
})
