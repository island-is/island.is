import { act, render, screen, waitFor } from '@testing-library/react'
import { UserManagerEvents } from 'oidc-client-ts'

import { getAuthSettings, getUserManager } from '../userManager'
import { useAuth } from './AuthContext'
import { AuthProvider } from './AuthProvider'

const BASE_PATH = '/basepath'

jest.mock('../userManager')
const mockedGetUserManager = getUserManager as jest.Mock
const mockedGetAuthSettings = getAuthSettings as jest.Mock

const Greeting = () => {
  const { userInfo } = useAuth()
  return <>Hello {userInfo?.profile.name}</>
}

const renderAuthenticator = () =>
  render(
    <AuthProvider basePath={BASE_PATH}>
      <h2>
        <Greeting />
      </h2>
    </AuthProvider>,
  )

type MinimalUser = {
  expired?: boolean
  profile?: {
    name: string
  }
}
type MinimalUserManager = {
  events: {
    addUserLoaded: (cb: UserManagerEvents) => void
    addUserSignedOut: jest.Mock
    removeUserLoaded: () => void
    removeUserSignedOut: () => void
  }
  getUser: jest.Mock<Promise<MinimalUser>>
  signinRedirect: jest.Mock
  signinSilent: jest.Mock
  signinRedirectCallback: jest.Mock
  removeUser: jest.Mock
}

describe('AuthProvider', () => {
  let userManager: MinimalUserManager

  const expectSignin = () =>
    waitFor(() => {
      if (userManager.signinRedirect.mock.calls.length === 0) {
        throw new Error('... wait')
      }
    })

  const expectAuthenticated = (name: string) =>
    screen.findByText(`Hello ${name}`)

  beforeEach(() => {
    userManager = {
      events: {
        addUserLoaded: jest.fn(),
        addUserSignedOut: jest.fn(),
        removeUserLoaded: jest.fn(),
        removeUserSignedOut: jest.fn(),
      },
      getUser: jest.fn(),
      signinRedirect: jest.fn(),
      signinSilent: jest.fn(),
      signinRedirectCallback: jest.fn(),
      removeUser: jest.fn(),
    }
    mockedGetUserManager.mockReturnValue(userManager)
    mockedGetAuthSettings.mockReturnValue({
      redirectPath: '/callback',
      redirectPathSilent: '/callback-silent',
    })
  })

  it('starts signin flow when no stored user', async () => {
    // Act
    renderAuthenticator()

    // Assert
    await expectSignin()
  })

  it('should show a progress bar while authenticating', async () => {
    // Act
    const { getByRole } = renderAuthenticator()

    // Assert
    getByRole('progressbar')
    await expectSignin()
  })

  it('authenticates with non-expired user', async () => {
    // Arrange
    userManager.getUser.mockResolvedValue({
      expired: false,
      profile: {
        name: 'John',
      },
    })

    // Act
    renderAuthenticator()

    // Assert
    await expectAuthenticated('John')
  })

  it('removes user and starts signin flow if user is logged out', async () => {
    // Arrange
    userManager.getUser.mockResolvedValue({
      expired: false,
      profile: {
        name: 'John',
      },
    })
    renderAuthenticator()
    await expectAuthenticated('John')
    expect(userManager.events.addUserSignedOut).toHaveBeenCalled()
    const handler = userManager.events.addUserSignedOut.mock.calls[0][0]

    // Act
    await act(async () => {
      await handler()
    })

    // Assert
    await expectSignin()
    expect(userManager.removeUser).toHaveBeenCalled()
  })

  it('performs silent signin with expired user', async () => {
    // Arrange
    userManager.getUser.mockResolvedValue({
      expired: true,
    })
    userManager.signinSilent.mockResolvedValue({
      profile: {
        name: 'Doe',
      },
    })

    // Act
    renderAuthenticator()

    // Assert
    await expectAuthenticated('Doe')
    expect(userManager.signinSilent).toHaveBeenCalled()
  })

  it('starts signin flow if silent signin fails', async () => {
    // Arrange
    userManager.getUser.mockResolvedValue({
      expired: true,
    })
    userManager.signinSilent.mockRejectedValue(new Error('Not signed in'))

    // Act
    renderAuthenticator()

    // Assert
    await expectSignin()
    expect(userManager.signinSilent).toHaveBeenCalled()
  })

  it('shows error screen if signin has an error', async () => {
    // Arrange
    const location = new URL(
      `https://www.island.is${BASE_PATH}${
        mockedGetAuthSettings().redirectPath
      }`,
    )

    // Overwrite the default href for this test
    Reflect.deleteProperty(global.window, 'location')
    Object.defineProperty(window, 'location', {
      value: location,
      writable: true,
    })

    userManager.signinRedirectCallback.mockRejectedValue(
      new Error('Test error'),
    )

    // Act
    const { findByText } = renderAuthenticator()

    // Assert
    await findByText('Innskráning mistókst')
  })
})
