import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { Confirmation } from './Confirmation'
import {
  CaseAppealDecision,
  UpdateCase,
} from '@island.is/judicial-system/types'
import { MemoryRouter, Route } from 'react-router-dom'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  mockCaseQueries,
  mockJudgeQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import userEvent from '@testing-library/user-event'

describe('Confirmation route', () => {
  test(`should not allow users to continue unless every required field has been filled out`, async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation([
            {
              courtStartTime: '2020-09-16T15:55:000Z',
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.CONFIRMATION_ROUTE}/test_id_5`]}
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
      await screen.findByRole('button', {
        name: /Staðfesta og hefja undirritun/i,
      }),
    ).toBeDisabled()

    userEvent.type(await screen.findByLabelText('Þinghaldi lauk *'), '15:55')

    expect(
      await screen.findByRole('button', {
        name: /Staðfesta og hefja undirritun/i,
      }),
    ).not.toBeDisabled()
  })

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
      await screen.findByText('accusedAppealAnnouncement test'),
    ).toBeInTheDocument()

    expect(
      await screen.findByText('prosecutorAppealAnnouncement test'),
    ).toBeInTheDocument()
  })
})
