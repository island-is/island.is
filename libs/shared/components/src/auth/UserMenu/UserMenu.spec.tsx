import { MockedProvider } from '@apollo/client/testing'
import { LocaleContext, LocaleProvider } from '@island.is/localization'
import {
  BffContext,
  BffContextType,
  createMockedInitialState,
} from '@island.is/react-spa/bff'
import { BffUser } from '@island.is/shared/types'
import '@testing-library/jest-dom'
import {
  act,
  fireEvent,
  getByRole,
  getByText,
  render,
  screen,
} from '@testing-library/react'
import React, { FC, ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ActorDelegationsQuery, GetUserProfileQuery } from '../../../gen/schema'
import { UserMenu } from './UserMenu'
import { ACTOR_DELEGATIONS } from './actorDelegations.graphql'
import { USER_PROFILE } from './userProfile.graphql'

const delegation = {
  name: 'Phil',
  nationalId: '1111111111',
}

const mockedUser = createMockedInitialState().userInfo

const mocks = [
  {
    request: {
      query: ACTOR_DELEGATIONS,
    },
    result: {
      data: {
        authActorDelegations: [
          {
            from: delegation,
          },
        ],
      } as ActorDelegationsQuery,
    },
  },
  {
    request: {
      query: USER_PROFILE,
    },
    result: {
      data: {
        getIslykillSettings: {
          email: 'test@test.is',
          mobile: '0000000',
        },
      } as GetUserProfileQuery,
    },
  },
]

const wrapper: FC<React.PropsWithChildren<unknown>> = ({ children }) => (
  <MockedProvider mocks={mocks} addTypename={false}>
    <BrowserRouter>
      <LocaleProvider skipPolyfills>{children}</LocaleProvider>
    </BrowserRouter>
  </MockedProvider>
)

const openMenu = async () => {
  // Open user dropdown and wait for a few promise updates.
  await act(async () => {
    fireEvent.click(screen.getAllByRole('button', { name: /útskráning/i })[0])
  })
  return screen.getByRole('dialog', { name: /útskráning/i })
}

describe('UserMenu', () => {
  let switchUser: (nationalId?: string) => void
  let signOut: () => void

  const renderAuthenticated = (
    ui: ReactNode,
    user: {
      profile?: Partial<BffUser['profile']>
      scopes?: Partial<BffUser['scopes']>
    } | null = null,
  ) =>
    render(
      <BffContext.Provider
        value={
          {
            userInfo: user as BffUser,
            switchUser,
            signOut,
          } as BffContextType
        }
      >
        {ui}
      </BffContext.Provider>,
      {
        wrapper,
      },
    )

  beforeEach(() => {
    switchUser = jest.fn()
    signOut = jest.fn()
  })

  it('renders nothing when not authenticated', () => {
    // Act
    renderAuthenticated(<UserMenu />)

    // Assert
    expect(screen.queryByRole('button', { name: /útskráning/i })).toBeNull()
  })

  it('shows user menu when authenticated', async () => {
    // Act
    renderAuthenticated(<UserMenu />, {
      profile: {
        name: 'John',
      },
    })

    // Assert
    const button = screen.getAllByRole('button', { name: /útskráning/i })[0]
    expect(button).toHaveTextContent('John')
  })

  it('shows delegation name when authenticated with delegations', async () => {
    // Act
    renderAuthenticated(<UserMenu />, {
      profile: {
        name: 'John',
        actor: { name: 'Anna', nationalId: '2222222222' },
      },
    })

    // Assert
    const button = screen.getAllByRole('button', { name: /útskráning/i })
    expect(button[0]).toHaveTextContent('John')
    expect(button[1]).toHaveTextContent('Anna')
  })

  it('can open and close user menu', async () => {
    // Arrange
    renderAuthenticated(<UserMenu />, { profile: { name: 'John' } })

    // Act
    const dialog = await openMenu()

    // Assert
    getByText(dialog, 'John')

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Loka' }))

    // Assert
    expect(screen.queryByRole('dialog', { name: /útskráning/i })).toBeNull()
  })
  it('can log out user', async () => {
    // Arrange
    renderAuthenticated(<UserMenu />, mockedUser)
    await openMenu()

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Útskrá' }))

    // Assert
    expect(screen.queryByRole('dialog', { name: /útskráning/i })).toBeNull()
    expect(signOut).toHaveBeenCalled()
  })

  it('can switch languages using selectbox', async () => {
    // Arrange
    renderAuthenticated(
      <>
        <UserMenu showDropdownLanguage />
        <LocaleContext.Consumer>
          {({ lang }) => <span>Current: {lang}</span>}
        </LocaleContext.Consumer>
      </>,
      mockedUser,
    )
    const dialog = await openMenu()
    const languageSelector = dialog.querySelector('#language-switcher')!
    expect(languageSelector).not.toBeNull()
    expect(screen.getByText(/Current/)).toHaveTextContent('Current: is')

    // Act
    fireEvent.mouseDown(
      languageSelector.querySelector('.island-select__dropdown-indicator')!,
      { button: 1 },
    )
    fireEvent.click(screen.getByText('English'))

    // Assert
    expect(screen.getByText(/Current/)).toHaveTextContent('Current: en')
  })

  it('can switch languages using button', async () => {
    // Arrange
    renderAuthenticated(
      <>
        <UserMenu fullscreen showLanguageSwitcher />
        <LocaleContext.Consumer>
          {({ lang }) => <span>Current: {lang}</span>}
        </LocaleContext.Consumer>
      </>,
      mockedUser,
    )
    const languageSelector = screen.getByTestId('language-switcher-button')
    expect(languageSelector).not.toBeNull()
    expect(screen.getByText(/Current/)).toHaveTextContent('Current: is')
    // Act
    fireEvent.click(screen.getByText('EN'))

    // Assert
    expect(screen.getByText(/Current/)).toHaveTextContent('Current: en')
  })

  it('can switch between delegations', async () => {
    // Arrange
    renderAuthenticated(<UserMenu />, mockedUser)
    const dialog = await openMenu()
    const delegationButton = getByRole(dialog, 'button', {
      name: 'Skipta um notanda',
    })

    // Act
    act(() => {
      fireEvent.click(delegationButton)
    })

    // Assert
    expect(switchUser).toHaveBeenCalled()
  })

  it('hides language switcher', async () => {
    // Arrange
    renderAuthenticated(<UserMenu showLanguageSwitcher={false} />, mockedUser)

    // Assert
    const languageSelector = await screen.queryByTestId(
      'language-switcher-button',
    )
    expect(languageSelector).toBeNull()
  })

  it('user button shows icon only in mobile and not name', async () => {
    // Act
    renderAuthenticated(<UserMenu iconOnlyMobile />, {
      profile: { name: 'John' },
    })

    // Assert
    const button = await screen.getAllByRole('button')[0]
    expect(button).not.toHaveTextContent('John')
  })
})
