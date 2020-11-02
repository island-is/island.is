import { createMemoryHistory } from 'history'
import React from 'react'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { Route, Router } from 'react-router-dom'
import * as Constants from '../../../utils/constants'
import Overview from './Overview'
import { UpdateCase } from '@island.is/judicial-system/types'
import userEvent from '@testing-library/user-event'
import { userContext } from '../../../utils/userContext'
import {
  mockCaseQueries,
  mockJudgeUserContext,
  mockUpdateCaseMutation,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { MockedProvider } from '@apollo/client/testing'

describe(`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`, () => {
  test('should not allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    const history = createMemoryHistory()

    // Ensure our route has an ID
    const route = `${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/test_id_2`
    history.push(route)

    Storage.prototype.setItem = jest.fn()

    // Act and Assert
    const { getByTestId } = render(
      <MockedProvider
        mocks={[].concat(mockCaseQueries).concat(
          mockUpdateCaseMutation([
            {
              courtCaseNumber: '000-0000-000',
            } as UpdateCase,
          ]),
        )}
        addTypename={false}
      >
        <userContext.Provider value={mockJudgeUserContext}>
          <Router history={history}>
            <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <Overview />
            </Route>
          </Router>
        </userContext.Provider>
      </MockedProvider>,
    )
    await act(async () => {
      await userEvent.type(
        await waitFor(() => getByTestId('courtCaseNumber') as HTMLInputElement),
        '000-0000-000',
      )
      userEvent.tab()
      expect(
        (getByTestId('continueButton') as HTMLButtonElement).disabled,
      ).toBe(false)
    })
  })

  test('should display the string lausagæsla in custody restrictions if there are no custody restrictions', async () => {
    // Arrange
    const history = createMemoryHistory()

    // Ensure our route has an ID
    const route = `${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/test_id_2`
    history.push(route)

    // Act
    const { getByText } = render(
      <MockedProvider mocks={mockCaseQueries} addTypename={false}>
        <userContext.Provider value={mockJudgeUserContext}>
          <Router history={history}>
            <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <Overview />
            </Route>
          </Router>
        </userContext.Provider>
      </MockedProvider>,
    )

    // Assert
    await waitFor(() => getByText('Lausagæsla'))
    expect(getByText('Lausagæsla')).toBeTruthy()
    cleanup()
  })

  test('should display the approprieate custody restriction if there are any', async () => {
    // Arrange
    const history = createMemoryHistory()

    // Ensure our route has an ID
    const route = `${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/test_id`
    history.push(route)

    // Act
    const { getByText } = render(
      <MockedProvider mocks={mockCaseQueries} addTypename={false}>
        <userContext.Provider value={mockJudgeUserContext}>
          <Router history={history}>
            <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <Overview />
            </Route>
          </Router>
        </userContext.Provider>
      </MockedProvider>,
    )

    // Assert
    await waitFor(() => getByText('B - Einangrun, E - Fjölmiðlabann'))
    expect(getByText('B - Einangrun, E - Fjölmiðlabann')).toBeTruthy()
    cleanup()
  })

  test('should display the appropriate custody provisions', async () => {
    // Arrange
    const history = createMemoryHistory()

    // Ensure our route has an ID
    const route = `${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/test_id`
    history.push(route)

    // Act
    const { getByText } = render(
      <MockedProvider mocks={mockCaseQueries} addTypename={false}>
        <userContext.Provider value={mockJudgeUserContext}>
          <Router history={history}>
            <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
              <Overview />
            </Route>
          </Router>
        </userContext.Provider>
      </MockedProvider>,
    )

    // Assert
    await waitFor(() => getByText('a-lið 1. mgr. 95. gr.'))
    expect(getByText('a-lið 1. mgr. 95. gr.')).toBeTruthy()
    await waitFor(() => getByText('c-lið 1. mgr. 95. gr.'))
    expect(getByText('c-lið 1. mgr. 95. gr.')).toBeTruthy()
    cleanup()
  })
})
