import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { BrowserRouter, MemoryRouter, Route } from 'react-router-dom'
import Login from './Login'
import { mockJudgeQuery } from '../../utils/mocks'
import { api } from '../../services'
import fetchMock from 'fetch-mock'
import { UserProvider } from '../../shared-components/UserProvider/UserProvider'
import { MockedProvider } from '@apollo/client/testing'

describe('Login route', () => {
  fetchMock.mock('/api/auth/logout', 200)

  test('should render successfully', () => {
    // Arrange

    // Act
    const { baseElement } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    )

    // Assert
    expect(baseElement).toBeTruthy()
  })

  test('should have a title set', () => {
    // Arrange

    // Act
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    )

    // Assert
    expect(document.title).toEqual('Réttarvörslugátt')
  })

  test('should logout a logged in user', async () => {
    // Arrange
    const spy = jest.spyOn(api, 'logOut')

    // Act
    render(
      <MockedProvider mocks={mockJudgeQuery} addTypename={false}>
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
