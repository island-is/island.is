import React from 'react'
import { render, waitFor, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, MemoryRouter } from 'react-router-dom'
import StepOne, { CreateCaseMutation } from './StepOne'
import * as Constants from '../../../../utils/constants'
import {
  mockCaseQueries,
  mockProsecutorQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { CaseGender, UpdateCase } from '@island.is/judicial-system/types'
import formatISO from 'date-fns/formatISO'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'

describe('/krafa with an id', () => {
  test('should prefill the inputs with the correct data if id is in the url', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={['/krafa/test_id_2']}>
          <UserProvider>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <StepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
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
  }, 15000)

  test('should not have a disabled continue button if step is valid when a valid request is opened', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={['/krafa/test_id_3']}>
          <UserProvider>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <StepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert

    expect(
      await waitFor(
        () =>
          screen.getByRole('button', {
            name: /Halda áfram/i,
          }) as HTMLButtonElement,
      ),
    ).not.toBeDisabled()
  })

  test('should have a disabled requestedCourtDate if judge has set a court date', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.SINGLE_REQUEST_BASE_ROUTE}/test_id_3`]}
        >
          <UserProvider>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <StepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(
        () =>
          screen.getAllByLabelText(
            'Veldu dagsetningu *',
          )[1] as HTMLInputElement,
      ),
    ).toBeDisabled()
  })

  test('should have a disabled defender name and email if judge has set a defender', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.SINGLE_REQUEST_BASE_ROUTE}/test_id_2`]}
        >
          <UserProvider>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <StepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(
        () => screen.getByLabelText('Nafn verjanda') as HTMLInputElement,
      ),
    ).toBeDisabled()

    expect(
      screen.getByLabelText('Netfang verjanda') as HTMLInputElement,
    ).toBeDisabled()
  })
})

