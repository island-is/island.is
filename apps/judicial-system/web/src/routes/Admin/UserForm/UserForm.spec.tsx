import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { User } from '@island.is/judicial-system-web/src/graphql/schema'
import { UserRole } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import UserForm from './UserForm'

jest.mock('next/router', () => ({
  push: jest.fn(),
}))

const newUser: User = {
  id: '',
  active: true,
  canConfirmIndictment: false,
}

const renderForm = (user: User) =>
  render(
    <IntlProviderWrapper>
      <UserContextWrapper userRole={UserRole.ADMIN}>
        <UserForm
          user={user}
          institutions={[]}
          onSave={jest.fn()}
          loading={false}
        />
      </UserContextWrapper>
    </IntlProviderWrapper>,
  )

describe('UserForm', () => {
  let mockFetch: jest.Mock

  beforeEach(() => {
    mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ items: [{ name: 'Gervimaður Afríka' }] }),
    })
    global.fetch = mockFetch
  })

  it('should fill in the name from the national registry for a new user', async () => {
    renderForm(newUser)

    await userEvent.type(screen.getByTestId('nationalId'), '0101302989')

    await waitFor(() =>
      expect(screen.getByRole('textbox', { name: /^Nafn/ })).toHaveValue(
        'Gervimaður Afríka',
      ),
    )
  })

  it('should allow the name to be changed after a national registry lookup', async () => {
    renderForm(newUser)

    await userEvent.type(screen.getByTestId('nationalId'), '0101302989')

    const nameInput = screen.getByRole('textbox', { name: /^Nafn/ })

    await waitFor(() => expect(nameInput).toHaveValue('Gervimaður Afríka'))

    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Jón Jónsson')

    expect(nameInput).toHaveValue('Jón Jónsson')
  })

  it('should not look up existing users in the national registry', async () => {
    renderForm({
      ...newUser,
      id: 'some-id',
      nationalId: '0101302989',
      name: 'Upprunalegt Nafn',
    })

    const nameInput = screen.getByRole('textbox', { name: /^Nafn/ })

    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Jón Jónsson')

    expect(nameInput).toHaveValue('Jón Jónsson')
    expect(mockFetch).not.toHaveBeenCalled()
  })
})
