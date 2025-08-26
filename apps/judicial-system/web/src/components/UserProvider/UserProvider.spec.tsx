import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'

import { Header } from '@island.is/judicial-system-web/src/components'
import { mockJudgeQuery } from '@island.is/judicial-system-web/src/utils/mocks'
import { LocaleProvider } from '@island.is/localization'

import { UserProvider } from './UserProvider'

describe('UserProvider', () => {
  test('should load the user', async () => {
    render(
      <MockedProvider mocks={mockJudgeQuery} addTypename={false}>
        <UserProvider authenticated={true}>
          <LocaleProvider locale="is" messages={{}}>
            <Header />
          </LocaleProvider>
        </UserProvider>
      </MockedProvider>,
    )

    /**
     * A logout button is displayed in the header when a user is logged in.
     * By ensuring that that button is in the document we know that the
     * user is being set.
     */
    expect(
      await screen.findByRole('button', {
        name: 'Notendaupplýsingar fyrir Wonder Woman',
      }),
    ).toBeInTheDocument()
  })
})
