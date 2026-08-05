import { MockedProvider } from '@apollo/client/testing'
import { render, waitFor } from '@testing-library/react'

import { UserContext } from '@island.is/judicial-system-web/src/components'
import {
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
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
const reviewerUser = {
  ...mockUser(UserRole.PROSECUTOR),
  id: 'reviewer_id',
  institution: {
    ...mockUser(UserRole.PROSECUTOR).institution,
    type: InstitutionType.PUBLIC_PROSECUTORS_OFFICE,
  },
}

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      push: jest.fn(),
    }
  },
}))

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
})
