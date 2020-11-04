import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, MemoryRouter } from 'react-router-dom'
import StepOne, { CreateCaseMutation } from './StepOne'
import * as Constants from '../../../../utils/constants'
import { userContext } from '../../../../utils/userContext'
import {
  mockCaseQueries,
  mockProsecutorUserContext,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { UpdateCase } from '@island.is/judicial-system/types'

describe('/krafa with an id', () => {
  test('should prefill the inputs with the correct data if id is in the url', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider mocks={mockCaseQueries} addTypename={false}>
        <userContext.Provider value={mockProsecutorUserContext}>
          <MemoryRouter initialEntries={['/krafa/test_id']}>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <StepOne />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(
        () => (screen.getByLabelText('Fullt nafn *') as HTMLInputElement).value,
      ),
    ).toEqual('Jon Harring')

    expect(
      (screen.getByLabelText('Lögheimili/dvalarstaður *') as HTMLInputElement)
        .value,
    ).toEqual('Harringvej 2')
  })

  test('should not have a disabled continue button if step is valid when a valid request is opened', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider mocks={mockCaseQueries} addTypename={false}>
        <userContext.Provider value={mockProsecutorUserContext}>
          <MemoryRouter initialEntries={['/krafa/test_id']}>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <StepOne />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    // Assert

    // TODO FIND A WAY TO SET DATES
    expect(
      await waitFor(
        () =>
          screen.getByRole('button', {
            name: /Halda áfram/i,
          }) as HTMLButtonElement,
      ),
    ).toBeDisabled()
  })

  test('should display an empty form if there is no id in url', async () => {
    // Arrange

    render(
      <MockedProvider mocks={mockCaseQueries} addTypename={false}>
        <userContext.Provider value={mockProsecutorUserContext}>
          <MemoryRouter initialEntries={[Constants.SINGLE_REQUEST_BASE_ROUTE]}>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id?`}>
              <StepOne />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    // Act
    const aa = [
      await waitFor(() => screen.getByLabelText('Slá inn LÖKE málsnúmer *')),
      await waitFor(() => screen.getByLabelText('Kennitala *')),
      await waitFor(() => screen.getByLabelText('Fullt nafn *')),
      await waitFor(() => screen.getByLabelText('Lögheimili/dvalarstaður *')),
      await waitFor(() => screen.getByLabelText('Tímasetning *')),
      await waitFor(() => screen.getByLabelText('Ósk um tíma *')),
    ]

    const court = screen
      .getByTestId(/select-court/i)
      .getElementsByClassName('singleValue')[0].innerHTML

    const datepickers = await waitFor(() =>
      screen.queryAllByTestId(/datepicker-value/i),
    )

    // Assert
    expect(aa.filter((a) => a.innerHTML !== '').length).toEqual(0)
    expect(court).toEqual('Héraðsdómur Reykjavíkur')
    expect(datepickers.length).toEqual(0)
    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()
  })
})

describe('/krafa without ID', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange

    // Act and Assert
    render(
      <MockedProvider
        mocks={[]
          .concat(mockCaseQueries)
          .concat([
            {
              request: {
                query: CreateCaseMutation,
                variables: {
                  input: {
                    policeCaseNumber: '000-0000-0010',
                    accusedNationalId: '1112902539',
                    court: 'Héraðsdómur Reykjavíkur',
                    accusedName: '',
                    accusedAddress: '',
                    arrestDate: null,
                    requestedCourtDate: null,
                  },
                },
              },
              result: {
                data: {},
              },
            },
          ])
          .concat(
            mockUpdateCaseMutation([
              {
                accusedName: 'Jon Harring',
              } as UpdateCase,
              {
                accusedAddress: 'Harringvej 2',
              } as UpdateCase,
            ]),
          )}
        addTypename={false}
      >
        <userContext.Provider value={mockProsecutorUserContext}>
          <MemoryRouter initialEntries={['/krafa']}>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}`}>
              <StepOne />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    userEvent.type(
      await waitFor(
        () =>
          screen.getByLabelText('Slá inn LÖKE málsnúmer *') as HTMLInputElement,
      ),
      '000-0000-0010',
    )

    userEvent.tab()

    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.type(
      screen.getByLabelText('Kennitala *') as HTMLInputElement,
      '1112902539',
    )
    userEvent.tab()

    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.type(
      screen.getByLabelText('Fullt nafn *') as HTMLInputElement,
      'Jon Harring',
    )

    userEvent.tab()

    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.type(
      screen.getByLabelText('Lögheimili/dvalarstaður *') as HTMLInputElement,
      'Harringvej 2',
    )
    userEvent.tab()

    // TODO FIND A WAY TO SET DATE FIELDS

    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()
  })

  test('should save case if accused name is entered first and then police case number and accused national iddd', async () => {
    // Arrange
    let createCalled = false

    // Act
    render(
      <MockedProvider
        mocks={[].concat(mockCaseQueries).concat([
          {
            request: {
              query: CreateCaseMutation,
              variables: {
                input: {
                  policeCaseNumber: '020-0202-2929',
                  accusedNationalId: '0000000000',
                  court: 'Héraðsdómur Reykjavíkur',
                  accusedName: 'Gervipersona',
                  accusedAddress: 'Batcave',
                  arrestDate: null,
                  requestedCourtDate: null,
                },
              },
            },
            result: () => {
              createCalled = true
              return {
                data: { createCase: { id: 'testid' } },
              }
            },
          },
        ])}
        addTypename={false}
      >
        <userContext.Provider value={mockProsecutorUserContext}>
          <MemoryRouter initialEntries={[Constants.SINGLE_REQUEST_BASE_ROUTE]}>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}`}>
              <StepOne />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    userEvent.type(
      await waitFor(
        () => screen.getByLabelText('Fullt nafn *') as HTMLInputElement,
      ),
      'Gervipersona',
    )

    userEvent.tab()

    await userEvent.type(
      screen.getByLabelText('Lögheimili/dvalarstaður *') as HTMLInputElement,
      'Batcave',
    )

    userEvent.tab()

    await userEvent.type(
      screen.getByLabelText('Kennitala *') as HTMLInputElement,
      '0000000000',
    )

    userEvent.tab()

    await userEvent.type(
      screen.getByLabelText('Slá inn LÖKE málsnúmer *') as HTMLInputElement,
      '020-0202-2929',
    )

    userEvent.tab()

    // Assert
    await waitFor(() => expect(createCalled).toBe(true))
  })
})
