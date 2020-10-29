import React from 'react'
import { render, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StepOne from './StepOne'
import { Route, MemoryRouter } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import * as Constants from '../../../../utils/constants'
import * as api from '../../../../api'
import { userContext } from '../../../../utils/userContext'
import { mockProsecutor } from '@island.is/judicial-system-web/src/utils/mocks'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'

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
        <userContext.Provider value={{ user: mockProsecutor }}>
          <MemoryRouter initialEntries={['/krafa/test_id']}>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <StepOne />
            </Route>
          </MemoryRouter>
        </userContext.Provider>,
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

  test('should not have a disabled continue button if step is valid when a valid request is opened', async () => {
    // Arrange
    fetchMock.mock(
      '/api/case/test_id',
      {
        policeCaseNumber: '000-0000-020',
        accusedNationalId: '1111119999',
        accusedName: 'Jon Harring',
        accusedAddress: 'Harringvej 2',
        arrestDate: '2020-09-16T19:51:28.224Z',
        requestedCourtDate: '2020-09-16T19:51:28.224Z',
      },
      { method: 'get', overwriteRoutes: true },
    )

    // Act
    const { getByTestId } = render(
      <userContext.Provider value={{ user: mockProsecutor }}>
        <MemoryRouter initialEntries={['/krafa/test_id']}>
          <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
            <StepOne />
          </Route>
        </MemoryRouter>
      </userContext.Provider>,
    )

    // Assert
    expect(
      await waitFor(() => getByTestId('continueButton') as HTMLButtonElement),
    ).not.toBeDisabled()
  })

  test('should now allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    fetchMock.mock('/api/case/test_id', 200, { method: 'put' })
    fetchMock.mock(
      '/api/case/test_id',
      {
        id: 'test_id',
        arrestDate: '2020-09-16T19:51:28.224Z',
        requestedCourtDate: '2020-09-16T19:51:28.224Z',
      },
      { method: 'get', overwriteRoutes: true },
    )

    // Act and Assert
    const { getByTestId } = render(
      <userContext.Provider value={{ user: mockProsecutor }}>
        <MemoryRouter initialEntries={['/krafa/test_id']}>
          <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
            <StepOne />
          </Route>
        </MemoryRouter>
      </userContext.Provider>,
    )

    await act(async () => {
      await userEvent.type(
        await waitFor(
          () => getByTestId('policeCaseNumber') as HTMLInputElement,
        ),
        '000-0000-0010',
      )
      userEvent.tab()
      expect(getByTestId('continueButton') as HTMLButtonElement).toBeDisabled()

      await userEvent.type(
        getByTestId('nationalId') as HTMLInputElement,
        '1112902539',
      )
      userEvent.tab()
      expect(getByTestId('continueButton') as HTMLButtonElement).toBeDisabled()

      await userEvent.type(
        await waitFor(() => getByTestId('accusedName') as HTMLInputElement),
        'Jon Harring',
      )
      userEvent.tab()
      expect(getByTestId('continueButton') as HTMLButtonElement).toBeDisabled()

      await userEvent.type(
        getByTestId('accusedAddress') as HTMLInputElement,
        'Harringvej 2',
      )
      userEvent.tab()

      expect(
        await waitFor(() => getByTestId('continueButton') as HTMLButtonElement),
      ).not.toBeDisabled()
    })
  })
})

describe(Constants.SINGLE_REQUEST_BASE_ROUTE, () => {
  test('should save case if accused name is entered first and then police case number and accused national id', async () => {
    // Arrange
    const spy = jest.spyOn(api, 'createCase')
    fetchMock.mock(
      '/api/case',
      {
        policeCaseNumber: 'string',
        accusedNationalId: 'string',
        accusedName: 'string',
        accusedAddress: 'string',
        court: 'string',
        arrestDate: '2020-10-28T20:50:42.571Z',
        requestedCourtDate: '2020-10-28T20:50:42.571Z',
      },
      { method: 'post' },
    )

    // Act
    const { getByTestId } = render(
      <userContext.Provider value={{ user: mockProsecutor }}>
        <MemoryRouter initialEntries={['/krafa']}>
          <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}`}>
            <StepOne />
          </Route>
        </MemoryRouter>
      </userContext.Provider>,
    )

    await act(async () => {
      await userEvent.type(
        await waitFor(() => getByTestId('accusedName') as HTMLInputElement),
        'Gervipersona',
      )

      userEvent.tab()

      await userEvent.type(
        getByTestId('accusedAddress') as HTMLInputElement,
        'Batcave',
      )

      userEvent.tab()

      await userEvent.type(
        getByTestId('nationalId') as HTMLInputElement,
        '0000000000',
      )

      userEvent.tab()

      await userEvent.type(
        getByTestId('policeCaseNumber') as HTMLInputElement,
        '020-0202-2929',
      )

      userEvent.tab()

      // Assert
      expect(spy).toHaveBeenLastCalledWith({
        policeCaseNumber: '020-0202-2929',
        accusedNationalId: '0000000000',
        court: 'Héraðsdómur Reykjavíkur',
        accusedName: 'Gervipersona',
        accusedAddress: 'Batcave',
        arrestDate: null,
        requestedCourtDate: null,
      })
    })
  })
})
