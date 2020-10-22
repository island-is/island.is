import { createMemoryHistory } from 'history'
import React from 'react'
import { act, cleanup, render, waitFor } from '@testing-library/react'
import { Route, Router } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import * as Constants from '../../../utils/constants'
import JudgeOverview from './Overview'
import { CaseCustodyProvisions } from '@island.is/judicial-system/types'
import Overview from '../../Judge/Overview/Overview'
import userEvent from '@testing-library/user-event'
import { userContext } from '../../../utils/userContext'
import { mockJudge } from '@island.is/judicial-system-web/src/utils/mocks'

describe(`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`, () => {
  test('should now allow users to continue unless every required field has been filled out', async () => {
    // Arrange
    const history = createMemoryHistory()

    // Ensure our route has an ID
    const route = `${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/test_id`
    history.push(route)

    // Mock call to api.updateCase and api.getCase
    fetchMock.mock(
      '/api/case/test_id',
      { custodyProvisions: [], id: 'test_id' },
      { method: 'get' },
    )
    fetchMock.mock('/api/case/test_id', 200, { method: 'put' })

    Storage.prototype.setItem = jest.fn()

    // Act and Assert
    const { getByTestId } = render(
      <userContext.Provider value={{ user: mockJudge }}>
        <Router history={history}>
          <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
            <Overview />
          </Route>
        </Router>
      </userContext.Provider>,
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
    const route = `${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/test_id`
    history.push(route)

    // Mock API call to getCaseById
    fetchMock.mock(
      '/api/case/test_id',
      {
        id: 'b5041539-27c0-426a-961d-0f268fe45165',
        created: '2020-09-16T19:50:08.033Z',
        modified: '2020-09-16T19:51:39.466Z',
        state: 'DRAFT',
        court: 'string',
        comments: 'string',
        policeCaseNumber: 'string',
        accusedNationalId: 'string',
        accusedName: 'string',
        accusedAddress: 'string',
        arrestDate: '2020-09-16T19:51:28.224Z',
        requestedCourtDate: '2020-09-16T19:51:28.224Z',
        requestedCustodyEndDate: '2020-09-16T19:51:28.224Z',
        lawsBroken: 'string',
        custodyProvisions: ['_95_1_A'],
        requestedCustodyRestrictions: [],
        caseFacts: 'string',
        witnessAccounts: 'string',
        investigationProgress: 'string',
        legalArguments: 'string',
      },
      { overwriteRoutes: true },
    )

    // Act
    const { getByText } = render(
      <userContext.Provider value={{ user: mockJudge }}>
        <Router history={history}>
          <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
            <JudgeOverview />
          </Route>
        </Router>
      </userContext.Provider>,
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

    // Mock API call to getCaseById
    fetchMock.mock(
      '/api/case/test_id',
      {
        id: 'b5041539-27c0-426a-961d-0f268fe45165',
        created: '2020-09-16T19:50:08.033Z',
        modified: '2020-09-16T19:51:39.466Z',
        state: 'DRAFT',
        court: 'string',
        comments: 'string',
        policeCaseNumber: 'string',
        accusedNationalId: 'string',
        accusedName: 'string',
        accusedAddress: 'string',
        arrestDate: '2020-09-16T19:51:28.224Z',
        requestedCourtDate: '2020-09-16T19:51:28.224Z',
        requestedCustodyEndDate: '2020-09-16T19:51:28.224Z',
        lawsBroken: 'string',
        custodyProvisions: ['_95_1_A'],
        requestedCustodyRestrictions: ['ISOLATION', 'MEDIA'],
        caseFacts: 'string',
        witnessAccounts: 'string',
        investigationProgress: 'string',
        legalArguments: 'string',
      },
      { overwriteRoutes: true },
    )

    // Act
    const { getByText } = render(
      <userContext.Provider value={{ user: mockJudge }}>
        <Router history={history}>
          <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
            <JudgeOverview />
          </Route>
        </Router>
        ,
      </userContext.Provider>,
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

    // Mock API call to getCaseById
    fetchMock.mock(
      '/api/case/test_id',
      {
        id: 'b5041539-27c0-426a-961d-0f268fe45165',
        created: '2020-09-16T19:50:08.033Z',
        modified: '2020-09-16T19:51:39.466Z',
        state: 'DRAFT',
        court: 'string',
        comments: 'string',
        policeCaseNumber: 'string',
        accusedNationalId: 'string',
        accusedName: 'string',
        accusedAddress: 'string',
        arrestDate: '2020-09-16T19:51:28.224Z',
        requestedCourtDate: '2020-09-16T19:51:28.224Z',
        requestedCustodyEndDate: '2020-09-16T19:51:28.224Z',
        lawsBroken: 'string',
        custodyProvisions: [
          CaseCustodyProvisions._95_1_A,
          CaseCustodyProvisions._95_1_C,
        ],
        requestedCustodyRestrictions: ['ISOLATION', 'MEDIA'],
        caseFacts: 'string',
        witnessAccounts: 'string',
        investigationProgress: 'string',
        legalArguments: 'string',
      },
      { overwriteRoutes: true },
    )

    // Act
    const { getByText } = render(
      <userContext.Provider value={{ user: mockJudge }}>
        <Router history={history}>
          <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
            <JudgeOverview />
          </Route>
        </Router>
      </userContext.Provider>,
    )

    // Assert
    await waitFor(() => getByText('a-lið 1. mgr. 95. gr.'))
    expect(getByText('a-lið 1. mgr. 95. gr.')).toBeTruthy()
    await waitFor(() => getByText('c-lið 1. mgr. 95. gr.'))
    expect(getByText('c-lið 1. mgr. 95. gr.')).toBeTruthy()
    cleanup()
  })
})
