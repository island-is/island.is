import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing'
import { mockJudge } from '@island.is/judicial-system-web/src/utils/mocks'
import { UserQuery } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import {
  UserProvider,
  Header,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

const mockJudgeQuery = {
  request: {
    query: UserQuery,
  },
  result: {
    data: {
      user: mockJudge,
    },
  },
}

describe('UserProvider', () => {
  test('should load the user', async () => {
    render(
      <MockedProvider mocks={[mockJudgeQuery]} addTypename={false}>
        <MemoryRouter initialEntries={[Constants.DETENTION_REQUESTS_ROUTE]}>
          <Route path={Constants.DETENTION_REQUESTS_ROUTE}>
            <UserProvider>
              <Header pathname={Constants.DETENTION_REQUESTS_ROUTE} />
            </UserProvider>
          </Route>
        </MemoryRouter>
      </MockedProvider>,
    )

    /**
     * A logout button is displayed in the header when a user is logged in.
     * By ensuring that that button is in the document we know that the
     * user is being set.
     */
    expect(
      await screen.findByRole('button', { name: 'Wonder Woman' }),
    ).toBeInTheDocument()
  })
})
