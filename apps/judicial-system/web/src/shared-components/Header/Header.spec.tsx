import { createMemoryHistory } from 'history'
import { Header } from './'
import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import * as Constants from '../../utils/constants'
import { User } from '@island.is/judicial-system/types'
import { MockedProvider } from '@apollo/client/testing'
import { mockJudge } from '../../utils/mocks'
import { userContext } from '../../utils/userContext'
import { UserQuery } from './Header'

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

describe('Header', () => {
  test('should direct users to detention requests route when user click the logo', () => {
    // Arrange
    const history = createMemoryHistory()
    history.push(Constants.SINGLE_REQUEST_BASE_ROUTE)
    const { getByTestId } = render(
      <Router history={history}>
        <Header pathname={Constants.DETENTION_REQUESTS_ROUTE} />
      </Router>,
    )
    const logo = getByTestId('link-to-home')

    // Act
    expect(history.location.pathname).toEqual(
      Constants.SINGLE_REQUEST_BASE_ROUTE,
    )
    userEvent.click(logo)

    // Assert
    expect(history.location.pathname).toEqual(
      Constants.DETENTION_REQUESTS_ROUTE,
    )
  })

  test('should load the user', async () => {
    const history = createMemoryHistory()

    const mockUserContext = {
      isAuthenticated: () => true,
      user: null,
      setUser: (user: User) => (mockUserContext.user = user),
    }

    const { getByTestId } = render(
      <MockedProvider mocks={[mockJudgeQuery]} addTypename={false}>
        <userContext.Provider value={mockUserContext}>
          <Router history={history}>
            <Header pathname="" />
          </Router>
        </userContext.Provider>
      </MockedProvider>,
    )

    await waitFor(() => getByTestId('logout-button'))

    expect(mockUserContext.user).toEqual(mockJudge)
  })
})
