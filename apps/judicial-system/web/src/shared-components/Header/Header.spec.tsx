import React from 'react'
import { render, screen } from '@testing-library/react'
import { Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'

import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { MockedProvider } from '@apollo/client/testing'
import {
  mockAdmin,
  mockAdminQuery,
  mockProsecutor,
  mockProsecutorQuery,
} from '../../utils/mocks'
import { UserProvider } from '..'
import { Header } from './'

describe('Header', () => {
  test('should direct normal users to detention requests route when user click the logo', async () => {
    // Arrange
    const history = createMemoryHistory()
    history.push(Constants.STEP_ONE_ROUTE)

    render(
      <MockedProvider mocks={mockProsecutorQuery} addTypename={false}>
        <Router history={history}>
          <UserProvider>
            <Header pathname={Constants.REQUEST_LIST_ROUTE} />
          </UserProvider>
        </Router>
      </MockedProvider>,
    )

    // wait for login to complete
    await screen.findByRole('button', { name: mockProsecutor.name })

    // Act
    expect(history.location.pathname).toEqual(Constants.STEP_ONE_ROUTE)
    userEvent.click(await screen.findByTestId('link-to-home'))

    // Assert
    expect(history.location.pathname).toEqual(Constants.REQUEST_LIST_ROUTE)
  })

  test('should direct admin users to user overview route when user click the logo', async () => {
    // Arrange
    const history = createMemoryHistory()
    history.push(Constants.USER_NEW_ROUTE)

    render(
      <MockedProvider mocks={mockAdminQuery} addTypename={false}>
        <Router history={history}>
          <UserProvider>
            <Header pathname={Constants.USER_LIST_ROUTE} />
          </UserProvider>
        </Router>
      </MockedProvider>,
    )

    // wait for login to complete
    await screen.findByRole('button', { name: mockAdmin.name })

    // Act
    expect(history.location.pathname).toEqual(Constants.USER_NEW_ROUTE)
    userEvent.click(await screen.findByTestId('link-to-home'))

    // Assert
    expect(history.location.pathname).toEqual(Constants.USER_LIST_ROUTE)
  })
})
