import { createMemoryHistory } from 'history'
import React from 'react'
import { cleanup, render, waitFor } from '@testing-library/react'
import { Route, Router } from 'react-router-dom'
import fetchMock from 'fetch-mock'
import * as Constants from '../../utils/constants'
import JudgeOverview from './Overview'
import { CustodyRestrictions } from '../../types'

describe(`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`, () => {
  test('should display the string lausagæsla in custody restrictions if there are no custody restrictions', async () => {
    // Arrange
    const history = createMemoryHistory()

    // Ensure our route has an ID
    const route = `${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/test_id`
    history.push(route)

    // Mock API call to getCaseById
    fetchMock.mock('/api/case/test_id', {
      id: 'b5041539-27c0-426a-961d-0f268fe45165',
      created: '2020-09-16T19:50:08.033Z',
      modified: '2020-09-16T19:51:39.466Z',
      state: 'SUBMITTED',
      court: 'string',
      comments: 'string',
      policeCaseNumber: 'string',
      suspectNationalId: 'string',
      suspectName: 'string',
      suspectAddress: 'string',
      arrestDate: '2020-09-16T19:51:28.224Z',
      requestedCourtDate: '2020-09-16T19:51:28.224Z',
      requestedCustodyEndDate: '2020-09-16T19:51:28.224Z',
      lawsBroken: 'string',
      custodyProvisions: ['_95_1_A'],
      custodyRestrictions: [],
      caseFacts: 'string',
      witnessAccounts: 'string',
      investigationProgress: 'string',
      legalArguments: 'string',
    })

    // Act
    const { getByText } = render(
      <Router history={history}>
        <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
          <JudgeOverview />
        </Route>
      </Router>,
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
        state: 'SUBMITTED',
        court: 'string',
        comments: 'string',
        policeCaseNumber: 'string',
        suspectNationalId: 'string',
        suspectName: 'string',
        suspectAddress: 'string',
        arrestDate: '2020-09-16T19:51:28.224Z',
        requestedCourtDate: '2020-09-16T19:51:28.224Z',
        requestedCustodyEndDate: '2020-09-16T19:51:28.224Z',
        lawsBroken: 'string',
        custodyProvisions: ['_95_1_A'],
        custodyRestrictions: ['ISOLATION', 'MEDIA'],
        caseFacts: 'string',
        witnessAccounts: 'string',
        investigationProgress: 'string',
        legalArguments: 'string',
      },
      { overwriteRoutes: true },
    )

    // Act
    const { getByText } = render(
      <Router history={history}>
        <Route path={`${Constants.JUDGE_SINGLE_REQUEST_BASE_ROUTE}/:id`}>
          <JudgeOverview />
        </Route>
      </Router>,
    )

    // Assert
    await waitFor(() => getByText('B - Einangrun, E - Fjölmiðlabann'))
    expect(getByText('B - Einangrun, E - Fjölmiðlabann')).toBeTruthy()
    cleanup()
  })
})