test('should have a disabled defender name and email even if a judge erases that info from the hearing arrangement screen', async () => {
  // Arrange

  // Act
  render(
    <MockedProvider
      mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
      addTypename={false}
    >
      <MemoryRouter
        initialEntries={[`${Constants.SINGLE_REQUEST_BASE_ROUTE}/test_id_3`]}
      >
        <UserProvider>
          <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id`}>
            <StepOne />
          </Route>
        </UserProvider>
      </MemoryRouter>
    </MockedProvider>,
  )

  // Assert
  // A value is considered dirty if it's a string, even an empty one.
  expect(
    await waitFor(
      () => screen.getByLabelText('Nafn verjanda') as HTMLInputElement,
    ),
  ).toBeDisabled()

  expect(
    screen.getByLabelText('Netfang verjanda') as HTMLInputElement,
  ).toBeDisabled()
})

describe('/krafa without ID', () => {
  test('should have a create case button', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={[Constants.SINGLE_REQUEST_BASE_ROUTE]}>
          <UserProvider>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id?`}>
              <StepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(() => screen.getByRole('button', { name: /Stofna kröfu/ })),
    ).toBeInTheDocument()
  })

  test('should display an empty form if there is no id in url', async () => {
    // Arrange
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={[Constants.SINGLE_REQUEST_BASE_ROUTE]}>
          <UserProvider>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}/:id?`}>
              <StepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Act
    const aa = [
      await waitFor(() => screen.getByLabelText('Slá inn LÖKE málsnúmer *')),
      await waitFor(() => screen.getByLabelText('Kennitala *')),
      await waitFor(() => screen.getByLabelText('Fullt nafn *')),
      await waitFor(() => screen.getByLabelText('Lögheimili/dvalarstaður *')),
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
      screen.getByRole('radio', { name: 'Karl' }) as HTMLInputElement,
    ).not.toBeChecked()
    expect(
      screen.getByRole('radio', { name: 'Kona' }) as HTMLInputElement,
    ).not.toBeChecked()
    expect(
      screen.getByRole('radio', { name: 'Annað' }) as HTMLInputElement,
    ).not.toBeChecked()
    expect(
      screen.getByRole('button', {
        name: /Stofna kröfu/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()
  })

  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    const now = new Date()
    const arrestDate = new Date(now.getFullYear(), now.getMonth(), 15)
    arrestDate.setHours(17, 0, 0)
    const lastDateOfTheMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    )
    lastDateOfTheMonth.setHours(17, 0)

    let promiseResolve: (value?: unknown) => void
    const promise = new Promise(function (resolve) {
      promiseResolve = resolve
    })

    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockProsecutorQuery,
          ...mockUpdateCaseMutation([
            {
              id: 'testid',
              accusedName: 'Jon Harring',
            } as UpdateCase,
            {
              id: 'testid',
              accusedAddress: 'Harringvej 2',
            } as UpdateCase,
            {
              id: 'testid',
              accusedGender: CaseGender.FEMALE,
            } as UpdateCase,
            {
              id: 'testid',
              arrestDate: formatISO(arrestDate, { representation: 'date' }),
            } as UpdateCase,
            {
              id: 'testid',
              arrestDate: formatISO(arrestDate),
            } as UpdateCase,
            {
              id: 'testid',
              requestedCourtDate: formatISO(lastDateOfTheMonth, {
                representation: 'date',
              }),
            } as UpdateCase,
            {
              id: 'testid',
              requestedCourtDate: formatISO(lastDateOfTheMonth),
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={['/krafa']}>
          <UserProvider>
            <Route path={`${Constants.SINGLE_REQUEST_BASE_ROUTE}`}>
              <StepOne />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Act and Assert
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
        name: /Stofna kröfu/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.type(
      screen.getByLabelText('Kennitala *') as HTMLInputElement,
      '1112902539',
    )

    userEvent.tab()

    await promise

    expect(
      screen.getByRole('button', {
        name: /Stofna kröfu/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.type(
      screen.getByLabelText('Fullt nafn *') as HTMLInputElement,
      'Jon Harring',
    )

    userEvent.tab()

    expect(
      screen.getByRole('button', {
        name: /Stofna kröfu/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.type(
      screen.getByLabelText('Lögheimili/dvalarstaður *') as HTMLInputElement,
      'Harringvej 2',
    )
    userEvent.tab()

    userEvent.click(screen.getByRole('radio', { name: 'Kona' }))

    // Select dates
    const datePickerWrappers = screen.getAllByTestId('datepicker')

    expect(datePickerWrappers.length).toEqual(2)

    const arrestedWrapper = within(datePickerWrappers[0])

    const arrestedDatePicker = arrestedWrapper.getAllByText('Veldu dagsetningu')

    userEvent.click(arrestedDatePicker[0])

    userEvent.click(arrestedWrapper.getAllByText('15')[0])

    const hearingWrapper = within(datePickerWrappers[1])

    const hearingDatePicker = hearingWrapper.getAllByText('Veldu dagsetningu')

    userEvent.click(hearingDatePicker[0])

    const lastDayOfTheMonth = lastDateOfTheMonth.getDate().toString()

    const lastDays = hearingWrapper.getAllByText(lastDayOfTheMonth)

    expect(lastDays.length).toBeGreaterThan(0)

    const lastDayOfCurrentMonth = lastDays[lastDays.length - 1]

    userEvent.click(lastDayOfCurrentMonth)

    expect(
      screen.getByRole('button', {
        name: /Stofna kröfu/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.type(screen.getByLabelText('Tímasetning *'), '17:00')

    userEvent.tab()

    expect(
      screen.getByRole('button', {
        name: /Stofna kröfu/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.type(screen.getByLabelText('Ósk um tíma *'), '17:00')

    userEvent.tab()

    expect(
      screen.getByRole('button', {
        name: /Stofna kröfu/i,
      }) as HTMLButtonElement,
    ).not.toBeDisabled()
  })
})
