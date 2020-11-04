import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import Overview from './Overview'
import * as Constants from '../../../utils/constants'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import { MemoryRouter, Route } from 'react-router-dom'
import {
  mockCaseQueries,
  mockProsecutorUserContext,
} from '../../../utils/mocks'
import { MockedProvider } from '@apollo/client/testing'

describe('/stofna-krofu/yfirlit', () => {
  test('should display the approprieate custody provisions', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider mocks={mockCaseQueries} addTypename={false}>
        <userContext.Provider value={mockProsecutorUserContext}>
          <MemoryRouter
            initialEntries={[`${Constants.STEP_THREE_ROUTE}/test_id`]}
          >
            <Route path={`${Constants.STEP_THREE_ROUTE}/:id`}>
              <Overview />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(() => screen.getByText('a-lið 1. mgr. 95. gr.')),
    ).toBeTruthy()
    expect(screen.getByText('c-lið 1. mgr. 95. gr.')).toBeTruthy()
  })
})
