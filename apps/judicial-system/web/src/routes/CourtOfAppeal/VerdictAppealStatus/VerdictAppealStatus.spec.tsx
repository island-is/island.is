import addDays from 'date-fns/addDays'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  COURT_OF_APPEAL_VERDICT_APPEAL_STATEMENT_DEADLINES_ROUTE,
  COURT_OF_APPEAL_VERDICT_APPEAL_SUMMARY_ROUTE,
} from '@island.is/judicial-system/consts'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseState,
  AppealCaseType,
  AppealCourtSessionType,
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
const mockCreateAppealCourtSession = jest.fn()

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useAppealCourtSession',
  () => ({
    __esModule: true,
    default: () => ({
      createAppealCourtSession: mockCreateAppealCourtSession,
      isCreatingAppealCourtSession: false,
    }),
  }),
)

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
      // The stepper only offers the steps after the defender step once every
      // advocate is confirmed, as the court will have done to get here.
      isAppealDefenderConfirmed: true,
    },
  ],
  verdictAppealCase: {
    id: 'verdict-appeal',
    appealState: AppealCaseState.RECEIVED,
    appealType: AppealCaseType.VERDICT,
  },
} as unknown as WorkingCase

const bookedSession = {
  id: 'session-1',
  sessionType: AppealCourtSessionType.MAIN_HEARING,
  sessionDate: new Date(2026, 11, 12, 14, 0).toISOString(),
  courtRoom: '1',
}

const caseWithBookedSession = {
  ...theCase,
  verdictAppealCase: {
    ...theCase.verdictAppealCase,
    courtSessions: [bookedSession],
  },
} as unknown as WorkingCase

const renderPage = (c: WorkingCase = theCase) =>
  render(
    <IntlProviderWrapper>
      <ApolloProviderWrapper>
        <UserContextWrapper userRole={UserRole.COURT_OF_APPEALS_JUDGE}>
          <FormContextWrapper theCase={c}>
            <VerdictAppealStatus />
          </FormContextWrapper>
        </UserContextWrapper>
      </ApolloProviderWrapper>
    </IntlProviderWrapper>,
  )

// Tomorrow rather than a fixed day: the picker refuses dates in the past.
const pickTomorrow = async () => {
  const today = new Date()
  const tomorrow = addDays(today, 1)

  await userEvent.click(screen.getByLabelText(/Dagsetning/))

  if (tomorrow.getMonth() !== today.getMonth()) {
    await userEvent.click(screen.getByLabelText('Next month'))
  }

  // The calendar pads its grid with the neighbouring months' days, so the
  // number alone can match twice. Only a cell of the month on view counts.
  const cell = screen
    .getAllByText(String(tomorrow.getDate()))
    .find(
      (el) =>
        el.className.includes('react-datepicker__day') &&
        !el.className.includes('outside-month'),
    )

  if (!cell) {
    throw new Error('No calendar cell for tomorrow')
  }

  await userEvent.click(cell)
}

const fillInSession = async () => {
  await userEvent.click(screen.getByLabelText('Boða til þinghalds'))
  await userEvent.click(screen.getByText('Veldu tegund þinghalds'))
  await userEvent.click(screen.getByText('Aðalmeðferð'))
  await pickTomorrow()
  await userEvent.type(
    screen.getByTestId('appeal-court-session-date-time'),
    '14:00',
  )
  await userEvent.type(screen.getByLabelText(/Dómsalur/), '1')
}

describe('VerdictAppealStatus', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockCreateAppealCourtSession.mockReset()
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

  // The status is not saved, so a booked session is what says the court
  // chose to call one. Opening the page reads that back.
  it('opens on the session status with the booked session listed', () => {
    renderPage(caseWithBookedSession)

    expect(screen.getByLabelText('Boða til þinghalds')).toBeChecked()
    expect(screen.getByText('Aðalmeðferð')).toBeInTheDocument()
    expect(
      screen.getByText('12.12.2026 kl. 14:00 · Dómsalur 1'),
    ).toBeInTheDocument()
  })

  it('continues straight to the summary when there is nothing to book', async () => {
    renderPage(caseWithBookedSession)

    await userEvent.click(screen.getByTestId('continueButton'))

    expect(mockCreateAppealCourtSession).not.toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith(
      `${COURT_OF_APPEAL_VERDICT_APPEAL_SUMMARY_ROUTE}/case-id?appealCaseId=verdict-appeal`,
    )
  })

  // The stepper offers the summary as soon as the form is complete, and it
  // calls the page's navigation handler straight. It must not be a way
  // around the booking the continue button asks for.
  it('books a filled-in session before the summary opens, from the stepper too', async () => {
    mockCreateAppealCourtSession.mockResolvedValue(bookedSession)
    renderPage()

    await fillInSession()
    await userEvent.click(screen.getByRole('button', { name: 'Samantekt' }))

    expect(screen.getByText('Boða til þinghalds?')).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()

    await userEvent.click(screen.getByTestId('confirmSessionButton'))

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        `${COURT_OF_APPEAL_VERDICT_APPEAL_SUMMARY_ROUTE}/case-id?appealCaseId=verdict-appeal`,
      ),
    )
    expect(mockCreateAppealCourtSession).toHaveBeenCalledWith(
      expect.objectContaining({
        caseId: 'case-id',
        appealCaseId: 'verdict-appeal',
        sessionType: AppealCourtSessionType.MAIN_HEARING,
        courtRoom: '1',
      }),
    )
  })

  it('cannot continue before a status is chosen', () => {
    renderPage()

    expect(screen.getByTestId('continueButton')).toBeDisabled()
  })

  it('leads back to the deadlines step with the appeal id', async () => {
    renderPage()

    await userEvent.click(screen.getByTestId('previousButton'))

    expect(mockPush).toHaveBeenCalledWith(
      `${COURT_OF_APPEAL_VERDICT_APPEAL_STATEMENT_DEADLINES_ROUTE}/case-id?appealCaseId=verdict-appeal`,
    )
  })
})
