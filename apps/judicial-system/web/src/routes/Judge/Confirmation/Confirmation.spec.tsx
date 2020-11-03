import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { Confirmation } from './Confirmation'
import { CaseAppealDecision } from '@island.is/judicial-system/types'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import { MemoryRouter, Route } from 'react-router-dom'
import * as Constants from '../../../utils/constants'
import {
  mockCaseQueries,
  mockJudgeUserContext,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'

describe('Confirmation route', () => {
  test(`should not display prosecutor or judge appeal announcements if appeal decition is not ${CaseAppealDecision.APPEAL}`, async () => {
    // Arrange

    // Act
    render(
      <MockedProvider mocks={mockCaseQueries} addTypename={false}>
        <userContext.Provider value={mockJudgeUserContext}>
          <MemoryRouter
            initialEntries={[`${Constants.CONFIRMATION_ROUTE}/test_id_2`]}
          >
            <Route path={`${Constants.CONFIRMATION_ROUTE}/:id`}>
              <Confirmation />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(() => screen.queryByText('accusedAppealAnnouncement test')),
    ).toBeNull()
    expect(
      await waitFor(() =>
        screen.queryByText('prosecutorAppealAnnouncement test'),
      ),
    ).toBeNull()
  })

  test(`should display prosecutor and judge appeal announcements if appeal decition is ${CaseAppealDecision.APPEAL}`, async () => {
    // Arrange

    // Act
    const { getByText } = render(
      <MockedProvider mocks={mockCaseQueries} addTypename={false}>
        <userContext.Provider value={mockJudgeUserContext}>
          <MemoryRouter
            initialEntries={[`${Constants.CONFIRMATION_ROUTE}/test_id`]}
          >
            <Route path={`${Constants.CONFIRMATION_ROUTE}/:id`}>
              <Confirmation />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(() => getByText('accusedAppealAnnouncement test')),
    ).toBeTruthy()
    expect(
      await waitFor(() => getByText('prosecutorAppealAnnouncement test')),
    ).toBeTruthy()
  })
})
