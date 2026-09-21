import type { FC, PropsWithChildren } from 'react'
import { useState } from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  FormContext,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import type {
  Case,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  IndictmentCaseReviewDecision,
  InstitutionType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  mockCase,
  mockCaseTableMembershipQuery,
  mockUser,
} from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import IndictmentOverview from './IndictmentOverview'

// A public prosecution reviewer assigned to the case so the review decision
// section is displayed.
const reviewerUser: User = {
  ...mockUser(UserRole.PROSECUTOR),
  id: 'reviewer_id',
  institution: {
    ...mockUser(UserRole.PROSECUTOR).institution,
    id: 'reviewer_institution_id',
    type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
  },
}

const mockPush = jest.fn()

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      push: mockPush,
    }
  },
}))

// The radios only change the working case; confirming saves through
// updateDefendant. The state update is kept real so a click is visible to the
// page, the server call is recorded.
const mockUpdateDefendant = jest.fn()

jest.mock('../../../../utils/hooks/useDefendants', () => ({
  __esModule: true,
  default: () => ({
    updateDefendant: mockUpdateDefendant,
    isUpdatingDefendant: false,
    updateDefendantState: (
      update: { defendantId: string; indictmentReviewDecision: unknown },
      setWorkingCase: (fn: (prev: Case) => Case) => void,
    ) =>
      setWorkingCase((prev) => ({
        ...prev,
        defendants: prev.defendants?.map((d) =>
          d.id === update.defendantId
            ? {
                ...d,
                indictmentReviewDecision:
                  update.indictmentReviewDecision as IndictmentCaseReviewDecision,
              }
            : d,
        ),
      })),
  }),
}))

