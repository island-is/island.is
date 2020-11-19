import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import Overview from './Overview'
import * as Constants from '../../../utils/constants'
import { MemoryRouter, Route } from 'react-router-dom'
import { mockCaseQueries, mockProsecutorQuery } from '../../../utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'

describe('/stofna-krofu/yfirlit', () => {
  test('should display the approprieate custody provisions', async () => {
    // Arrange
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.STEP_THREE_ROUTE}/test_id`]}
        >
          <UserProvider>
            <Route path={`${Constants.STEP_THREE_ROUTE}/:id`}>
              <Overview />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(() => screen.getByText('a-lið 1. mgr. 95. gr.')),
    ).toBeTruthy()
    expect(screen.getByText('c-lið 1. mgr. 95. gr.')).toBeTruthy()
  })
})
