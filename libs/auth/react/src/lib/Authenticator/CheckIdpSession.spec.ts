import addMinutes from 'date-fns/addMinutes'
import addSeconds from 'date-fns/addSeconds'
import { configureMock, getAuthSettings } from '../userManager'
import { checkIdpSession, SessionInfo } from './CheckIdpSession'

jest.useFakeTimers('modern')

describe('CheckIdpSession', () => {
  const signInMock = jest.fn()
  const setTimeoutSpy = jest.spyOn(global, 'setTimeout')

  configureMock()
  const authSettings = getAuthSettings()

  beforeEach(() => {
    signInMock.mockReset()
    setTimeoutSpy.mockReset()
  })

  it('should register setTimeout for valid user session', async () => {
    // Arrange
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            isExpired: false,
            expiresUtc: addMinutes(new Date(), 10),
            message: 'Ok',
          }),
      }),
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.fetch = fetchMock as any

    // Act
    await checkIdpSession({ signIn: signInMock })

    // Assert
    expect(signInMock).toHaveBeenCalledTimes(0)
    expect(fetchMock).toHaveBeenLastCalledWith(
      `${authSettings.authority}${authSettings.checkSessionPath}`,
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1)
  })

  it('should redirect to signIn when session expires after timeout', async () => {
    // Arrange
    const expiresUtc = addMinutes(new Date(), 5)
    const fetchMock = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () =>
            Promise.resolve({
              isExpired: false,
              expiresUtc,
              message: 'Ok',
            }),
        }),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () =>
            Promise.resolve({
              isExpired: true,
              expiresUtc,
              message: 'Ok',
            }),
        }),
      )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.fetch = fetchMock as any
    await checkIdpSession({ signIn: signInMock })

    // Pass time forward
    jest.setSystemTime(addSeconds(expiresUtc, 5))

    // Act
    await checkIdpSession({ signIn: signInMock })

    // Assert
    expect(signInMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenLastCalledWith(
      `${authSettings.authority}${authSettings.checkSessionPath}`,
    )
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(setTimeoutSpy).toHaveBeenCalledTimes(1)
  })

  it('should redirect to signIn when session is expired', async () => {
    // Arrange
    const sessionInfo: SessionInfo = {
      isExpired: true,
      expiresUtc: addMinutes(new Date(), -1),
      message: 'Ok',
    }
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(sessionInfo),
      }),
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.fetch = fetchMock as any

    // Act
    await checkIdpSession({ signIn: signInMock })

    // Assert
    expect(signInMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenLastCalledWith(
      `${authSettings.authority}${authSettings.checkSessionPath}`,
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should redirect to signIn when no user session is found', async () => {
    // Arrange
    const sessionInfo: SessionInfo = {
      message: 'No user session',
    }
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve(sessionInfo),
      }),
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.fetch = fetchMock as any

    // Act
    await checkIdpSession({ signIn: signInMock })

    // Assert
    expect(signInMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should redirect to signIn when failed getting session info', async () => {
    // Arrange
    const sessionInfo: SessionInfo = {
      message: 'Failed retrieving user session',
    }
    const fetchMock = jest.fn(() =>
      Promise.resolve({
        status: 500,
        json: () => Promise.resolve(sessionInfo),
      }),
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.fetch = fetchMock as any

    // Act
    await checkIdpSession({ signIn: signInMock })

    // Assert
    expect(signInMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
