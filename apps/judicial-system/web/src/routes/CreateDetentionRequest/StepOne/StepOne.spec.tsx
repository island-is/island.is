import { createMemoryHistory } from 'history'
import React from 'react'
import {
  render,
  fireEvent,
  waitForElement,
  screen,
  act,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StepOne from './StepOne'
import { Router } from 'react-router-dom'
import fetchMock from 'fetch-mock'

describe('/stofna-krofu/grunnupplysingar', () => {
  test('should display an empty form if there is nothing in local storage', async () => {
    // Arrange
    const history = createMemoryHistory()
    const { getByTestId, queryAllByTestId } = render(
      <Router history={history}>
        <StepOne />
      </Router>,
    )

    // Act
    const aa = [
      getByTestId(/policeCaseNumber/i),
      getByTestId(/nationalId/i),
      getByTestId(/suspectName/i),
      getByTestId(/suspectAddress/i),
      getByTestId(/arrestTime/i),
      getByTestId(/courtDate/i),
    ]

    const court = getByTestId(/select-court/i).getElementsByClassName(
      'singleValue',
    )[0].innerHTML

    const datepickers = queryAllByTestId(/datepicker-value/i)

    // Assert
    expect(aa.filter((a) => a.innerHTML !== '').length).toEqual(0)
    expect(court).toEqual('Héraðsdómur Reykjavíkur')
    expect(datepickers.length).toEqual(0)
  })

  test('should persist data if data is in localstorage', async () => {
    // Arrange
    fetchMock.mock('/api/case', {
      id: 'b5041539-27c0-426a-961d-0f268fe45165',
      created: '2020-09-16T19:50:08.033Z',
      modified: '2020-09-16T19:51:39.466Z',
      state: 'SUBMITTED',
      court: 'string',
      comments: 'string',
      policeCaseNumber: 'string',
      suspectNationalId: 'string',
      suspectName: 'string',
      suspectAddress: 'string',
      arrestDate: '2020-09-16T19:51:28.224Z',
      requestedCourtDate: '2020-09-16T19:51:28.224Z',
      requestedCustodyEndDate: '2020-09-16T19:51:28.224Z',
      lawsBroken: 'string',
      custodyProvisions: ['_95_1_A'],
      custodyRestrictions: ['ISOLATION'],
      caseFacts: 'string',
      witnessAccounts: 'string',
      investigationProgress: 'string',
      legalArguments: 'string',
    })

    // Mock reload function
    const reloadFn = () => {
      window.location.reload(true)
    }

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: jest.fn() },
    })

    window.location.reload = jest.fn()

    const history = createMemoryHistory()

    const spy = jest.spyOn(window.location, 'reload')

    // Act
    const { getByTestId } = render(
      <Router history={history}>
        <StepOne />
      </Router>,
    )
    const policeCaseNumber = getByTestId(
      /policeCaseNumber/i,
    ) as HTMLInputElement
    const nationalId = getByTestId(/nationalId/i) as HTMLInputElement
    const suspectName = getByTestId(/suspectName/i) as HTMLInputElement
    const suspectAddress = getByTestId(/suspectAddress/i) as HTMLInputElement
    const court = getByTestId(/select-court/i) as HTMLSelectElement

    act(() => {
      userEvent.type(policeCaseNumber, 'x-007-2')
      userEvent.tab()

      userEvent.type(nationalId, '1234567890')
      userEvent.tab()

      userEvent.type(suspectName, 'Mikki Refur')
      userEvent.tab()

      userEvent.type(suspectAddress, 'Undraland 2')
      userEvent.tab()
    })

    reloadFn()

    // Assert
    expect(policeCaseNumber.value).toEqual('x-007-2')
    await waitFor(() => expect(nationalId.value).toEqual('1234567890'))
    expect(suspectName.value).toEqual('Mikki Refur')
    expect(suspectAddress.value).toEqual('Undraland 2')
    expect(spy).toHaveBeenCalled()
  })
})
