import React from 'react'
import { render, waitFor, screen, act } from '@testing-library/react'
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
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components'

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
    userEvent.type(await screen.findByLabelText('Dómsalur *'), '999')

    // Assert
    expect(
      (await screen.findByRole('button', {
        name: /Halda áfram/i,
      })) as HTMLButtonElement,
    ).not.toBeDisabled()
  })

  test('should not allow users to continue if the case has a DRAFT status code', async () => {
    // Arrange
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation([
            {
              id: 'test_id_3',
              courtDate: '2020-09-12',
            } as UpdateCase,
            {
              id: 'test_id_3',
              courtDate: '2020-09-12T14:51:00.000Z',
            } as UpdateCase,
            {
              id: 'test_id_3',
              courtRoom: '999',
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
      await screen.findByRole('button', {
        name: /Halda áfram/i,
      }),
    ).toBeDisabled()
  })

  test("should have a info box that informs the user that they can't continue until the case is no longer a DRAFT", async () => {
    // Arrange
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation([
            {
              id: 'test_id_3',
              courtDate: '2020-09-12',
            } as UpdateCase,
            {
              id: 'test_id_3',
              courtDate: '2020-09-12T14:51:00.000Z',
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

    // Act

    // Assert
    expect(
      await screen.findByText('Krafa hefur ekki verið staðfest af ákæranda'),
    ).toBeInTheDocument()

    expect(
      await screen.findByText(
        'Þú getur úthlutað fyrirtökutíma, dómsal og verjanda en ekki er hægt að halda áfram fyrr en ákærandi hefur staðfest kröfuna.',
      ),
    ).toBeInTheDocument()
  })

  test('should have a prefilled court date with requested date', async () => {
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
      ((await screen.findByLabelText(
        'Veldu dagsetningu *',
      )) as HTMLInputElement).value,
    ).toEqual('16.09.2020')

    expect(
      ((await screen.findByLabelText('Tímasetning *')) as HTMLInputElement)
        .value,
    ).toEqual('19:51')
  })
})
