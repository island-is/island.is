import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import Overview from './Overview'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { MemoryRouter, Route } from 'react-router-dom'
import {
  mockCaseQueries,
  mockProsecutorQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'

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

  test('should display the custody end date of the parent case of an extended case', async () => {
    // Arrange
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.STEP_THREE_ROUTE}/test_id_8`]}
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
    expect(await waitFor(() => screen.getByText('Fyrri gæsla'))).toBeTruthy()
    expect(screen.getByText('Mánud. 18. janúar 2021 kl. 19:50')).toBeTruthy()
  })
})
