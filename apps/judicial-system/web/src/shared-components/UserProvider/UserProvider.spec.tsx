import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { MemoryRouter, Route } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing'
import { mockJudge } from '../../utils/mocks'
import { UserQuery } from './UserProvider'
import { UserProvider } from './UserProvider'
import * as Constants from '../../utils/constants'
import { Header } from '../Header'

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
      await waitFor(() => screen.getByRole('button', { name: 'Wonder Woman' })),
    ).toBeInTheDocument()
  })
})
