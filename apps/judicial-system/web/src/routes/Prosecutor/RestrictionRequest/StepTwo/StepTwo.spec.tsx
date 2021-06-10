import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockedProvider } from '@apollo/client/testing'
import formatISO from 'date-fns/formatISO'

import { UpdateCase } from '@island.is/judicial-system/types'
import {
  mockCaseQueries,
  mockInstitutionsQuery,
  mockProsecutorQuery,
  mockUpdateCaseMutation,
  mockUsersQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'
import StepTwo from './StepTwo'

describe('Custody petition, step two', () => {
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
          ...mockInstitutionsQuery,
          ...mockUpdateCaseMutation(
            [
              {
                requestedCourtDate: formatISO(lastDateOfTheMonth),
              } as UpdateCase,
            ],
            'test_id_6',
          ),
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
        mocks={[
          ...mockCaseQueries,
          ...mockProsecutorQuery,
          ...mockUsersQuery,
          ...mockInstitutionsQuery,
        ]}
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
        mocks={[
          ...mockCaseQueries,
          ...mockProsecutorQuery,
          ...mockUsersQuery,
          ...mockInstitutionsQuery,
        ]}
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
})
