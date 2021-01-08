import React from 'react'
import { render, waitFor, screen, within } from '@testing-library/react'
import StepTwo from './StepTwo'
import { MemoryRouter, Route } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { UpdateCase } from '@island.is/judicial-system/types'
import * as Constants from '../../../../utils/constants'
import {
  mockCaseQueries,
  mockProsecutorQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import formatISO from 'date-fns/formatISO'

describe('Create detention request, step two', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    const todaysDate = new Date()
    const formattedTodaysDate = todaysDate.getDate().toString().padStart(2, '0')
    const formattedTodaysMonth = (todaysDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')

    const lastDateOfTheMonth = new Date(
      todaysDate.getFullYear(),
      todaysDate.getMonth() + 1,
      0,
    )

    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockProsecutorQuery,
          ...mockUpdateCaseMutation([
            {
              arrestDate: '2020-11-15',
            } as UpdateCase,
            {
              id: 'test_id_6',
              arrestDate: '2020-11-15T13:37:00Z',
            } as UpdateCase,
            {
              id: 'test_id_6',
              requestedCourtDate: formatISO(lastDateOfTheMonth, {
                representation: 'date',
              }),
            } as UpdateCase,
            {
              id: 'test_id_6',
              requestedCourtDate: formatISO(lastDateOfTheMonth),
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.STEP_TWO_ROUTE}/test_id_6`]}
        >
          <UserProvider>
            <Route path={`${Constants.STEP_TWO_ROUTE}/:id`}>
              <StepTwo />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Act and Assert
    // Arrest date is optional
    expect(
      await waitFor(
        () =>
          screen.getByRole('button', {
            name: /Halda áfram/i,
          }) as HTMLButtonElement,
      ),
    ).toBeDisabled()

    const datePickerWrappers = screen.getAllByTestId('datepicker')

    expect(datePickerWrappers.length).toEqual(2)

    const hearingWrapper = within(datePickerWrappers[1])

    const hearingDatePicker = hearingWrapper.getAllByText('Veldu dagsetningu')

    userEvent.click(hearingDatePicker[0])

    const lastDayOfTheMonth = lastDateOfTheMonth.getDate().toString()

    const lastDays = hearingWrapper.getAllByText(lastDayOfTheMonth)

    expect(lastDays.length).toBeGreaterThan(0)

    const lastDayOfCurrentMonth = lastDays[lastDays.length - 1]

    userEvent.click(lastDayOfCurrentMonth)

    userEvent.type(screen.getByLabelText('Ósk um tíma (kk:mm) *'), '13:37')

    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).not.toBeDisabled()
  })

  test('should not have a disabled continue button if step is valid when a valid request is opened', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter initialEntries={[`${Constants.STEP_TWO_ROUTE}/test_id`]}>
          <UserProvider>
            <Route path={`${Constants.STEP_TWO_ROUTE}/:id`}>
              <StepTwo />
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
  }, 10000)

  test('should have a disabled requestedCourtDate if judge has set a court date', async () => {
    // Arrange

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.STEP_TWO_ROUTE}/test_id_3`]}
        >
          <UserProvider>
            <Route path={`${Constants.STEP_TWO_ROUTE}/:id`}>
              <StepTwo />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(
        () => screen.getByLabelText('Veldu dagsetningu *') as HTMLInputElement,
      ),
    ).toBeDisabled()
  })
})
