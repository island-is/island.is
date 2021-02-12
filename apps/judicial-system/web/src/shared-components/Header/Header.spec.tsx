import { createMemoryHistory } from 'history'
import { Header } from './'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Router } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { MockedProvider } from '@apollo/client/testing'
import { mockProsecutorQuery } from '../../utils/mocks'
import { UserProvider } from '..'

describe('Header', () => {
  test('should direct users to detention requests route when user click the logo', async () => {
    // Arrange
    const history = createMemoryHistory()
    history.push(Constants.STEP_ONE_ROUTE)
    const { getByTestId } = render(
      <MockedProvider mocks={mockProsecutorQuery} addTypename={false}>
        <Router history={history}>
          <UserProvider>
            <Header pathname={Constants.REQUEST_LIST_ROUTE} />
          </UserProvider>
        </Router>
      </MockedProvider>,
    )

    // wait for login to complete
    await screen.findByTestId('logout-button')

    const logo = getByTestId('link-to-home')

    // Act
    expect(history.location.pathname).toEqual(Constants.STEP_ONE_ROUTE)
    userEvent.click(logo)

    // Assert
    console.log('!!!!!!!!', history.location.pathname)
    expect(history.location.pathname).toEqual(Constants.REQUEST_LIST_ROUTE)
  })
})
