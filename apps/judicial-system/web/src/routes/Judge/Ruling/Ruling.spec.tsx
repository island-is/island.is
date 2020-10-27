import React from 'react'
import { act, render, waitFor } from '@testing-library/react'
import { RulingStepOne, RulingStepTwo } from './'
import * as Constants from '../../../utils/constants'
import { CaseAppealDecision } from '@island.is/judicial-system/types'
import userEvent from '@testing-library/user-event'
import fetchMock from 'fetch-mock'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import { mockJudge } from '@island.is/judicial-system-web/src/utils/mocks'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'

describe('Ruling routes', () => {
  describe(Constants.RULING_STEP_ONE_ROUTE, () => {
    test('should now allow users to continue unless every required field has been filled out', async () => {
      // Arrange

      // Have custodyEndDate in sessionstorage because it's hard to use the datepicker with useEvents
      Storage.prototype.getItem = jest.fn(() => {
        return JSON.stringify({
          custodyEndDate: '2020-10-24',
        })
      })

      Storage.prototype.setItem = jest.fn()

      // Act and Assert
      const { getByTestId } = render(
        <userContext.Provider value={{ user: mockJudge }}>
          <RulingStepOne />
        </userContext.Provider>,
      )

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

    test('should not have a disabled continue button by default if case data is valid', () => {
      // Arrange
      Storage.prototype.getItem = jest.fn(() => {
        return JSON.stringify({
          ruling:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Qui autem de summo bono dissentit de tota philosophiae ratione dissentit. Sed est forma eius disciplinae, sicut fere ceterarum, triplex: una pars est naturae, disserendi altera, vivendi tertia. Facit enim ille duo seiuncta ultima bonorum, quae ut essent vera, coniungi debuerunt; Tu enim ista lenius, hic Stoicorum more nos vexat. Si est nihil nisi corpus, summa erunt illa: valitudo, vacuitas doloris, pulchritudo, cetera. Prodest, inquit, mihi eo esse animo. Quonam modo? Duo Reges: constructio interrete.',
          custodyEndDate: '2020-09-16T19:51:39.466Z',
        })
      })

      // Act
      const { getByTestId } = render(
        <userContext.Provider value={{ user: mockJudge }}>
          <RulingStepOne />
        </userContext.Provider>,
      )

      // Assert
      expect(
        getByTestId('continueButton') as HTMLButtonElement,
      ).not.toBeDisabled()
    })
  })

  describe(Constants.RULING_STEP_TWO_ROUTE, () => {
    describe(Constants.RULING_STEP_ONE_ROUTE, () => {
      test('should now allow users to continue unless every required field has been filled out', () => {
        // Arrange

        // Have custodyEndDate in sessionstorage because it's hard to use the datepicker with useEvents
        Storage.prototype.getItem = jest.fn(() => {
          return JSON.stringify({
            custodyEndDate: '2020-10-24',
          })
        })

        Storage.prototype.setItem = jest.fn()

        // Act and Assert
        const { getByLabelText, getByTestId } = render(
          <userContext.Provider value={{ user: mockJudge }}>
            <RulingStepTwo />
          </userContext.Provider>,
        )

        userEvent.click(
          getByLabelText('Sækjandi kærir málið') as HTMLInputElement,
        )

        expect(
          (getByTestId('continueButton') as HTMLButtonElement).disabled,
        ).toBe(true)

        userEvent.click(getByLabelText('Sækjandi kærir málið'))

        waitFor(() => {
          expect(
            (getByTestId('continueButton') as HTMLButtonElement).disabled,
          ).toBe(false)
        })
      })
    })

    test('should not have a selected radio button by default', () => {
      // Arrange
      Storage.prototype.getItem = jest.fn(() => {
        return JSON.stringify({
          id: 'test_id',
        })
      })

      // Act
      const { getAllByRole } = render(
        <userContext.Provider value={{ user: mockJudge }}>
          <RulingStepTwo />
        </userContext.Provider>,
      )

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
      const { getByText, getByTestId } = render(
        <userContext.Provider value={{ user: mockJudge }}>
          <RulingStepTwo />
        </userContext.Provider>,
      )

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
      const { getByText, getByTestId } = render(
        <userContext.Provider value={{ user: mockJudge }}>
          <RulingStepTwo />
        </userContext.Provider>,
      )

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
