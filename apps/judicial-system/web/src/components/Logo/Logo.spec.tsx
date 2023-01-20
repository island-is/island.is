import React from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'

import * as constants from '@island.is/judicial-system/consts'

import { UserProvider } from '../UserProvider/UserProvider'
import { mockJudgeQuery } from '../../utils/mocks'

import Logo from './Logo'

describe('Logo', () => {
  test('should display the current users institution', async () => {
    // Arrange
    const routes = [
      {
        path: constants.RESTRICTION_CASE_DEFENDANT_ROUTE,
        element: (
          <MockedProvider mocks={[...mockJudgeQuery]} addTypename={false}>
            <UserProvider authenticated={true}>
              <Logo />
            </UserProvider>
          </MockedProvider>
        ),
      },
    ]

    const router = createMemoryRouter(routes, {
      initialEntries: [constants.RESTRICTION_CASE_DEFENDANT_ROUTE],
    })

    // Act
    render(<RouterProvider router={router} />)

    // Assert
    expect(await screen.findByText('Héraðsdómur')).toBeInTheDocument()
    expect(await screen.findByText('Reykjavíkur')).toBeInTheDocument()
  })
})
