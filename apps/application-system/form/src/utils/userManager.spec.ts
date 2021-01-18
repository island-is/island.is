/* eslint-disable @typescript-eslint/camelcase */
import { ExtendedUserManager, settings } from './userManager'

// seconds
const MOCKED_TOKEN_EXPIRES_AT = 10000

// seconds
const MOCKED_SIGNINSILENT_TOKEN_EXPIRES_AT = 20000

const MOCK_USER = {
  expires_at: MOCKED_TOKEN_EXPIRES_AT,
  profile: {
    id: '1337',
  },
}

jest.mock('oidc-client', () => ({
  __esModule: true,
  UserManager: class MockUserManager {
    async getUser() {
      return MOCK_USER
    }

    async signinSilent() {
      return {
        ...MOCK_USER,
        // New user with twice the expires at
        expires_at: MOCKED_SIGNINSILENT_TOKEN_EXPIRES_AT,
      }
    }
  },
  UserManagerSettings: {},
  WebStorageStateStore: class MockStorage {},
}))

describe('UserManager', () => {
  let userManager: ExtendedUserManager
  beforeEach(() => {
    userManager = new ExtendedUserManager(settings)
  })

  describe('verifyAuthentication', () => {
    it('should return user if user has a valid token', async () => {
      const valueLessThanTokenExpiry = MOCKED_TOKEN_EXPIRES_AT * 1000 - 10

      const dateSpy = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => valueLessThanTokenExpiry)

      const user = await userManager.verifyAuthentication()
      expect(user.profile.id).toEqual(MOCK_USER.profile.id)

      dateSpy.mockRestore()
    })

    it('should call signinSilent if getUser.expires_at has expired', async () => {
      const valueGreaterThanExpiry = MOCKED_TOKEN_EXPIRES_AT * 1000 + 10

      const dateSpy = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => valueGreaterThanExpiry)

      const user = await userManager.verifyAuthentication()

      expect(user.profile.id).toEqual(MOCK_USER.profile.id)
      expect(user.expires_at).toEqual(MOCKED_SIGNINSILENT_TOKEN_EXPIRES_AT)

      dateSpy.mockRestore()
    })

    it('should throw an unauthorized error if signinSilent fails', async () => {
      const valueGreaterThanExpiry = MOCKED_TOKEN_EXPIRES_AT * 1000 + 10

      const dateSpy = jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => valueGreaterThanExpiry)

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      userManager.signinSilent = () => {
        throw new Error('')
      }

      expect(userManager.verifyAuthentication()).rejects.toEqual(
        new Error('Unauthorized'),
      )

      dateSpy.mockRestore()
    })
  })
})
