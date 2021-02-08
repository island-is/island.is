import { createMemoryHistory } from 'history'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Router } from 'react-router-dom'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import Logo from './Logo'
import UserProvider from '../UserProvider/UserProvider'
import { mockJudgeQuery } from '../../utils/mocks'
import { MockedProvider } from '@apollo/client/testing'

describe('Logo', () => {
  test('should display the current users institution', async () => {
    // Arrange
    const history = createMemoryHistory()
    history.push(Constants.STEP_ONE_ROUTE)

    render(
      <MockedProvider mocks={[...mockJudgeQuery]} addTypename={false}>
        <Router history={history}>
          <UserProvider>
            <Logo />
          </UserProvider>
        </Router>
      </MockedProvider>,
    )

    expect(
      await screen.findByText('Héraðsdómur Reykjavíkur'),
    ).toBeInTheDocument()
  })
})
