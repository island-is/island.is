import React from 'react'
import { render, waitFor, screen, within } from '@testing-library/react'
import { HearingArrangements } from './HearingArrangements'
import { UpdateCase } from '@island.is/judicial-system/types'
import userEvent from '@testing-library/user-event'
import {
  mockCaseQueries,
  mockJudgeUserContext,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { userContext } from '@island.is/judicial-system-web/src/utils/userContext'
import { MemoryRouter, Route } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing'
import formatISO from 'date-fns/formatISO'
import * as Constants from '../../../utils/constants'

describe('/domari-krafa/fyrirtokutimi', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    const now = new Date()
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
    )
    tomorrow.setHours(13, 37)

    // Act and Assert
    render(
      <MockedProvider
        mocks={mockCaseQueries.concat(
          mockUpdateCaseMutation([
            {
              id: 'test_id_2',
              courtDate: formatISO(tomorrow, { representation: 'date' }),
            } as UpdateCase,
            {
              id: 'test_id_2',
              courtDate: formatISO(tomorrow),
            } as UpdateCase,
            {
              id: 'test_id_2',
              courtRoom: '999',
            } as UpdateCase,
          ]),
        )}
        addTypename={false}
      >
        <userContext.Provider value={mockJudgeUserContext}>
          <MemoryRouter
            initialEntries={[
              `${Constants.HEARING_ARRANGEMENTS_ROUTE}/test_id_2`,
            ]}
          >
            <Route path={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/:id`}>
              <HearingArrangements />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    const datepicker = await waitFor(() => screen.getByTestId('datepicker'))
    const courtDatePickerWrapper = within(datepicker)
    const courtDatePicker = courtDatePickerWrapper.getAllByText(
      'Veldu dagsetningu',
    )
    userEvent.click(courtDatePicker[0])
    userEvent.click(
      courtDatePickerWrapper.getAllByText((now.getDate() + 1).toString())[0],
    )

    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.type(
      screen.getByLabelText('Tímasetning *') as HTMLInputElement,
      '13:37',
    )

    userEvent.tab()

    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).toBeDisabled()

    userEvent.type(screen.getByLabelText('Dómsalur *'), '999')

    userEvent.tab()

    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).not.toBeDisabled()
  })

  // TODO: FIX THIS BROKEN TEST
  test('should have a prefilled court date with requested court date', async () => {
    // Arrange
    render(
      <MockedProvider mocks={mockCaseQueries} addTypename={false}>
        <userContext.Provider value={mockJudgeUserContext}>
          <MemoryRouter
            initialEntries={[`${Constants.HEARING_ARRANGEMENTS_ROUTE}/test_id`]}
          >
            <Route path={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/:id`}>
              <HearingArrangements />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    // Act

    // Assert
    expect(
      await waitFor(() => screen.getByRole('button', { name: /16.09.2020/i })),
    ).toBeInTheDocument()

    expect(
      (screen.getByLabelText('Tímasetning *') as HTMLInputElement).value,
    ).toEqual('19:51')
  })
})
