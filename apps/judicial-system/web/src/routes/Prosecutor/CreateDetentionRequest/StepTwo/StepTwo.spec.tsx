import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'
import formatISO from 'date-fns/formatISO'

import { UpdateCase } from '@island.is/judicial-system/types'
import {
  mockCaseQueries,
  mockProsecutorQuery,
  mockUpdateCaseMutation,
  mockUsersQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import StepTwo from './StepTwo'
import addDays from 'date-fns/addDays'

describe('Create detention request, step two', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_6' },
    }))
    const todaysDate = new Date()
    const lastDateOfTheMonth = new Date(
      todaysDate.getFullYear(),
      todaysDate.getMonth() + 1,
      0,
      13,
      37,
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
        <UserProvider>
          <StepTwo />
        </UserProvider>
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
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery, ...mockUsersQuery]}
        addTypename={false}
      >
        <UserProvider>
          <StepTwo />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
    ).not.toBeDisabled()
  })

  test('should have a disabled requestedCourtDate if judge has set a court date', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_3' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery, ...mockUsersQuery]}
        addTypename={false}
      >
        <UserProvider>
          <StepTwo />
        </UserProvider>
      </MockedProvider>,
    )

    // Assert
    expect(await screen.findByLabelText('Veldu dagsetningu *')).toBeDisabled()
  })

  test('should not allow users to select an arrest date in the future', async () => {
    // Arrange
    const useRouter = jest.spyOn(require('next/router'), 'useRouter')
    useRouter.mockImplementation(() => ({
      query: { id: 'test_id_3' },
    }))

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockProsecutorQuery, ...mockUsersQuery]}
        addTypename={false}
      >
        <UserProvider>
          <StepTwo />
        </UserProvider>
      </MockedProvider>,
    )

    const datePickerWrappers = await screen.findAllByTestId('datepicker')

    expect(datePickerWrappers.length).toEqual(2)

    const arrestWrapper = within(datePickerWrappers[0])

    const arrestDatePicker = arrestWrapper.getAllByText('Veldu dagsetningu')

    userEvent.click(arrestDatePicker[0])

    const tomorrow = addDays(new Date(), 1).getDate().toString()

    const candidateTomorrows = arrestWrapper.getAllByText(tomorrow)

    expect(candidateTomorrows.length).toBeGreaterThan(0)

    // Make sure we pick a date from the curent month
    let tommorrowOfCurentMont: HTMLElement
    if (tomorrow > '16') {
      tommorrowOfCurentMont = candidateTomorrows[candidateTomorrows.length - 1]
    } else {
      tommorrowOfCurentMont = candidateTomorrows[0]
    }

    // Assert
    expect(tommorrowOfCurentMont).toHaveAttribute('aria-disabled', 'true')
  })
})
