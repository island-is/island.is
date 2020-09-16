import React from 'react'
import { act, render, waitFor } from '@testing-library/react'
import { RulingStepOne, RulingStepTwo } from './'
import * as Constants from '../../../utils/constants'
import { CaseAppealDecision } from '@island.is/judicial-system/types'
import userEvent from '@testing-library/user-event'
import fetchMock from 'fetch-mock'

describe('Ruling routes', () => {
  describe(Constants.RULING_STEP_ONE_ROUTE, () => {
    test('should now allow users to continue unless every required field has been filled out', async () => {
      // Arrange

      // Have custodyEndDate in localstorage because it's hard to use the datepicker with useEvents
      Storage.prototype.getItem = jest.fn(() => {
        return JSON.stringify({
          custodyEndDate: '2020-10-24',
        })
      })

      Storage.prototype.setItem = jest.fn()

      // Act and Assert
      const { getByTestId } = render(<RulingStepOne />)

      await act(async () => {
        await userEvent.type(
          getByTestId('ruling') as HTMLInputElement,
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Non igitur bene. Idem fecisset Epicurus, si sententiam hanc, quae nunc Hieronymi est, coniunxisset cum Aristippi vetere sententia. Respondent extrema primis, media utrisque, omnia omnibus. Nam prius a se poterit quisque discedere quam appetitum earum rerum, quae sibi conducant, amittere. Duo Reges: constructio interrete. Sed quae tandem ista ratio est?',
        )
        userEvent.tab()
        expect(
          (getByTestId('continueButton') as HTMLButtonElement).disabled,
        ).toBe(true)

        await userEvent.type(
          getByTestId('custodyEndTime') as HTMLInputElement,
          '12:31',
        )
        userEvent.tab()
        expect(
          (getByTestId('continueButton') as HTMLButtonElement).disabled,
        ).toBe(false)
      })
    })
  })

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
