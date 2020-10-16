import React from 'react'
import { render } from '@testing-library/react'
import { Confirmation } from './Confirmation'
import { CaseAppealDecision } from '@island.is/judicial-system/types'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

describe('Confirmation route', () => {
  test(`should not display prosecutor or judge appeal announcements if appeal decition is not ${CaseAppealDecision.APPEAL}`, () => {
    // Arrange
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
    const { queryByText } = render(<Confirmation />)

    // Assert
    expect(queryByText('accusedAppealAnnouncement test')).toBeNull()
    expect(queryByText('prosecutorAppealAnnouncement test')).toBeNull()
  })

  test(`should display prosecutor and judge appeal announcements if appeal decition is ${CaseAppealDecision.APPEAL}`, () => {
    // Arrange
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
    const { queryByText } = render(<Confirmation />)

    // Assert
    expect(queryByText('accusedAppealAnnouncement test')).toBeTruthy()
    expect(queryByText('prosecutorAppealAnnouncement test')).toBeTruthy()
  })
})
