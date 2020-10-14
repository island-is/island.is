import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { RulingStepTwo } from './'
import * as Constants from '../../../utils/constants'
import { CaseAppealDecision } from '@island.is/judicial-system/types'
import userEvent from '@testing-library/user-event'
import fetchMock from 'fetch-mock'

describe('Ruling routes', () => {
  describe(Constants.RULING_STEP_TWO_ROUTE, () => {
    test('should not have a selected radio button by default', () => {
      // Arrange
      Storage.prototype.getItem = jest.fn(() => {
        return JSON.stringify({
          id: 'test_id',
        })
      })

      // Act
      const { getAllByRole } = render(<RulingStepTwo />)

      // Assert
      expect(
        (getAllByRole('radio') as HTMLInputElement[]).filter(
          (input) => input.checked,
        ),
      ).toHaveLength(0)
    })

    test(`should have a disabled accusedAppealAnnouncement and prosecutorAppealAnnouncement inputs if accusedAppealDecision and prosecutorAppealDecision respectively is not ${CaseAppealDecision.APPEAL}`, async () => {
      // Arrange
      fetchMock.mock('/api/case/test_id', 200)

      // Act
      const { getByText, getByTestId } = render(<RulingStepTwo />)

      await waitFor(() =>
        userEvent.click(getByText('Kærði tekur sér lögboðinn frest')),
      )
      await waitFor(() =>
        userEvent.click(getByText('Sækjandi tekur sér lögboðinn frest')),
      )

      // Assert
      expect(
        getByTestId('accusedAppealAnnouncement').hasAttribute('disabled'),
      ).toEqual(true)

      expect(
        getByTestId('prosecutorAppealAnnouncement').hasAttribute('disabled'),
      ).toEqual(true)
    })

    test(`should not have a disabled accusedAppealAnnouncement and prosecutorAppealAnnouncement inputs if accusedAppealDecision and prosecutorAppealDecision respectively is ${CaseAppealDecision.APPEAL}`, async () => {
      // Arrange

      // Act
      const { getByText, getByTestId } = render(<RulingStepTwo />)

      await waitFor(() => userEvent.click(getByText('Kærði kærir málið')))
      await waitFor(() => userEvent.click(getByText('Sækjandi kærir málið')))

      // Assert
      expect(
        getByTestId('accusedAppealAnnouncement').hasAttribute('disabled'),
      ).toEqual(false)
      expect(
        getByTestId('prosecutorAppealAnnouncement').hasAttribute('disabled'),
      ).toEqual(false)
    })
  })
})
