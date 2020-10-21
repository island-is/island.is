import React from 'react'
import { render } from '@testing-library/react'
import fetchMock from 'fetch-mock'
import { BrowserRouter } from 'react-router-dom'
import { userContext } from '../../utils/userContext'

import Login from './Login'
import { mockJudge } from '../../utils/mocks'
import * as api from '../../api'

describe('Login route', () => {
  test('should render successfully', () => {
    // Arrange
    fetchMock.get('/api/cases', [])
    fetchMock.mock('/api/auth/logout', 200)

    // Act
    const { baseElement } = render(
      <userContext.Provider value={{ user: mockJudge }}>
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
      <userContext.Provider value={{ user: mockJudge }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </userContext.Provider>,
    )

    // Assert
    expect(document.title).toEqual('Réttarvörslugátt')
  })

  test('should logout a logged in user', () => {
    // Arrange
    const spy = jest.spyOn(api, 'logOut')

    // Act
    render(
      <userContext.Provider value={{ user: mockJudge }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </userContext.Provider>,
    )

    // Assert
    expect(spy).toHaveBeenCalled()
  })
})
