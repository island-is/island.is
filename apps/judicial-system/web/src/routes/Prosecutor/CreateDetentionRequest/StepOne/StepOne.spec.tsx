import { createMemoryHistory } from 'history'
import React from 'react'
import { render, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StepOne from './StepOne'
import { Route, Router, MemoryRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import * as Constants from '../../../../utils/constants'

describe(`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`, () => {
  test('should prefill the inputs with the correct data if id is in the url', async () => {
    // Arrange

    fetchMock.mock(
      '/api/case/test_id',
      { accusedName: 'Jon Harring', accusedAddress: 'Harringvej 2' },
      { method: 'get' },
    )

    // Act
    await act(async () => {
      const { getByTestId } = render(
        <MemoryRouter initialEntries={['/krafa/test_id']}>
          <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
            <StepOne />
          </Route>
        </MemoryRouter>,
      )

      // Assert
      expect(
        await waitFor(
          () => (getByTestId('accusedName') as HTMLInputElement).value,
        ),
      ).toEqual('Jon Harring')

      expect(
        await waitFor(
          () => (getByTestId('accusedAddress') as HTMLInputElement).value,
        ),
      ).toEqual('Harringvej 2')
    })
  })

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
      getByTestId(/accusedName/i),
      getByTestId(/accusedAddress/i),
      getByTestId(/arrestTime/i),
      getByTestId(/requestedCourtDate/i),
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

    // Mock call to localstorage.getItem
    Storage.prototype.getItem = jest.fn(() => {
      return JSON.stringify({})
    })

    // Mock call to api.createCase
    fetchMock.mock('/api/case', { id: 'test_id' }, { method: 'post' })

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
    const accusedName = getByTestId(/accusedName/i) as HTMLInputElement
    const accusedAddress = getByTestId(/accusedAddress/i) as HTMLInputElement

    act(() => {
      userEvent.type(policeCaseNumber, 'x-007-2')
      userEvent.tab()

      userEvent.type(nationalId, '1234567890')
      userEvent.tab()

      userEvent.type(accusedName, 'Mikki Refur')
      userEvent.tab()

      userEvent.type(accusedAddress, 'Undraland 2')
      userEvent.tab()
    })

    reloadFn()

    // Assert
    expect(policeCaseNumber.value).toEqual('x-007-2')
    await waitFor(() => expect(nationalId.value).toEqual('1234567890'))
    expect(accusedName.value).toEqual('Mikki Refur')
    expect(accusedAddress.value).toEqual('Undraland 2')
    expect(spy).toHaveBeenCalled()
  })

  test("should display the correct arrestTime and requestedCourtDate if it's in localstorage", () => {
    // Arrange
    const history = createMemoryHistory()

    Storage.prototype.getItem = jest.fn(() => {
      return JSON.stringify({
        id: 'test_id',
        arrestDate: '2020-10-24T13:37:00Z',
        requestedCourtDate: '2020-11-02T12:03:00Z',
      })
    })

    // Act
    const { getByTestId } = render(
      <Router history={history}>
        <StepOne />
      </Router>,
    )

    // Assert
    expect((getByTestId('arrestTime') as HTMLInputElement).value).toEqual(
      '13:37',
    )
    expect(
      (getByTestId('requestedCourtDate') as HTMLInputElement).value,
    ).toEqual('12:03')
  })

  test("should display nothing if arrestTime and requestedCourtDate don't have a time set in localstorage", () => {
    // Arrange
    const history = createMemoryHistory()

    Storage.prototype.getItem = jest.fn(() => {
      return JSON.stringify({
        id: 'test_id',
        arrestDate: '2020-10-24',
        requestedCourtDate: '2020-11-02',
      })
    })

    // Act
    const { getByTestId } = render(
      <Router history={history}>
        <StepOne />
      </Router>,
    )

    // Assert
    expect((getByTestId('arrestTime') as HTMLInputElement).value).toEqual('')
    expect(
      (getByTestId('requestedCourtDate') as HTMLInputElement).value,
    ).toEqual('')
  })

  test('should now allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    const history = createMemoryHistory()

    // Mock call to api.updateCase
    fetchMock.mock('/api/case/test_id', 200, { method: 'put' })

    // Have arrestDate and requestedCourtDate in localstorage because it's hard to use the datepicker with useEvents
    Storage.prototype.getItem = jest.fn(() => {
      return JSON.stringify({
        arrestDate: '2020-10-15',
        requestedCourtDate: '2020-10-16',
        accusedName: 'Jon Harring',
      })
    })

    Storage.prototype.setItem = jest.fn()

    // Act and Assert
    const { getByTestId } = render(
      <Router history={history}>
        <StepOne />
      </Router>,
    )

    await act(async () => {
      await userEvent.type(
        getByTestId('policeCaseNumber') as HTMLInputElement,
        '000-0000-000',
      )
      userEvent.tab()
      expect(
        (getByTestId('continueButton') as HTMLButtonElement).disabled,
      ).toBe(true)

      await userEvent.type(
        getByTestId('nationalId') as HTMLInputElement,
        '1112902539',
      )
      userEvent.tab()
      expect(
        (getByTestId('continueButton') as HTMLButtonElement).disabled,
      ).toBe(true)

      await userEvent.type(
        getByTestId('accusedName') as HTMLInputElement,
        'Jon Harring',
      )
      userEvent.tab()
      expect(
        (getByTestId('continueButton') as HTMLButtonElement).disabled,
      ).toBe(true)

      await userEvent.type(
        getByTestId('accusedAddress') as HTMLInputElement,
        'Harringvej 2',
      )
      userEvent.tab()
      expect(
        (getByTestId('continueButton') as HTMLButtonElement).disabled,
      ).toBe(true)

      await userEvent.type(
        getByTestId('arrestTime') as HTMLInputElement,
        '12:31',
      )
      userEvent.tab()
      expect(
        (getByTestId('continueButton') as HTMLButtonElement).disabled,
      ).toBe(true)

      await userEvent.type(
        getByTestId('requestedCourtDate') as HTMLInputElement,
        '12:31',
      )
      userEvent.tab()
      expect(
        (getByTestId('continueButton') as HTMLButtonElement).disabled,
      ).toBe(false)
    })
  })
})
