import { createMemoryHistory } from 'history'
import React from 'react'
import { act, getByText, render } from '@testing-library/react'
import StepTwo from './StepTwo'
import { Router } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import userEvent from '@testing-library/user-event'

describe('Create detention request, step two', () => {
  test('should now allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    const history = createMemoryHistory()

    // Mock call to api.updateCase
    fetchMock.mock('/api/case/test_id', 200, { method: 'put' })

    // Have arrestDate and requestedCourtDate in localstorage because it's hard to use the datepicker with useEvents
    Storage.prototype.getItem = jest.fn(() => {
      return JSON.stringify({
        id: 'test_id',
        requestedCustodyEndDate: '2020-10-15',
      })
    })

    // Act and Assert
    const { getByTestId, getByText } = render(
      <Router history={history}>
        <StepTwo />
      </Router>,
    )

    await act(async () => {
      await userEvent.type(
        getByTestId('requestedCustodyEndTime') as HTMLInputElement,
        '13:37',
      )
      userEvent.tab()
      expect(
        (getByTestId('continueButton') as HTMLButtonElement).disabled,
      ).toBe(true)

      await userEvent.type(
        getByTestId('lawsBroken') as HTMLInputElement,
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ille vero, si insipiens-quo certe, quoniam tyrannus -, numquam beatus; Cur iustitia laudatur? Haec et tu ita posuisti, et verba vestra sunt. Duo Reges: constructio interrete. Ait enim se, si uratur, Quam hoc suave! dicturum. ALIO MODO. Minime vero, inquit ille, consentit.',
      )
      userEvent.tab()
      expect(
        (getByTestId('continueButton') as HTMLButtonElement).disabled,
      ).toBe(true)
      userEvent.click(getByText('c-lið 1. mgr. 95. gr.'))
      expect(
        (getByTestId('continueButton') as HTMLButtonElement).disabled,
      ).toBe(false)
    })
  })

  test("should display the correct requestedCustodyEndTime if it's in localstorage", () => {
    // Arrange
    const history = createMemoryHistory()

    Storage.prototype.getItem = jest.fn(() => {
      return JSON.stringify({
        id: 'test_id',
        requestedCustodyEndDate: '2020-11-02T12:03:00Z',
        custodyProvisions: [],
        requestedCustodyRestrictions: [],
      })
    })

    // Act
    const { getByTestId } = render(
      <Router history={history}>
        <StepTwo />
      </Router>,
    )

    // Assert
    expect(
      (getByTestId('requestedCustodyEndTime') as HTMLInputElement).value,
    ).toEqual('12:03')
  })
})
