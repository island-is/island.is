import { MockedProvider } from '@apollo/client/testing'
import { render, screen, within } from '@testing-library/react'

import {
  CaseIndictmentRulingDecision,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  mockCase,
  mockCaseTableMembershipQuery,
  mockProsecutorSelectionUsersQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import Overview from './Overview'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      push: jest.fn(),
    }
  },
}))

window.scrollTo = jest.fn()

describe('PublicProsecutor Overview', () => {
  it('should not render a verdict timeline card for a defendant whose indictment was cancelled or dismissed (completed for some)', async () => {
    render(
      <MockedProvider
        mocks={[
          ...mockCaseTableMembershipQuery('test_id'),
          ...mockProsecutorSelectionUsersQuery,
        ]}
        addTypename={false}
      >
        <UserContextWrapper userRole={UserRole.PUBLIC_PROSECUTOR_STAFF}>
          <IntlProviderWrapper>
            <FormContextWrapper
              theCase={{
                ...mockCase(CaseType.INDICTMENT),
                indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
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
              <Overview />
            </FormContextWrapper>
          </IntlProviderWrapper>
        </UserContextWrapper>
      </MockedProvider>,
    )

    const timelineCards = await screen.findAllByTestId('verdictTimelineCard')

    expect(timelineCards).toHaveLength(1)
    expect(
      within(timelineCards[0]).getByText('Active Defendant'),
    ).toBeInTheDocument()
  })
})
