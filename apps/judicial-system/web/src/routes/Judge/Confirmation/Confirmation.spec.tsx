import React from 'react'
import { createMemoryHistory } from 'history'
import { render } from '@testing-library/react'
import { Confirmation } from './Confirmation'
import { CaseAppealDecision } from '@island.is/judicial-system/types'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import { mockJudge } from '@island.is/judicial-system-web/src/utils/mocks'
import { Router } from 'react-router-dom'

describe('Confirmation route', () => {
  test(`should not display prosecutor or judge appeal announcements if appeal decition is not ${CaseAppealDecision.APPEAL}`, () => {
    // Arrange
    const history = createMemoryHistory()
    Storage.prototype.getItem = jest.fn(() => {
      return JSON.stringify({
        id: 'test_id',
        accusedAppealAnnouncement: 'accusedAppealAnnouncement test',
        accusedAppealDecision: CaseAppealDecision.ACCEPT,
        prosecutorAppealAnnouncement: 'prosecutorAppealAnnouncement test',
        prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
        custodyRestrictions: [],
      })
    })

    // Act
    const { queryByText } = render(
      <userContext.Provider value={{ user: mockJudge }}>
        <Router history={history}>
          <Confirmation />
        </Router>
      </userContext.Provider>,
    )

    // Assert
    expect(queryByText('accusedAppealAnnouncement test')).toBeNull()
    expect(queryByText('prosecutorAppealAnnouncement test')).toBeNull()
  })

  test(`should display prosecutor and judge appeal announcements if appeal decition is ${CaseAppealDecision.APPEAL}`, () => {
    // Arrange
    const history = createMemoryHistory()
    Storage.prototype.getItem = jest.fn(() => {
      return JSON.stringify({
        id: 'test_id',
        accusedAppealAnnouncement: 'accusedAppealAnnouncement test',
        accusedAppealDecision: CaseAppealDecision.APPEAL,
        prosecutorAppealAnnouncement: 'prosecutorAppealAnnouncement test',
        prosecutorAppealDecision: CaseAppealDecision.APPEAL,
        custodyRestrictions: [],
      })
    })

    // Act
    const { queryByText } = render(
      <userContext.Provider value={{ user: mockJudge }}>
        <Router history={history}>
          <Confirmation />
        </Router>
      </userContext.Provider>,
    )

    // Assert
    expect(queryByText('accusedAppealAnnouncement test')).toBeTruthy()
    expect(queryByText('prosecutorAppealAnnouncement test')).toBeTruthy()
  })
})
