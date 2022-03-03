import React from 'react'
import { Router } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'

import * as Constants from '@island.is/judicial-system/consts'

import { mockJudgeQuery } from '../../utils/mocks'
import UserProvider from '../UserProvider/UserProvider'

import Logo from './Logo'

describe('Logo', () => {
  test('should display the current users institution', async () => {
    // Arrange
    const history = createMemoryHistory()
    history.push(Constants.STEP_ONE_ROUTE)

    render(
      <MockedProvider mocks={[...mockJudgeQuery]} addTypename={false}>
        <Router history={history}>
          <UserProvider authenticated={true}>
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
