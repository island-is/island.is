import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import { SignedVerdictOverview } from './SignedVerdictOverview'
import { MemoryRouter, Route } from 'react-router-dom'
import { mockCaseQueries, mockJudgeQuery } from '../../../utils/mocks'
import { MockedProvider } from '@apollo/client/testing'
import * as Constants from '../../../utils/constants'
import '@testing-library/jest-dom'
import { UserProvider } from '../../../shared-components/UserProvider/UserProvider'
import { formatDate, TIME_FORMAT } from '@island.is/judicial-system/formatters'

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
          screen.getByText('Kröfu hafnað', { selector: 'h1' }),
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
            initialEntries={[`${Constants.SIGNED_VERDICT_OVERVIEW}/test_id_4`]}
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
    test('should have the correct title', async () => {
      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <MemoryRouter
            initialEntries={[`${Constants.SIGNED_VERDICT_OVERVIEW}/test_id_5`]}
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

    test('should have the correct subtitle', async () => {
      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <MemoryRouter
            initialEntries={[`${Constants.SIGNED_VERDICT_OVERVIEW}/test_id_5`]}
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
          screen.getByText(
            `Gæsla til ${formatDate(new Date(), 'PPP')} kl. ${formatDate(
              new Date(),
              TIME_FORMAT,
            )}`,
          ),
        ),
      ).toBeInTheDocument()
    })

    test('should show restrictions tag if there are restrictions', async () => {
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

  describe('Accepted case with custody end time in the past', () => {
    test('should have the correct title', async () => {
      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <MemoryRouter
            initialEntries={[`${Constants.SIGNED_VERDICT_OVERVIEW}/test_id_6`]}
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
          screen.getByText('Gæsluvarðhaldi lokið', { selector: 'h1' }),
        ),
      ).toBeInTheDocument()
    })
  })

  describe('Accepted case with active travel ban', () => {
    test('should have the correct title', async () => {
      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <MemoryRouter
            initialEntries={[`${Constants.SIGNED_VERDICT_OVERVIEW}/test_id_7`]}
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
          screen.getByText('Farbann virkt', { selector: 'h1' }),
        ),
      ).toBeInTheDocument()
    })

    test('should have the correct subtitle', async () => {
      const date = '2020-09-25T19:50:08.033Z'
      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <MemoryRouter
            initialEntries={[`${Constants.SIGNED_VERDICT_OVERVIEW}/test_id_7`]}
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
          screen.getByText(
            `Farbann til ${formatDate(date, 'PPP')} kl. ${formatDate(
              date,
              TIME_FORMAT,
            )}`,
          ),
        ),
      ).toBeInTheDocument()
    })
  })

  describe('Accepted case with travel ban end time in the past', () => {
    test('should have the correct title', async () => {
      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <MemoryRouter
            initialEntries={[`${Constants.SIGNED_VERDICT_OVERVIEW}/test_id_8`]}
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
          screen.getByText('Farbanni lokið', { selector: 'h1' }),
        ),
      ).toBeInTheDocument()
    })

    test('should have the correct subtitle', async () => {
      const dateInPast = '2020-09-24T19:50:08.033Z'

      render(
        <MockedProvider
          mocks={[...mockCaseQueries, ...mockJudgeQuery]}
          addTypename={false}
        >
          <MemoryRouter
            initialEntries={[`${Constants.SIGNED_VERDICT_OVERVIEW}/test_id_8`]}
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
          screen.getByText(
            `Farbann rann út ${formatDate(dateInPast, 'PPP')} kl. ${formatDate(
              dateInPast,
              TIME_FORMAT,
            )}`,
          ),
        ),
      ).toBeInTheDocument()
    })
  })

  test('should have the correct subtitle', async () => {
    const dateInPast = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() - 1,
      new Date().getHours(),
    )

    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockJudgeQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.SIGNED_VERDICT_OVERVIEW}/test_id_6`]}
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
        screen.getByText(`Gæsla rann út 24. september 2020 kl. 19:50`),
      ),
    ).toBeInTheDocument()
  })

  test('should display restriction tags if there are restrictions', async () => {
    render(
      <MockedProvider
        mocks={[...mockCaseQueries, ...mockJudgeQuery]}
        addTypename={false}
      >
        <MemoryRouter
          initialEntries={[`${Constants.SIGNED_VERDICT_OVERVIEW}/test_id_6`]}
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
        screen.getByText('Heimsóknarbann', { selector: 'span' }),
      ),
    ).toBeInTheDocument()
  })
})
