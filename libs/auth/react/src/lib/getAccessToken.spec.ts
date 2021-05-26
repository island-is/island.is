import {
  getAccessToken,
  MIN_EXPIRY_FOR_PRE_SIGNIN,
  MIN_EXPIRY_FOR_RE_SIGNIN,
} from './getAccessToken'
import { getUserManager } from './userManager'

jest.mock('./userManager')
const mockedGetUserManager = getUserManager as jest.Mock

type MinimalUser = {
  access_token: string
  expires_in: number
}

type MinimalUserManager = {
  getUser: jest.Mock<Promise<MinimalUser | null>>
  signinSilent: jest.Mock<Promise<MinimalUser | null>>
}

describe('getAccessToken', () => {
  let userManager: MinimalUserManager

  beforeEach(() => {
    userManager = {
      getUser: jest.fn(),
      signinSilent: jest.fn(),
    }
    mockedGetUserManager.mockReturnValue(userManager)
  })

  it('gets access token from user', async () => {
    // Arrange
    const tokenValue = 'Test token'
    userManager.getUser.mockResolvedValue({
      access_token: tokenValue,
      expires_in: 1000,
    })

    // Act
    const token = await getAccessToken()

    // Assert
    expect(userManager.signinSilent).not.toHaveBeenCalled()
    expect(token).toBe(tokenValue)
  })

  it("returns null if there's no user", async () => {
    // Arrange
    userManager.getUser.mockResolvedValue(null)

    // Act
    const token = await getAccessToken()

    // Assert
    expect(token).toBe(null)
  })

  it("renews token if it's expired", async () => {
    // Arrange
    const tokenValue = 'Test token'
    userManager.getUser.mockResolvedValue({
      access_token: 'unused',
      expires_in: -100,
    })
    userManager.signinSilent.mockResolvedValue({
      access_token: tokenValue,
      expires_in: 1000,
    })

    // Act
    const token = await getAccessToken()

    // Assert
    expect(userManager.signinSilent).toHaveBeenCalled()
    expect(token).toBe(tokenValue)
  })

  it("renews token if it's almost expired", async () => {
    // Arrange
    const tokenValue = 'Test token'
    userManager.getUser.mockResolvedValue({
      access_token: 'unused',
      expires_in: MIN_EXPIRY_FOR_RE_SIGNIN - 1,
    })
    userManager.signinSilent.mockResolvedValue({
      access_token: tokenValue,
      expires_in: 1000,
    })

    // Act
    const token = await getAccessToken()

    // Assert
    expect(userManager.signinSilent).toHaveBeenCalled()
    expect(token).toBe(tokenValue)
  })

  it("returns null if there's no user when silently renewing", async () => {
    // Arrange
    userManager.getUser.mockResolvedValue({
      access_token: 'unused',
      expires_in: -100,
    })
    userManager.signinSilent.mockResolvedValue(null)

    // Act
    const token = await getAccessToken()

    // Assert
    expect(token).toBe(null)
  })

  it("prefetches token if it's about to expire but returns old token", async () => {
    // Arrange
    const tokenValue = 'Test token'
    userManager.getUser.mockResolvedValue({
      access_token: tokenValue,
      expires_in: MIN_EXPIRY_FOR_PRE_SIGNIN - 1,
    })
    userManager.signinSilent.mockResolvedValue(null)

    // Act
    const token = await getAccessToken()

    // Assert
    expect(userManager.signinSilent).toHaveBeenCalled()
    expect(token).toBe(tokenValue)
  })

  it('only silently renews once at a time', async () => {
    // Arrange
    const tokenValue = 'Test token'
    userManager.getUser.mockResolvedValue({
      access_token: 'unused',
      expires_in: -100,
    })
    userManager.signinSilent
      .mockResolvedValueOnce({ access_token: tokenValue, expires_in: 1000 })
      .mockResolvedValueOnce(null)

    // Act
    const promise1 = getAccessToken()
    const promise2 = getAccessToken()
    const [result1, result2] = await Promise.all([promise1, promise2])

    // Assert
    expect(userManager.signinSilent).toHaveBeenCalledTimes(1)
    expect(result1).toBe(tokenValue)
    expect(result2).toBe(tokenValue)
  })
})
