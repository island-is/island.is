import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { COURT_OF_APPEAL_VERDICT_APPEAL_DEFENDER_ROUTE } from '@island.is/judicial-system/consts'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseState,
  AppealCaseType,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  ApolloProviderWrapper,
  FormContextWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import VerdictAppealStatus from './VerdictAppealStatus'

const mockPush = jest.fn()

// The footer's back button goes through the default router export, the page
// itself through the hook, so both are mocked onto the same push.
jest.mock('next/router', () => ({
  __esModule: true,
  default: { push: (url: string) => mockPush(url) },
  useRouter() {
    return {
      pathname: '',
      query: { appealCaseId: 'verdict-appeal' },
      push: mockPush,
    }
  },
}))

const theCase = {
  ...mockCase(CaseType.INDICTMENT),
  id: 'case-id',
  state: CaseState.COMPLETED,
  courtCaseNumber: 'S-123/2026',
  defendants: [
    {
      id: 'd1',
      name: 'Jón Jónsson',
      verdict: { appealDate: '2026-06-04T10:00:00.000Z' },
    },
  ],
  verdictAppealCase: {
    id: 'verdict-appeal',
    appealState: AppealCaseState.RECEIVED,
    appealType: AppealCaseType.VERDICT,
  },
} as unknown as WorkingCase

const renderPage = () =>
  render(
    <IntlProviderWrapper>
      <ApolloProviderWrapper>
        <UserContextWrapper userRole={UserRole.COURT_OF_APPEALS_JUDGE}>
          <FormContextWrapper theCase={theCase}>
            <VerdictAppealStatus />
          </FormContextWrapper>
        </UserContextWrapper>
      </ApolloProviderWrapper>
    </IntlProviderWrapper>,
  )

describe('VerdictAppealStatus', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('names the case and who appealed', () => {
    renderPage()

    expect(
      screen.getByText('Málsnr. héraðsdóms S-123/2026'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Dómfelldi áfrýjaði 4. júní 2026'),
    ).toBeInTheDocument()
  })

  it('offers every status as one group of radios', () => {
    renderPage()

    const group = screen.getByRole('group', { name: 'Staða' })

    expect(group).toBeInTheDocument()
    expect(
      screen.getAllByRole('radio').map((r) => r.getAttribute('id')),
    ).toEqual([
      'verdict-appeal-status-STATEMENT_DEADLINE_GRANTED',
      'verdict-appeal-status-COURT_SESSION_SCHEDULED',
      'verdict-appeal-status-POSTPONED',
      'verdict-appeal-status-UNDER_ADVISEMENT',
      'verdict-appeal-status-COMPLETED',
    ])
  })

  // The booking form is only about one of the statuses, so it stays out of
  // the way until that one is chosen.
  it('shows the session form only when the court is calling a session', async () => {
    renderPage()

    expect(
      screen.queryByRole('heading', { name: 'Boða til þinghalds' }),
    ).not.toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Boða til þinghalds'))

    expect(
      screen.getByRole('heading', { name: 'Boða til þinghalds' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Tegund þinghalds')).toBeInTheDocument()
    expect(screen.getByLabelText(/Dagsetning/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Tímasetning/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Dómsalur/)).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Lokið'))

    // The section animates out, so it leaves the document a moment later.
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Boða til þinghalds' }),
      ).not.toBeInTheDocument(),
    )
  })

  it('leads back to the defender step with the appeal id', async () => {
    renderPage()

    await userEvent.click(screen.getByTestId('previousButton'))

    expect(mockPush).toHaveBeenCalledWith(
      `${COURT_OF_APPEAL_VERDICT_APPEAL_DEFENDER_ROUTE}/case-id?appealCaseId=verdict-appeal`,
    )
  })
})
