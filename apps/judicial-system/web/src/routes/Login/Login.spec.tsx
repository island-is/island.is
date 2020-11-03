import React from 'react'
import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { userContext } from '../../utils/userContext'

import Login from './Login'
import { mockJudge } from '../../utils/mocks'
import { User } from '@island.is/judicial-system/types'
import { api } from '../../services'

const mockJudgeUserContext = {
  isAuthenticated: () => false,
  user: mockJudge,
  setUser: (_: User) => undefined,
}

describe('Login route', () => {
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

  test('should logout a logged in user', () => {
    // Arrange
    const spy = jest.spyOn(api, 'logOut')

    // Act
    render(
      <userContext.Provider value={mockJudgeUserContext}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </userContext.Provider>,
    )

    // Assert
    expect(spy).toHaveBeenCalled()
  })
})
