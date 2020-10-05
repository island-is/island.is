import React from 'react'
import fetchMock from 'fetch-mock'
import { act, render, waitFor } from '@testing-library/react'
import { DetentionRequests } from './'
import { UserRole } from '../../../utils/authenticate'
import { CaseState } from '@island.is/judicial-system/types'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { userContext } from '../../../utils/userContext'
import { mockJudge, mockProsecutor } from '../../../utils/mocks'

const mockDetensionRequests = [
  {
    id: 'fbad84cc-9cab-4145-bf8e-ac58cc9c2790',
    state: CaseState.DRAFT,
    policeCaseNumber: '007-2020-X',
    accusedNationalId: '150689-5989',
    accusedName: 'Katrín Erlingsdóttir',
    modified: '2020-08-31T10:47:35.565Z',
    created: '2020-08-31T10:47:35.565Z',
  },
  {
    id: 'fbad84cc-9cab-4145-bf8e-ac58cc9c2790',
    state: CaseState.SUBMITTED,
    policeCaseNumber: '008-2020-X',
    accusedNationalId: '012345-6789',
    accusedName: 'Erlingur Kristinsson',
    modified: '2020-08-31T10:47:35.565Z',
    created: '2020-08-31T10:47:35.565Z',
  },
  {
    id: 'fbad84cc-9cab-4145-bf8e-ac58cc9c2790',
    state: CaseState.SUBMITTED,
    policeCaseNumber: '008-2020-X',
    accusedNationalId: '012345-6789',
    accusedName: 'Erlingur L Kristinsson',
    modified: '2020-08-31T10:47:35.565Z',
    created: '2020-08-31T10:47:35.565Z',
  },
]

describe('Detention requests route', () => {
  test('should list submitted cases in a list if you are a judge', async () => {
    const history = createMemoryHistory()

    fetchMock.mock('/api/cases', mockDetensionRequests)

    const { getAllByTestId } = render(
      <userContext.Provider
        value={{
          user: mockJudge,
        }}
      >
        <Router history={history}>
          <DetentionRequests />
        </Router>
      </userContext.Provider>,
    )

    await waitFor(() => getAllByTestId('detention-requests-table-row'))

    expect(getAllByTestId('detention-requests-table-row').length).toEqual(
      mockDetensionRequests.filter((dr) => {
        return dr.state === CaseState.SUBMITTED
      }).length,
    )
  })

  test('should display the judge logo if you are a judge', async () => {
    const history = createMemoryHistory()

    const { getByTestId } = render(
      <userContext.Provider
        value={{
          user: mockJudge,
        }}
      >
        <Router history={history}>
          <DetentionRequests />
        </Router>
      </userContext.Provider>,
    )

    await waitFor(() => getByTestId('judge-logo'))

    expect(getByTestId('judge-logo')).toBeTruthy()
  })

  test('should not display a button to create a request if you are a judge', async () => {
    const history = createMemoryHistory()

    const { queryByText } = render(
      <userContext.Provider
        value={{
          user: mockJudge,
        }}
      >
        <Router history={history}>
          <DetentionRequests />
        </Router>
      </userContext.Provider>,
    )

    await waitFor(() => queryByText('Stofna nýja kröfu'))
    expect(queryByText('Stofna nýja kröfu')).toBeNull()
  })

  test('should display the prosecutor logo if you are a prosecutor', async () => {
    const history = createMemoryHistory()

    const { getByTestId } = render(
      <userContext.Provider
        value={{
          user: mockProsecutor,
        }}
      >
        <Router history={history}>
          <DetentionRequests />
        </Router>
      </userContext.Provider>,
    )

    await waitFor(() => getByTestId('prosecutor-logo'))

    expect(getByTestId('prosecutor-logo')).toBeTruthy()
  })

  test('should list all cases in a list if you are a prosecutor', async () => {
    const history = createMemoryHistory()

    fetchMock.mock('/api/user', mockProsecutor, { overwriteRoutes: true })

    const { getAllByTestId } = render(
      <userContext.Provider
        value={{
          user: mockProsecutor,
        }}
      >
        <Router history={history}>
          <DetentionRequests />
        </Router>
      </userContext.Provider>,
    )

    await waitFor(() => getAllByTestId('detention-requests-table-row'))

    expect(getAllByTestId('detention-requests-table-row').length).toEqual(
      mockDetensionRequests.length,
    )
  })

  test('should display an error alert if the api call fails', async () => {
    const history = createMemoryHistory()

    fetchMock.mock('/api/cases', 500, { overwriteRoutes: true })

    const { getByTestId, queryByTestId } = render(
      <userContext.Provider
        value={{
          user: mockProsecutor,
        }}
      >
        <Router history={history}>
          <DetentionRequests />
        </Router>
      </userContext.Provider>,
    )
    await waitFor(() => getByTestId('detention-requests-error'))

    expect(queryByTestId('detention-requests-table')).toBeNull()
    expect(getByTestId('detention-requests-error')).toBeTruthy()
    fetchMock.restore()
  })
})
