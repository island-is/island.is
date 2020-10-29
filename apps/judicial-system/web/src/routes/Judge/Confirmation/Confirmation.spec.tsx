import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { Confirmation } from './Confirmation'
import { CaseAppealDecision } from '@island.is/judicial-system/types'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import { mockJudge } from '@island.is/judicial-system-web/src/utils/mocks'
import { MemoryRouter, Route } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import * as Constants from '../../../utils/constants'

describe('Confirmation route', () => {
  test(`should not display prosecutor or judge appeal announcements if appeal decition is not ${CaseAppealDecision.APPEAL}`, async () => {
    // Arrange
    fetchMock.mock(
      '/api/case/test_id',
      {
        id: 'test_id',
        accusedAppealAnnouncement: 'accusedAppealAnnouncement test',
        accusedAppealDecision: CaseAppealDecision.ACCEPT,
        prosecutorAppealAnnouncement: 'prosecutorAppealAnnouncement test',
        prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
        custodyRestrictions: [],
      },
      { method: 'get' },
    )

    // Act
    const { getByText } = render(
      <userContext.Provider value={{ user: mockJudge }}>
        <MemoryRouter
          initialEntries={[`${Constants.CONFIRMATION_ROUTE}/test_id`]}
        >
          <Route path={`${Constants.CONFIRMATION_ROUTE}/:id`}>
            <Confirmation />
          </Route>
        </MemoryRouter>
      </userContext.Provider>,
    )

    // Assert
    expect(
      await waitFor(() => getByText('accusedAppealAnnouncement test')),
    ).toBeNull()
    expect(
      await waitFor(() => getByText('prosecutorAppealAnnouncement test')),
    ).toBeNull()
  })

  test(`should display prosecutor and judge appeal announcements if appeal decition is ${CaseAppealDecision.APPEAL}`, async () => {
    // Arrange
    fetchMock.mock(
      '/api/case/test_id',
      {
        id: 'test_id',
        accusedAppealAnnouncement: 'accusedAppealAnnouncement test',
        accusedAppealDecision: CaseAppealDecision.APPEAL,
        prosecutorAppealAnnouncement: 'prosecutorAppealAnnouncement test',
        prosecutorAppealDecision: CaseAppealDecision.APPEAL,
        custodyRestrictions: [],
      },
      { method: 'get', overwriteRoutes: true },
    )

    // Act
    const { queryByText } = render(
      <userContext.Provider value={{ user: mockJudge }}>
        <MemoryRouter
          initialEntries={[`${Constants.CONFIRMATION_ROUTE}/test_id`]}
        >
          <Route path={`${Constants.CONFIRMATION_ROUTE}/:id`}>
            <Confirmation />
          </Route>
        </MemoryRouter>
      </userContext.Provider>,
    )

    // Assert
    expect(
      await waitFor(() => queryByText('accusedAppealAnnouncement test')),
    ).toBeTruthy()
    expect(
      await waitFor(() => queryByText('prosecutorAppealAnnouncement test')),
    ).toBeTruthy()
  })
})
