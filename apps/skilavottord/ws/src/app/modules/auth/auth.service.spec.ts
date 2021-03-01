import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'

describe('skilavottordApiTest', () => {
  it('should work', () => {
    expect(AuthService.test()).toEqual('test')
  })

  // describe('AuthService', () => {
  //   let authService: AuthService

  //   const user1 = {
  //     nationalId: '1111111111',
  //     name: 'Gervimaður',
  //     mobile: '',
  //     role: 'developer',
  //   }

  //   const user2 = {
  //     nationalId: '2222222222',
  //     name: 'Gervimaður',
  //     mobile: '',
  //     role: '',
  //   }

  //   const userList = `[{ "nationalId":"2310765229", "name": "xxxxxxxxxxxxxxxxxx", "role":"developer", "partnerId":""},
  // { "nationalId":"1111111111", "name": "xxxxxxxxxxxxxxxxxxx", "role":"developer", "partnerId":""},
  // { "nationalId":"1111111111","name": "xxxxxxxxxxxxxxxxxxxxxxxxxx", "role":"developer", "partnerId":""},
  // { "nationalId":"1111111111","name": "xxxxxxxxxxxxxxxxxxxxxxxxxx", "role":"recyclingFund", "partnerId":""},
  // { "nationalId":"1111111111","name": "xxxxxxxxxxxxxxx", "role":"recyclingFund", "partnerId":""},
  // { "nationalId":"1111111111","name": "xxxxxxxxxx", "role":"recyclingCompany", "partnerId":"999"}
  // ]`
  //   beforeEach(async () => {
  //     const moduleRef = await Test.createTestingModule({
  //       providers: [AuthService],
  //     }).compile()

  //     authService = moduleRef.get(AuthService)
  //   })

  //   describe('getRole test', () => {
  //     it('should return a correct user with role', () => {
  //       const user = user1
  //       const ur = authService.getUserRole(user)
  //       expect(ur.role).toBe('recyclingCompany')
  //     })
  //   })

  //   describe('checkRole test ', () => {
  //     it('allways return false for citizen', () => {
  //       // Arrange & Act
  //       const hasPermission = authService.checkRole(user2, 'citizen')
  //       expect(hasPermission).toBeFalsy()
  //     })
  //     it('allways return true for other than citizen', () => {
  //       // Arrange & Act
  //       const hasPermission = authService.checkRole(user1, 'developer')
  //       expect(hasPermission).toBeTruthy()
  //     })
  //   })
})
