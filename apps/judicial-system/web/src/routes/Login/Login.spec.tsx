import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { BrowserRouter, MemoryRouter, Route } from 'react-router-dom'
import { userContext } from '../../utils/userContext'

import Login from './Login'
import { mockJudge } from '../../utils/mocks'
import { User } from '@island.is/judicial-system/types'
import { api } from '../../services'
import fetchMock from 'fetch-mock'
import {
  UserProvider,
  UserQuery,
} from '../../shared-components/UserProvider/UserProvider'
import { MockedProvider } from '@apollo/client/testing'
import * as Constants from '../../utils/constants'

const mockJudgeUserContext = {
  isAuthenticated: () => false,
  user: mockJudge,
  setUser: (_: User) => undefined,
}

describe('Login route', () => {
  fetchMock.mock('/api/auth/logout', 200)

  test('should render successfully', () => {
    // Arrange

    // Act
    const { baseElement } = render(
      <userContext.Provider value={mockJudgeUserContext}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </userContext.Provider>,
    )

    // Assert
    expect(baseElement).toBeTruthy()
  })

  test('should have a title set', () => {
    // Arrange

    // Act
    render(
      <userContext.Provider value={mockJudgeUserContext}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </userContext.Provider>,
    )

    // Assert
    expect(document.title).toEqual('Réttarvörslugátt')
  })

  test('should logout a logged in user', async () => {
    // Arrange
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

    const spy = jest.spyOn(api, 'logOut')

    // Act
    render(
      <MockedProvider mocks={[mockJudgeQuery]} addTypename={false}>
        <MemoryRouter initialEntries={['/']}>
          <Route path="/">
            <UserProvider>
              <Login />
            </UserProvider>
          </Route>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    await waitFor(() => expect(spy).toHaveBeenCalled())
  })
})
