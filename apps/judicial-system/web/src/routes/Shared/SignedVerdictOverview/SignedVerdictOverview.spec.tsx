import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { SignedVerdictOverview } from './SignedVerdictOverview'
import { MemoryRouter, Route } from 'react-router-dom'
import { mockCaseQueries, mockJudgeQuery } from '../../../utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import * as Constants from '../../../utils/constants'
import '@testing-library/jest-dom'
import { UserProvider } from '../../../shared-components/UserProvider/UserProvider'

describe('Signed Verdict Overview route', () => {
  describe('Rejected case', () => {
    test('should have the correct title if case is not accepted', async () => {
      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <MemoryRouter
            initialEntries={[`${Constants.SIGNED_VERDICT_OVERVIEW}/test_id_2`]}
          >
            <UserProvider>
              <Route path={`${Constants.SIGNED_VERDICT_OVERVIEW}/:id`}>
                <SignedVerdictOverview />
              </Route>
            </UserProvider>
          </MemoryRouter>
        </MockedProvider>,
      )

      expect(
        await waitFor(() =>
          screen.getByText('Gæsluvarðhaldi hafnað', { selector: 'h1' }),
        ),
      ).toBeInTheDocument()
    })

    test('should have the correct subtitle if case is not accepted', async () => {
      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <MemoryRouter
            initialEntries={[`${Constants.SIGNED_VERDICT_OVERVIEW}/test_id_3`]}
          >
            <UserProvider>
              <Route path={`${Constants.SIGNED_VERDICT_OVERVIEW}/:id`}>
                <SignedVerdictOverview />
              </Route>
            </UserProvider>
          </MemoryRouter>
        </MockedProvider>,
      )

      expect(
        await waitFor(() =>
          screen.getByText('Úrskurðað 16. september 2020 kl. 19:51'),
        ),
      ).toBeInTheDocument()
    })

    test('should not show restrictions tag if case is rejected event though there are restrictions', async () => {
      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <MemoryRouter
            initialEntries={[`${Constants.SIGNED_VERDICT_OVERVIEW}/test_id_2`]}
          >
            <UserProvider>
              <Route path={`${Constants.SIGNED_VERDICT_OVERVIEW}/:id`}>
                <SignedVerdictOverview />
              </Route>
            </UserProvider>
          </MemoryRouter>
        </MockedProvider>,
      )

      expect(
        await waitFor(() =>
          screen.queryByText('Heimsóknarbann', { selector: 'span' }),
        ),
      ).not.toBeInTheDocument()
    })
  })

  describe('Accepted case with active custody', () => {
    test('should have the correct title if case is accepted', async () => {
      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <MemoryRouter
            initialEntries={[`${Constants.SIGNED_VERDICT_OVERVIEW}/test_id`]}
          >
            <UserProvider>
              <Route path={`${Constants.SIGNED_VERDICT_OVERVIEW}/:id`}>
                <SignedVerdictOverview />
              </Route>
            </UserProvider>
          </MemoryRouter>
        </MockedProvider>,
      )

      expect(
        await waitFor(() =>
          screen.getByText('Gæsluvarðhald virkt', { selector: 'h1' }),
        ),
      ).toBeInTheDocument()
    })

    test('should have the correct subtitle if case is accepted', async () => {
      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <MemoryRouter
            initialEntries={[`${Constants.SIGNED_VERDICT_OVERVIEW}/test_id`]}
          >
            <UserProvider>
              <Route path={`${Constants.SIGNED_VERDICT_OVERVIEW}/:id`}>
                <SignedVerdictOverview />
              </Route>
            </UserProvider>
          </MemoryRouter>
        </MockedProvider>,
      )

      expect(
        await waitFor(() =>
          screen.getByText('Gæsla til 16. september 2020 kl. 19:50'),
        ),
      ).toBeInTheDocument()
    })

    test('should show restrictions tag if there are restrictions and the case is accepted', async () => {
      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <MemoryRouter
            initialEntries={[`${Constants.SIGNED_VERDICT_OVERVIEW}/test_id`]}
          >
            <UserProvider>
              <Route path={`${Constants.SIGNED_VERDICT_OVERVIEW}/:id`}>
                <SignedVerdictOverview />
              </Route>
            </UserProvider>
          </MemoryRouter>
        </MockedProvider>,
      )

      expect(
        await waitFor(() =>
          screen.getByText('Fjölmiðlabann', { selector: 'span' }),
        ),
      ).toBeInTheDocument()
    })
  })
})