// A form context whose working case actually updates, unlike the shared
// wrapper's jest.fn setter.
const StatefulFormContext: FC<PropsWithChildren<{ initialCase: Case }>> = ({
  initialCase,
  children,
}) => {
  const [workingCase, setWorkingCase] = useState<Case>(initialCase)

  return (
    <FormContext.Provider
      value={{
        workingCase,
        setWorkingCase,
        isLoadingWorkingCase: false,
        caseNotFound: false,
        isCaseUpToDate: true,
        refreshCase: jest.fn(),
        getCase: jest.fn(),
        isCreating: false,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

window.scrollTo = jest.fn()

describe('Prosecutor IndictmentOverview', () => {
  it('should not render a review decision for a defendant whose indictment was cancelled or dismissed (completed for some)', async () => {
    const { container } = render(
      <MockedProvider
        mocks={[...mockCaseTableMembershipQuery('test_id')]}
        addTypename={false}
      >
        <UserContext.Provider value={{ user: reviewerUser }}>
          <IntlProviderWrapper>
            <FormContextWrapper
              theCase={{
                ...mockCase(CaseType.INDICTMENT),
                state: CaseState.COMPLETED,
                indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
                // Reviewer matches the current user so the review decision
                // section is displayed.
                indictmentReviewer: { id: reviewerUser.id },
                defendants: [
                  {
                    id: 'dismissed_defendant_id',
                    created: '2020-09-16T19:50:08.033Z',
                    modified: '2020-09-16T19:51:39.466Z',
                    caseId: 'test_id',
                    name: 'Dismissed Defendant',
                    indictmentReviewDecision: null,
                    indictmentCancelledOrDismissedState: {
                      time: '2020-09-16T19:50:08.033Z',
                      type: CaseIndictmentRulingDecision.DISMISSAL,
                    },
                  },
                  {
                    id: 'active_defendant_id',
                    created: '2020-09-16T19:50:08.033Z',
                    modified: '2020-09-16T19:51:39.466Z',
                    caseId: 'test_id',
                    name: 'Active Defendant',
                    indictmentReviewDecision: null,
                  },
                ],
              }}
            >
              <IndictmentOverview />
            </FormContextWrapper>
          </IntlProviderWrapper>
        </UserContext.Provider>
      </MockedProvider>,
    )

    // The active defendant gets a review decision radio group...
    await waitFor(() =>
      expect(
        container.querySelector('#review-option-appeal-active_defendant_id'),
      ).toBeInTheDocument(),
    )

    // ...but the dismissed defendant does not.
    expect(
      container.querySelector('#review-option-appeal-dismissed_defendant_id'),
    ).not.toBeInTheDocument()
  })

  describe('confirming the review decisions', () => {
    // Two defendants; the first was already reviewed as ACCEPT, the second is
    // still undecided.
    const reviewCase = (): Case => ({
      ...mockCase(CaseType.INDICTMENT),
      state: CaseState.COMPLETED,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      indictmentReviewer: { id: reviewerUser.id },
      defendants: [
        {
          id: 'reviewed_defendant_id',
          name: 'Reviewed Defendant',
          indictmentReviewDecision: IndictmentCaseReviewDecision.ACCEPT,
        },
        {
          id: 'undecided_defendant_id',
          name: 'Undecided Defendant',
          indictmentReviewDecision: null,
        },
      ],
    })

    const renderReview = () =>
      render(
        <MockedProvider
          mocks={[...mockCaseTableMembershipQuery('test_id')]}
          addTypename={false}
        >
          <UserContext.Provider value={{ user: reviewerUser }}>
            <IntlProviderWrapper>
              <StatefulFormContext initialCase={reviewCase()}>
                <IndictmentOverview />
                {/* Modals portal into this container, normally supplied by PageLayout */}
                <div id="modal" />
              </StatefulFormContext>
            </IntlProviderWrapper>
          </UserContext.Provider>
        </MockedProvider>,
      )

    beforeEach(() => {
      mockUpdateDefendant.mockReset()
      mockPush.mockReset()
      mockUpdateDefendant.mockResolvedValue({ id: 'updated' })
    })

    it('opens one confirmation for the case and saves only the decisions that changed', async () => {
      const { container } = renderReview()

      await waitFor(() =>
        expect(
          container.querySelector(
            '#review-option-appeal-undecided_defendant_id',
          ),
        ).toBeInTheDocument(),
      )
      expect(
        screen.getByRole('button', { name: 'Ljúka yfirlestri' }),
      ).toBeDisabled()

      await userEvent.click(
        screen.getByLabelText('Áfrýja héraðsdómi til Landsréttar', {
          selector: '#review-option-appeal-undecided_defendant_id',
        }),
      )
      await userEvent.click(
        screen.getByRole('button', { name: 'Ljúka yfirlestri' }),
      )

      // One modal, whatever the number of defendants.
      expect(await screen.findAllByText('Staðfesta ákvörðun')).toHaveLength(1)

      await userEvent.click(screen.getByRole('button', { name: 'Staðfesta' }))

      await waitFor(() => expect(mockUpdateDefendant).toHaveBeenCalledTimes(1))
      expect(mockUpdateDefendant).toHaveBeenCalledWith({
        caseId: 'test_id',
        defendantId: 'undecided_defendant_id',
        indictmentReviewDecision: IndictmentCaseReviewDecision.APPEAL,
      })
      await waitFor(() => expect(mockPush).toHaveBeenCalled())
    })

    // The saves are independent requests; one that succeeded must not be sent
    // again when the reviewer retries after another failed.
    it('retries only the decision whose save failed', async () => {
      mockUpdateDefendant.mockImplementation(
        async ({ defendantId }: { defendantId: string }) =>
          defendantId === 'reviewed_defendant_id'
            ? { id: defendantId }
            : undefined,
      )
      const { container } = renderReview()

      await waitFor(() =>
        expect(
          container.querySelector(
            '#review-option-appeal-undecided_defendant_id',
          ),
        ).toBeInTheDocument(),
      )
      // Change both: the reviewed one flips to APPEAL, the undecided one is set.
      await userEvent.click(
        screen.getByLabelText('Áfrýja héraðsdómi til Landsréttar', {
          selector: '#review-option-appeal-reviewed_defendant_id',
        }),
      )
      await userEvent.click(
        screen.getByLabelText('Áfrýja héraðsdómi til Landsréttar', {
          selector: '#review-option-appeal-undecided_defendant_id',
        }),
      )
      await userEvent.click(
        screen.getByRole('button', { name: 'Ljúka yfirlestri' }),
      )
      await userEvent.click(
        await screen.findByRole('button', { name: 'Staðfesta' }),
      )

      await waitFor(() => expect(mockUpdateDefendant).toHaveBeenCalledTimes(2))
      expect(mockPush).not.toHaveBeenCalled()

      // Retry: only the failed defendant is sent.
      mockUpdateDefendant.mockClear()
      await userEvent.click(screen.getByRole('button', { name: 'Staðfesta' }))

      await waitFor(() => expect(mockUpdateDefendant).toHaveBeenCalledTimes(1))
      expect(mockUpdateDefendant).toHaveBeenCalledWith(
        expect.objectContaining({ defendantId: 'undecided_defendant_id' }),
      )
    })

    it('stays on the page when a save fails', async () => {
      mockUpdateDefendant.mockResolvedValue(undefined)
      const { container } = renderReview()

      await waitFor(() =>
        expect(
          container.querySelector(
            '#review-option-appeal-undecided_defendant_id',
          ),
        ).toBeInTheDocument(),
      )
      await userEvent.click(
        screen.getByLabelText('Áfrýja héraðsdómi til Landsréttar', {
          selector: '#review-option-appeal-undecided_defendant_id',
        }),
      )
      await userEvent.click(
        screen.getByRole('button', { name: 'Ljúka yfirlestri' }),
      )
      await userEvent.click(
        await screen.findByRole('button', { name: 'Staðfesta' }),
      )

      await waitFor(() => expect(mockUpdateDefendant).toHaveBeenCalledTimes(1))
      expect(mockPush).not.toHaveBeenCalled()
    })
  })
})
