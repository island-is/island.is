import React from 'react'
import { render, waitFor } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import { MockedProvider } from '@apollo/client/testing'

import { mockJudgeQuery } from '@island.is/judicial-system-web/src/utils/mocks'
import { api } from '@island.is/judicial-system-web/src/services'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import Login from './Login'

describe('Login route', () => {
  fetchMock.mock('/api/auth/logout', 200)

  test('should render successfully', () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: {},
    }))

    // Act
    const { baseElement } = render(<Login />)

    // Assert
    expect(baseElement).toBeTruthy()
  })

  test('should have a title set', () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: {},
    }))

    // Act
    render(<Login />)

    // Assert
    expect(document.title).toEqual('Réttarvörslugátt')
  })

  test('should logout a logged in user', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: {},
    }))
    const spy = jest.spyOn(api, 'logOut')

    // Act
    render(
      <MockedProvider mocks={mockJudgeQuery} addTypename={false}>
        <UserProvider authenticated={true}>
          <Login />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    await waitFor(() => expect(spy).toHaveBeenCalled())
  })
})
