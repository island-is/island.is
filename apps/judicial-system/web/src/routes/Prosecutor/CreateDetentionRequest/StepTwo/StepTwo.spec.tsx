import React from 'react'
import { render, waitFor, screen, within, act } from '@testing-library/react'
import StepTwo from './StepTwo'
import { MemoryRouter, Route } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { UpdateCase } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  mockCaseQueries,
  mockProsecutorQuery,
  mockUpdateCaseMutation,
  mockUsersQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import formatISO from 'date-fns/formatISO'

describe('Create detention request, step two', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    const todaysDate = new Date()
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
          ...mockUsersQuery,
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
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
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

    userEvent.type(
      await screen.findByLabelText('Ósk um tíma (kk:mm) *'),
      '13:37',
    )

    expect(
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
    ).not.toBeDisabled()
  })

  test('should not have a disabled continue button if step is valid when a valid request is opened', async () => {
    // Arrange

    // Act
    await act(async () => {
      render(
        <MockedProvider
          mocks={[
            ...mockCaseQueries,
            ...mockProsecutorQuery,
            ...mockUsersQuery,
          ]}
          addTypename={false}
        >
          <MemoryRouter
            initialEntries={[`${Constants.STEP_TWO_ROUTE}/test_id`]}
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
        await screen.findByRole('button', {
          name: /Halda áfram/i,
        }),
      ).not.toBeDisabled()
    })
  })

  test('should have a disabled requestedCourtDate if judge has set a court date', async () => {
    // Arrange

    // Act
    await act(async () => {
      render(
        <MockedProvider
          mocks={[
            ...mockCaseQueries,
            ...mockProsecutorQuery,
            ...mockUsersQuery,
          ]}
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
      expect(await screen.findByLabelText('Veldu dagsetningu *')).toBeDisabled()
    })
  })
})
