import { MockedProvider } from '@apollo/client/testing'
import { render, screen, within } from '@testing-library/react'

import { formatDate } from '@island.is/judicial-system/formatters'
import { Feature } from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { FeatureContext } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseState,
  AppealCourtSessionType,
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  CaseState,
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

  describe('the appeal-process section', () => {
    const appealedCase: WorkingCase = {
      ...mockCase(CaseType.INDICTMENT),
      state: CaseState.COMPLETED,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      defendants: [
        {
          id: 'defendant_id',
          name: 'Jón Sigurður Jónsson',
          appealDefenderName: 'Vaka Dagsdóttir',
        },
      ],
      caseFiles: [
        {
          id: 'declaration_id',
          name: 'yfirlysing.pdf',
          category: CaseFileCategory.DEFENDANT_APPEAL_DECLARATION,
          defendantId: 'defendant_id',
          created: '2026-08-16T13:34:00.000Z',
          isKeyAccessible: true,
        },
      ],
    }

    const renderOverview = (features: Feature[]) =>
      render(
        <MockedProvider
          mocks={[
            ...mockCaseTableMembershipQuery('test_id'),
            ...mockProsecutorSelectionUsersQuery,
          ]}
          addTypename={false}
        >
          <FeatureContext.Provider value={{ features, isLoading: false }}>
            <UserContextWrapper userRole={UserRole.PUBLIC_PROSECUTOR_STAFF}>
              <IntlProviderWrapper>
                <FormContextWrapper theCase={appealedCase}>
                  <Overview />
                </FormContextWrapper>
              </IntlProviderWrapper>
            </UserContextWrapper>
          </FeatureContext.Provider>
        </MockedProvider>,
      )

    it('should list the appeal declaration, sent in by the defender who appealed', async () => {
      renderOverview([Feature.INDICTMENT_APPEAL])

      expect(await screen.findByText('Áfrýjunarferli')).toBeInTheDocument()
      expect(screen.getByText('yfirlysing.pdf')).toBeInTheDocument()
      expect(screen.getByText('Verjandi (VD) sendi inn')).toBeInTheDocument()
    })

    it('should stay away while the feature is hidden', async () => {
      renderOverview([])

      expect(await screen.findAllByTestId('verdictTimelineCard')).toHaveLength(
        1,
      )
      expect(screen.queryByText('Áfrýjunarferli')).not.toBeInTheDocument()
    })
  })

  // Same agenda card the district prosecutor overview already shows: every
  // booked Landsréttur session, with type, date, time and courtroom.
  describe('the sessions the court of appeals has called', () => {
    const daysFromNow = (days: number, hours: number): Date => {
      const date = new Date()
      date.setDate(date.getDate() + days)
      date.setHours(hours, 15, 0, 0)

      return date
    }
    const mainHearing = daysFromNow(30, 9)
    const preparatoryHearing = daysFromNow(10, 13)

    const renderWithSessions = () =>
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
                  state: CaseState.COMPLETED,
                  indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
                  defendants: [
                    {
                      id: 'defendant_id',
                      name: 'Jón Sigurður Jónsson',
                    },
                  ],
                  verdictAppealCase: {
                    id: 'verdict_appeal_case_id',
                    appealState: AppealCaseState.RECEIVED,
                    appealEventLogs: [],
                    courtSessions: [
                      {
                        id: 'main_hearing_id',
                        sessionType: AppealCourtSessionType.MAIN_HEARING,
                        sessionDate: mainHearing.toISOString(),
                        courtRoom: '101',
                      },
                      {
                        id: 'preparatory_hearing_id',
                        sessionType:
                          AppealCourtSessionType.PREPARATORY_HEARING,
                        sessionDate: preparatoryHearing.toISOString(),
                        courtRoom: '102',
                      },
                    ],
                  },
                }}
              >
                <Overview />
              </FormContextWrapper>
            </IntlProviderWrapper>
          </UserContextWrapper>
        </MockedProvider>,
      )

    it('puts every booked session on the one agenda card', async () => {
      renderWithSessions()

      expect(await screen.findByText('Á dagskrá')).toBeInTheDocument()
      expect(screen.getAllByText('Á dagskrá')).toHaveLength(1)
      expect(screen.getByText('Aðalmeðferð')).toBeInTheDocument()
      expect(
        screen.getByText(formatDate(mainHearing, 'PPPp') ?? ''),
      ).toBeInTheDocument()
      expect(screen.getByText('Dómsalur 101')).toBeInTheDocument()
      expect(screen.getByText('Undirbúningsþinghald')).toBeInTheDocument()
      expect(
        screen.getByText(formatDate(preparatoryHearing, 'PPPp') ?? ''),
      ).toBeInTheDocument()
      expect(screen.getByText('Dómsalur 102')).toBeInTheDocument()
    })
  })
})
