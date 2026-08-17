import { MockedProvider } from '@apollo/client/testing'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import { UsersDocument } from './users.generated'
import { Users } from './Users'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      push: jest.fn(),
    }
  },
}))

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useInstitution',
  () => ({
    __esModule: true,
    default: () => ({
      allInstitutions: [],
      loading: false,
      loaded: true,
    }),
  }),
)

const users = [
  {
    id: '1',
    name: 'Anna',
    role: UserRole.PROSECUTOR,
    institution: { id: 'inst-c', name: 'C-stofnun' },
    active: true,
    canConfirmIndictment: false,
  },
  {
    id: '2',
    name: 'Björn',
    role: UserRole.DISTRICT_COURT_JUDGE,
    institution: { id: 'inst-a', name: 'A-stofnun' },
    active: true,
    canConfirmIndictment: false,
  },
  {
    id: '3',
    name: 'Cecilía',
    role: UserRole.PROSECUTOR_REPRESENTATIVE,
    institution: { id: 'inst-b', name: 'B-stofnun' },
    active: true,
    canConfirmIndictment: false,
  },
]

const renderUsers = () =>
  render(
    <MockedProvider
      mocks={[
        {
          request: { query: UsersDocument },
          result: { data: { users } },
        },
      ]}
      addTypename={false}
    >
      <IntlProviderWrapper>
        <UserContextWrapper userRole={UserRole.ADMIN}>
          <Users />
        </UserContextWrapper>
      </IntlProviderWrapper>
    </MockedProvider>,
  )

const rowNames = () =>
  screen
    .getAllByRole('button', { name: 'Opna notanda' })
    .map((row) => within(row).getAllByText(/Anna|Björn|Cecilía/)[0].textContent)

describe('Users', () => {
  it('sorts by the Icelandic role label, not the English enum value', async () => {
    const user = userEvent.setup()
    renderUsers()

    await user.click(
      await screen.findByRole('button', { name: 'Raða eftir dálki: Hlutverk' }),
    )

    // Visible labels: Dómari, Fulltrúi, Saksóknari.
    // English enum order would instead be Björn, Anna, Cecilía.
    expect(rowNames()).toEqual(['Björn', 'Cecilía', 'Anna'])
  })

  it('sorts by institution name', async () => {
    const user = userEvent.setup()
    renderUsers()

    await user.click(
      await screen.findByRole('button', { name: 'Raða eftir dálki: Stofnun' }),
    )

    expect(rowNames()).toEqual(['Björn', 'Cecilía', 'Anna'])
  })

  it('points aria-describedby at the table caption id', async () => {
    renderUsers()

    const table = await screen.findByTestId('users-table')
    const describedBy = table.getAttribute('aria-describedby')

    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy ?? '')).toHaveTextContent(
      'Notendur',
    )
  })
})
