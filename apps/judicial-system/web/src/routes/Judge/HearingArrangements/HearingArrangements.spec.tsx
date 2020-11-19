import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { HearingArrangements } from './HearingArrangements'
import { UpdateCase } from '@island.is/judicial-system/types'
import userEvent from '@testing-library/user-event'
import {
  mockCaseQueries,
  mockJudgeQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MemoryRouter, Route } from 'react-router-dom'
import { MockedProvider } from '@apollo/client/testing'
import * as Constants from '../../../utils/constants'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'

describe('/domari-krafa/fyrirtokutimi', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation([
            {
              id: 'test_id_2',
              courtDate: '2020-09-12',
            } as UpdateCase,
            {
              id: 'test_id_2',
              courtDate: '2020-09-12T14:51:00.000Z',
            } as UpdateCase,
            {
              id: 'test_id_2',
              courtRoom: '999',
            } as UpdateCase,
            {
              id: 'test_id_2',
              defenderName: 'Saul Goodman',
            } as UpdateCase,
            {
              id: 'test_id_2',
              defenderEmail: 'saul@goodman.com',
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.HEARING_ARRANGEMENTS_ROUTE}/test_id_2`]}
        >
          <UserProvider>
            <Route path={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/:id`}>
              <HearingArrangements />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Act
    userEvent.type(
      await waitFor(() => screen.getByLabelText('Dómsalur *')),
      '999',
    )

    userEvent.tab()

    // Assert
    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).not.toBeDisabled()
  })

  test('should have a prefilled court date and dedender info with requested  date and dedender info', async () => {
    // Arrange
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation([
            {
              id: 'test_id_3',
              courtDate: '2020-09-16',
            } as UpdateCase,
            {
              id: 'test_id_3',
              courtDate: '2020-09-16T19:51:00.000Z',
            } as UpdateCase,
            {
              id: 'test_id_3',
              defenderName: 'Saul Goodman',
            } as UpdateCase,
            {
              id: 'test_id_3',
              defenderEmail: 'saul@goodman.com',
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.HEARING_ARRANGEMENTS_ROUTE}/test_id_3`]}
        >
          <UserProvider>
            <Route path={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/:id`}>
              <HearingArrangements />
            </Route>
          </UserProvider>
        </MemoryRouter>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(
        () =>
          (screen.getByLabelText('Veldu dagsetningu *') as HTMLInputElement)
            .value,
      ),
    ).toEqual('16.09.2020')

    expect(
      (screen.getByLabelText('Tímasetning *') as HTMLInputElement).value,
    ).toEqual('19:51')

    expect(
      await waitFor(
        () =>
          (screen.getByLabelText('Nafn verjanda') as HTMLInputElement).value,
      ),
    ).toEqual('Saul Goodman')

    expect(
      await waitFor(
        () =>
          (screen.getByLabelText('Netfang verjanda') as HTMLInputElement).value,
      ),
    ).toEqual('saul@goodman.com')
  })
})
