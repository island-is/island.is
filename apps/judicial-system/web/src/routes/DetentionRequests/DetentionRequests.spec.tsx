import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { DetentionRequests } from './'
import { CaseState } from '@island.is/judicial-system/types'
import { MemoryRouter, Route } from 'react-router-dom'
import { userContext } from '../../utils/userContext'
import {
  mockJudgeUserContext,
  mockProsecutorUserContext,
} from '../../utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import { CasesQuery } from './DetentionRequests'
import * as Constants from '../../utils/constants'

const mockCasesQuery = [
  {
    request: {
      query: CasesQuery,
    },
    result: {
      data: {
        cases: [
          {
            id: 'test_id_1',
            created: '2020-09-16T19:50:08.033Z',
            state: 'DRAFT',
            policeCaseNumber: 'string',
            accusedNationalId: 'string',
            accusedName: 'Jon Harring',
            custodyEndDate: null,
          },
          {
            id: 'test_id_2',
            created: '2020-09-16T19:50:08.033Z',
            state: 'DRAFT',
            policeCaseNumber: 'string',
            accusedNationalId: 'string',
            accusedName: 'Jon Harring',
            custodyEndDate: null,
          },
          {
            id: 'test_id_3',
            created: '2020-09-16T19:50:08.033Z',
            state: CaseState.ACCEPTED,
            policeCaseNumber: '008-2020-X',
            accusedNationalId: '012345-6789',
            accusedName: 'Erlingur L Kristinsson',
            custodyEndDate: '2020-11-11T12:31:00.000Z',
          },
        ],
      },
    },
  },
]

describe('Detention requests route', () => {
  test('should list all cases that are not a draft a list if you are a judge', async () => {
    const { getAllByTestId } = render(
      <MockedProvider mocks={mockCasesQuery} addTypename={false}>
        <userContext.Provider value={mockJudgeUserContext}>
          <MemoryRouter
            initialEntries={[`${Constants.DETENTION_REQUESTS_ROUTE}`]}
          >
            <Route path={`${Constants.DETENTION_REQUESTS_ROUTE}`}>
              <DetentionRequests />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    await waitFor(() => getAllByTestId('detention-requests-table-row'))

    expect(getAllByTestId('detention-requests-table-row').length).toEqual(
      mockCasesQuery[0].result.data.cases.filter((dr) => {
        return dr.state !== CaseState.DRAFT
      }).length,
    )
  })

  test('should display the judge logo if you are a judge', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={mockCasesQuery} addTypename={false}>
        <userContext.Provider value={mockJudgeUserContext}>
          <MemoryRouter
            initialEntries={[`${Constants.DETENTION_REQUESTS_ROUTE}`]}
          >
            <Route path={`${Constants.DETENTION_REQUESTS_ROUTE}`}>
              <DetentionRequests />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    await waitFor(() => getByTestId('judge-logo'))

    expect(getByTestId('judge-logo')).toBeTruthy()
  })

  test('should not display a button to create a request if you are a judge', async () => {
    const { queryByText } = render(
      <MockedProvider mocks={mockCasesQuery} addTypename={false}>
        <userContext.Provider value={mockJudgeUserContext}>
          <MemoryRouter
            initialEntries={[`${Constants.DETENTION_REQUESTS_ROUTE}`]}
          >
            <Route path={`${Constants.DETENTION_REQUESTS_ROUTE}`}>
              <DetentionRequests />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    await waitFor(() => queryByText('Stofna nýja kröfu'))
    expect(queryByText('Stofna nýja kröfu')).toBeNull()
  })

  test('should display the prosecutor logo if you are a prosecutor', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={mockCasesQuery} addTypename={false}>
        <userContext.Provider value={mockProsecutorUserContext}>
          <MemoryRouter
            initialEntries={[`${Constants.DETENTION_REQUESTS_ROUTE}`]}
          >
            <Route path={`${Constants.DETENTION_REQUESTS_ROUTE}`}>
              <DetentionRequests />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    await waitFor(() => getByTestId('prosecutor-logo'))

    expect(getByTestId('prosecutor-logo')).toBeTruthy()
  })

  test('should list all cases in a list if you are a prosecutor', async () => {
    const { getAllByTestId } = render(
      <MockedProvider mocks={mockCasesQuery} addTypename={false}>
        <userContext.Provider value={mockProsecutorUserContext}>
          <MemoryRouter
            initialEntries={[`${Constants.DETENTION_REQUESTS_ROUTE}`]}
          >
            <Route path={`${Constants.DETENTION_REQUESTS_ROUTE}`}>
              <DetentionRequests />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    await waitFor(() => getAllByTestId('detention-requests-table-row'))

    expect(getAllByTestId('detention-requests-table-row').length).toEqual(
      mockCasesQuery[0].result.data.cases.length,
    )
  })

  test('should display custody end date if case has ACCEPTED status', async () => {
    render(
      <MockedProvider mocks={mockCasesQuery} addTypename={false}>
        <userContext.Provider value={mockProsecutorUserContext}>
          <MemoryRouter
            initialEntries={[`${Constants.DETENTION_REQUESTS_ROUTE}`]}
          >
            <Route path={`${Constants.DETENTION_REQUESTS_ROUTE}`}>
              <DetentionRequests />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )

    await waitFor(() => screen.getByText('11. nóv. 2020'))

    expect(screen.getByText('11. nóv. 2020')).toBeTruthy()
  })

  test('should display an error alert if the api call fails', async () => {
    const { getByTestId, queryByTestId } = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: CasesQuery,
            },
            error: { name: 'error', message: 'message' },
          },
        ]}
        addTypename={false}
      >
        <userContext.Provider value={mockProsecutorUserContext}>
          <MemoryRouter
            initialEntries={[`${Constants.DETENTION_REQUESTS_ROUTE}`]}
          >
            <Route path={`${Constants.DETENTION_REQUESTS_ROUTE}`}>
              <DetentionRequests />
            </Route>
          </MemoryRouter>
        </userContext.Provider>
      </MockedProvider>,
    )
    await waitFor(() => getByTestId('detention-requests-error'))

    expect(queryByTestId('detention-requests-table')).toBeNull()
    expect(getByTestId('detention-requests-error')).toBeTruthy()
  })
})
