import { createMemoryHistory } from 'history'
import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { Route, Router } from 'react-router-dom'
import * as Constants from '../../../utils/constants'
import Overview from './Overview'
import { UpdateCase } from '@island.is/judicial-system/types'
import userEvent from '@testing-library/user-event'
import {
  mockCaseQueries,
  mockJudgeQuery,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { UserProvider } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'

describe('/domari-krafa with an ID', () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    const history = createMemoryHistory()

    // Ensure our route has an ID
    const route = `${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/test_id_2`
    history.push(route)

    // Act and Assert
    render(
      <MockedProvider
        mocks={[
          ...mockCaseQueries,
          ...mockJudgeQuery,
          ...mockUpdateCaseMutation([
            {
              courtCaseNumber: '000-0000-000',
            } as UpdateCase,
          ]),
        ]}
        addTypename={false}
      >
        <Router history={history}>
          <UserProvider>
            <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <Overview />
            </Route>
          </UserProvider>
        </Router>
      </MockedProvider>,
    )
    userEvent.type(
      await waitFor(
        () => screen.getByLabelText('Slá inn málsnúmer *') as HTMLInputElement,
      ),
      '000-0000-000',
    )
    userEvent.tab()
    expect(
      screen.getByRole('button', {
        name: /Halda áfram/i,
      }) as HTMLButtonElement,
    ).not.toBeDisabled()
  })

  test('should display the string "Ekki er farið fram á takmarkanir á gæslu" in custody restrictions if there are no custody restrictions', async () => {
    // Arrange
    const history = createMemoryHistory()

    // Ensure our route has an ID
    const route = `${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/test_id_2`
    history.push(route)

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockJudgeQuery]}
        addTypename={false}
      >
        <Router history={history}>
          <UserProvider>
            <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <Overview />
            </Route>
          </UserProvider>
        </Router>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(() =>
        screen.getByText('Ekki er farið fram á takmarkanir á gæslu'),
      ),
    ).toBeTruthy()
  })

  test('should display the approprieate custody restrictions if there are any', async () => {
    // Arrange
    const history = createMemoryHistory()

    // Ensure our route has an ID
    const route = `${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/test_id`
    history.push(route)

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockJudgeQuery]}
        addTypename={false}
      >
        <Router history={history}>
          <UserProvider>
            <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <Overview />
            </Route>
          </UserProvider>
        </Router>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(() => screen.getByText('B - Einangrun, E - Fjölmiðlabann')),
    ).toBeInTheDocument()
  })

  test('should display the appropriate custody provisions', async () => {
    // Arrange
    const history = createMemoryHistory()

    // Ensure our route has an ID
    const route = `${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/test_id`
    history.push(route)

    // Act
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockJudgeQuery]}
        addTypename={false}
      >
        <Router history={history}>
          <UserProvider>
            <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <Overview />
            </Route>
          </UserProvider>
        </Router>
      </MockedProvider>,
    )

    // Assert
    expect(
      await waitFor(() => screen.getByText('a-lið 1. mgr. 95. gr.')),
    ).toBeInTheDocument()
    expect(screen.getByText('c-lið 1. mgr. 95. gr.')).toBeInTheDocument()
  })
})
