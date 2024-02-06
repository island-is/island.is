import { act, render, screen, waitFor } from '@testing-library/react'
import { UserManagerEvents } from 'oidc-client-ts'
import { BrowserRouter } from 'react-router-dom'

import { getAuthSettings, getUserManager } from '../userManager'
import { useAuth } from './AuthContext'
import { AuthProvider } from './AuthProvider'
import { createNationalId } from '@island.is/testing/fixtures'

const BASE_PATH = '/basepath'
const INITIATE_LOGIN_PATH = '/login'

jest.mock('../userManager')
const mockedGetUserManager = getUserManager as jest.Mock
const mockedGetAuthSettings = getAuthSettings as jest.Mock

const Greeting = () => {
  const { userInfo } = useAuth()
  return <>Hello {userInfo?.profile.name}</>
}

const renderAuthenticator = (route = BASE_PATH) => {
  window.history.pushState({}, 'Test page', route)

  return render(
    <AuthProvider basePath={BASE_PATH}>
      <h2>
        <Greeting />
      </h2>
    </AuthProvider>,
    { wrapper: BrowserRouter },
  )
}

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
      baseUrl: BASE_PATH,
      initiateLoginPath: INITIATE_LOGIN_PATH,
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

  // prettier-ignore
  it.each`
    params
    ${{ prompt: 'login' }}
    ${{ prompt: 'select_account' }}
    ${{
      login_hint: createNationalId('company'),
      target_link_uri: `${BASE_PATH}/test`,
    }}
  `(
    'starts 3rd party initiated login flow with params $params',
    async (params: { prompt?: string, login_hint?: string, target_link_uri?: string }) => {
      // Arrange
      const searchParams = new URLSearchParams(params)

      // Act
      renderAuthenticator(
        `${BASE_PATH}${INITIATE_LOGIN_PATH}?${searchParams.toString()}`,
      )

      // Assert
      await expectSignin()
      expect(userManager.signinRedirect).toHaveBeenCalledWith({
        state: params.target_link_uri?.slice(BASE_PATH.length) ?? '/',
        login_hint: params.login_hint,
        prompt: params.prompt,
      })
    },
  )

  it('shows error screen if signin has an error', async () => {
    // Arrange
    const testRoute = `${BASE_PATH}${mockedGetAuthSettings().redirectPath}`
    userManager.signinRedirectCallback.mockRejectedValue(
      new Error('Test error'),
    )

    // Act
    renderAuthenticator(testRoute)

    // Assert
    await screen.findByText('Innskráning mistókst')
    await screen.findByRole('button', { name: 'Reyna aftur' })
  })

  it('shows error screen if IDS is unavailable', async () => {
    // Arrange
    // When the OIDC client library fails to load the /.well-known/openid-configuration
    // the signinRedirect methods rejects the Promise with an Error.
    userManager.signinRedirect.mockRejectedValueOnce(
      new Error('Internal Server Error'),
    )

    // Act
    renderAuthenticator()

    // Assert
    await screen.findByText('Innskráning mistókst')
    await screen.findByRole('button', { name: 'Reyna aftur' })
  })
})
