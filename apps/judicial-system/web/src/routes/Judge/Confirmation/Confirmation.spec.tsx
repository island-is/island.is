import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { Confirmation } from './Confirmation'
import { CaseAppealDecision } from '@island.is/judicial-system/types'
import { MemoryRouter, Route } from 'react-router-dom'
import * as Constants from '../../../utils/constants'
import {
  mockCaseQueries,
  mockJudgeQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'

describe('Confirmation route', () => {
  test(`should not display prosecutor or judge appeal announcements if appeal decition is not ${CaseAppealDecision.APPEAL}`, async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockJudgeQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.CONFIRMATION_ROUTE}/test_id_2`]}
        >
          <UserProvider>
            <Route path={`${Constants.CONFIRMATION_ROUTE}/:id`}>
              <Confirmation />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(() => screen.queryByText('accusedAppealAnnouncement test')),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('prosecutorAppealAnnouncement test'),
    ).not.toBeInTheDocument()
  })

  test(`should display prosecutor and judge appeal announcements if appeal decition is ${CaseAppealDecision.APPEAL}`, async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockJudgeQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.CONFIRMATION_ROUTE}/test_id`]}
        >
          <UserProvider>
            <Route path={`${Constants.CONFIRMATION_ROUTE}/:id`}>
              <Confirmation />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(() => screen.getByText('accusedAppealAnnouncement test')),
    ).toBeInTheDocument()
    expect(
      screen.getByText('prosecutorAppealAnnouncement test'),
    ).toBeInTheDocument()
  })
})
