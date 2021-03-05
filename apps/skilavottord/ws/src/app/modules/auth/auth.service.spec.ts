import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'

const userList = [
  {
    nationalId: '1111111111',
    name: 'Gerfimaður-1',
    role: 'developer',
    partnerId: '',
  },
  {
    nationalId: '2222222222',
    name: 'Gerfimaður-2',
    role: 'developer',
    partnerId: '',
  },
  {
    nationalId: '3333333333',
    name: 'Gerfimaður-3',
    role: 'developer',
    partnerId: '',
  },
  {
    nationalId: '4444444444',
    name: 'Gerfimaður-4',
    role: 'recyclingFund',
    partnerId: '',
  },
  {
    nationalId: '5555555555',
    name: 'xxxxxxxxxxxxxxx',
    role: 'recyclingFund',
    partnerId: '',
  },
  {
    nationalId: '6666666666',
    name: 'xxxxxxxxxx',
    role: 'recyclingCompany',
    partnerId: '999',
  },
]
describe('skilavottordApiTest', () => {
  it('should work', () => {
    expect(AuthService.test()).toEqual('test')
  })

  describe('AuthService', () => {
    let authService: AuthService

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          AuthService,
          {
            provide: LOGGER_PROVIDER,
            useValue: logger,
          },
        ],
      }).compile()
      authService = moduleRef.get(AuthService)
      const httpServiceSpy = jest
        .spyOn(JSON, 'parse')
        .mockImplementation(() => userList)
    })

    describe('getRole test', () => {
      it('should return a correct user with role', () => {
        const userx = {
          nationalId: '1111111111',
          name: 'Gervimaður-developer',
          mobile: '',
          role: '',
        }
        const ur = authService.getUserRole(userx)
        expect(ur.role).toBe('developer')
      })
      it('should return a correct user with role', () => {
        const userx = {
          nationalId: '8888888888',
          name: 'Gervimaður-citizen',
          mobile: '',
          role: '',
        }
        const ur = authService.getUserRole(userx)
        expect(ur.role).toBe('citizen')
      })
      it('undefined should return citizen', () => {
        const userx = undefined
        const ur = authService.getUserRole(userx)
        expect(ur.role).toBe('citizen')
      })
    })

    describe('checkRole test ', () => {
      it('allways return false for citizen', () => {
        const userx = {
          nationalId: '8888888888',
          name: 'Gervimaður-1',
          mobile: '',
          role: 'citizen',
        }
        const hasPermission = authService.checkRole(userx, 'citizen')
        expect(hasPermission).toBeFalsy()
      })
      it('nationalId not in userList, return false', () => {
        const userx = {
          nationalId: '8888888888',
          name: 'Gervimaður-1',
          mobile: '',
          role: 'developer',
        }
        let hasPermission = authService.checkRole(userx, 'citizen')
        expect(hasPermission).toBeFalsy()
      })
      it('allways return true for other than citizen', () => {
        const userx = {
          nationalId: '1111111111',
          name: 'Gervimaður-1',
          mobile: '',
          role: 'developer',
        }
        const hasPermission = authService.checkRole(userx, 'developer')
        expect(hasPermission).toBeTruthy()
      })
    })
  })
})
