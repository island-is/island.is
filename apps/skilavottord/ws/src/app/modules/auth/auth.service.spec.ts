import { Test } from '@nestjs/testing'

import { AuthService } from './auth.service'

describe('AuthService', () => {
  let authService: AuthService

  const user1 = {
    nationalId: '2310765229',
    name: 'Batman',
    mobile: '',
    role: 'developer',
  }
  const user2 = {
    nationalId: '0706765599',
    name: 'Batman',
    mobile: '',
    role: 'recyclingCompany',
  }
  const user3 = {
    nationalId: '3005594339',
    name: 'Batman',
    mobile: '',
    role: 'recyclingFund',
  }
  const user4 = {
    // nationalId: '3005594339',
    nationalId: '8888888888',
    name: 'Batman',
    mobile: '',
    role: 'citizen',
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [AuthService],
    }).compile()

    authService = moduleRef.get(AuthService)
  })

  describe('getRole', () => {
    it('should return a correct role', () => {
      const user = user2
      const role = authService.getUserRole(user)
      expect(role.role).toBe(user.role)
    })
  })

  describe('checkRole should return true for valid permission', () => {
    it('allways return false for citizen', () => {
      // Arrange & Act
      const hasPermission = authService.checkRole(user4, 'citizen')
      expect(hasPermission).toBeFalsy()
    })
    it('return true for developer if found', () => {
      // Arrange & Act
      const hasPermission = authService.checkRole(user1, 'developer')
      expect(hasPermission).toBeTruthy()
    })
  })
})
