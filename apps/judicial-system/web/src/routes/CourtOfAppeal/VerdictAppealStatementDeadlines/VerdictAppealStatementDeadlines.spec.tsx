import addDays from 'date-fns/addDays'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  COURT_OF_APPEAL_VERDICT_APPEAL_DEFENDER_ROUTE,
  COURT_OF_APPEAL_VERDICT_APPEAL_STATEMENT_ROUTE,
  COURT_OF_APPEAL_VERDICT_APPEAL_STATUS_ROUTE,
} from '@island.is/judicial-system/consts'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseState,
  AppealCaseType,
  AppealEventType,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  ApolloProviderWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import VerdictAppealStatementDeadlines from './VerdictAppealStatementDeadlines'

const mockPush = jest.fn()
const mockSetAppealStatementDeadline = jest.fn()
const mockSetWorkingCase = jest.fn()

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useAppealStatementDeadline',
  () => ({
    __esModule: true,
    default: () => ({
      setAppealStatementDeadline: mockSetAppealStatementDeadline,
      isSettingAppealStatementDeadline: false,
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
    { id: 'd1', name: 'Gervimaður Jónsson', isAppealDefenderConfirmed: true },
  ],
  civilClaimants: [{ id: 'c1', name: 'Fyrsti Kröfuhafi' }],
  appealProsecutor: { id: 'p1', name: 'Sækjandi Sækjandason' },
  verdictAppealCase: {
    id: 'verdict-appeal',
    appealState: AppealCaseState.RECEIVED,
    appealType: AppealCaseType.VERDICT,
    appealCaseNumber: '555/2026',
    statementDeadlines: [
      { id: 'sd1', defendantId: 'd1', deadline: '2026-10-12T00:00:00.000Z' },
    ],
    appealEventLogs: [
      {
        id: 'e1',
        eventType: AppealEventType.APPEAL_STATEMENT_SENT,
        civilClaimantId: 'c1',
      },
    ],
  },
} as unknown as WorkingCase

// The shared form context wrapper swallows setWorkingCase. This one keeps
// the updater the page hands it, so a spec can apply it to the case and see
// what the page wrote.
const renderPage = (c: WorkingCase = theCase) =>
  render(
    <IntlProviderWrapper>
      <ApolloProviderWrapper>
        <UserContextWrapper userRole={UserRole.COURT_OF_APPEALS_JUDGE}>
          <FormContext.Provider
            value={{
              workingCase: c,
              setWorkingCase: mockSetWorkingCase,
              isLoadingWorkingCase: false,
              caseNotFound: false,
              isCaseUpToDate: true,
              refreshCase: jest.fn(),
              getCase: jest.fn(),
              isCreating: false,
            }}
          >
            <VerdictAppealStatementDeadlines />
          </FormContext.Provider>
        </UserContextWrapper>
      </ApolloProviderWrapper>
    </IntlProviderWrapper>,
  )

const card = (name: string) => within(screen.getByRole('region', { name }))

// Tomorrow rather than a fixed day: the picker refuses dates in the past.
const pickTomorrow = async (name: string) => {
  const today = new Date()
  const tomorrow = addDays(today, 1)

  await userEvent.click(card(name).getByLabelText(/Frestur til/))

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

  return tomorrow
}

describe('VerdictAppealStatementDeadlines', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockSetAppealStatementDeadline.mockReset()
    mockSetWorkingCase.mockReset()
  })

  it('names the appeal and the district court case', () => {
    renderPage()

    expect(screen.getByText('Mál nr. 555/2026')).toBeInTheDocument()
    expect(
      screen.getByText('Málsnr. héraðsdóms S-123/2026'),
    ).toBeInTheDocument()
  })

  it('lists every party with where its statement stands', () => {
    renderPage()

    expect(
      card('Gervimaður Jónsson').getByText('Ákærði - Greinargerð ekki skilað'),
    ).toBeInTheDocument()
    expect(
      card('Sækjandi Sækjandason').getByText(
        'Ákæruvaldið - Greinargerð ekki skilað',
      ),
    ).toBeInTheDocument()
    expect(
      card('Fyrsti Kröfuhafi').getByText('Bótakröfuhafi - Greinargerð skilað'),
    ).toBeInTheDocument()
  })

  // A party with a deadline is offered an extension; one without is sent a
  // first deadline; one whose statement is in is offered nothing, and its
  // date is locked.
  it('offers each party the action its deadline calls for', () => {
    renderPage()

    // A text button is a span with the aria state, not a disabled control.
    expect(
      card('Gervimaður Jónsson').getByRole('button', {
        name: 'Framlengja frest',
      }),
    ).toHaveAttribute('aria-disabled', 'true')
    expect(
      card('Sækjandi Sækjandason').getByRole('button', { name: 'Senda frest' }),
    ).toHaveAttribute('aria-disabled', 'true')
    expect(
      card('Fyrsti Kröfuhafi').queryByRole('button', { name: /frest/ }),
    ).not.toBeInTheDocument()
    expect(
      card('Fyrsti Kröfuhafi').getByLabelText(/Frestur til/),
    ).toBeDisabled()
  })

  // The court files a statement itself through the card's menu. A party
  // whose statement is in has none: there is nothing left to file.
  it('offers to upload a statement for each party whose is not in', async () => {
    renderPage()

    expect(
      card('Fyrsti Kröfuhafi').queryByRole('button', { name: /Valmynd/ }),
    ).not.toBeInTheDocument()

    await userEvent.click(
      card('Gervimaður Jónsson').getByRole('button', {
        name: 'Valmynd fyrir Gervimaður Jónsson',
      }),
    )
    // The item's handler sits on the button inside the menu item, not on
    // the item itself, so the click goes to the text.
    await userEvent.click(
      await screen.findByText('Hlaða upp greinargerð', { selector: 'button' }),
    )

    expect(mockPush).toHaveBeenCalledWith(
      `${COURT_OF_APPEAL_VERDICT_APPEAL_STATEMENT_ROUTE}/case-id?appealCaseId=verdict-appeal&defendantId=d1`,
    )
  })

  it('names nobody on the upload link for the prosecution', async () => {
    renderPage()

    await userEvent.click(
      card('Sækjandi Sækjandason').getByRole('button', {
        name: 'Valmynd fyrir Sækjandi Sækjandason',
      }),
    )
    // The item's handler sits on the button inside the menu item, not on
    // the item itself, so the click goes to the text.
    await userEvent.click(
      await screen.findByText('Hlaða upp greinargerð', { selector: 'button' }),
    )

    expect(mockPush).toHaveBeenCalledWith(
      `${COURT_OF_APPEAL_VERDICT_APPEAL_STATEMENT_ROUTE}/case-id?appealCaseId=verdict-appeal`,
    )
  })

  it('sends a first deadline after the court confirms it', async () => {
    const saved = {
      id: 'sd2',
      deadline: '2026-12-01T00:00:00.000Z',
    }
    mockSetAppealStatementDeadline.mockResolvedValue(saved)
    renderPage()

    const tomorrow = await pickTomorrow('Sækjandi Sækjandason')
    await userEvent.click(
      card('Sækjandi Sækjandason').getByRole('button', { name: 'Senda frest' }),
    )

    expect(
      screen.getByRole('heading', {
        name: 'Viltu senda út greinargerðarfrest?',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Ákæruvaldið fær frest til að senda inn greinargerð.'),
    ).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('confirmStatementDeadlineButton'))

    const sentDeadline = new Date(tomorrow)
    sentDeadline.setHours(0, 0, 0, 0)

    expect(mockSetAppealStatementDeadline).toHaveBeenCalledWith({
      caseId: 'case-id',
      appealCaseId: 'verdict-appeal',
      defendantId: undefined,
      civilClaimantId: undefined,
      deadline: sentDeadline.toISOString(),
    })

    // The dialog closes on success, and the saved row is written into the
    // case so the party's next action is an extension.
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
    expect(mockSetWorkingCase).toHaveBeenCalledTimes(1)

    const update = mockSetWorkingCase.mock.calls[0][0] as (
      previous: WorkingCase,
    ) => WorkingCase

    expect(update(theCase).verdictAppealCase?.statementDeadlines).toEqual([
      ...(theCase.verdictAppealCase?.statementDeadlines ?? []),
      saved,
    ])
  })

  it('names the defendant on the request and in the confirmation', async () => {
    mockSetAppealStatementDeadline.mockResolvedValue({
      id: 'sd1',
      defendantId: 'd1',
      deadline: '2026-12-01T00:00:00.000Z',
    })
    renderPage()

    await pickTomorrow('Gervimaður Jónsson')
    await userEvent.click(
      card('Gervimaður Jónsson').getByRole('button', {
        name: 'Framlengja frest',
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: 'Viltu framlengja greinargerðarfrest?',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Ákærði Gervimaður Jónsson fær aukinn frest til að senda inn greinargerð.',
      ),
    ).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('confirmStatementDeadlineButton'))

    expect(mockSetAppealStatementDeadline).toHaveBeenCalledWith(
      expect.objectContaining({ defendantId: 'd1' }),
    )
  })

  // A second click on the confirm button before the first request answers
  // must not send the deadline again.
  it('sends once however often the confirm button is clicked', async () => {
    let resolveSend: (value: unknown) => void = () => undefined
    mockSetAppealStatementDeadline.mockReturnValue(
      new Promise((resolve) => {
        resolveSend = resolve
      }),
    )
    renderPage()

    await pickTomorrow('Sækjandi Sækjandason')
    await userEvent.click(
      card('Sækjandi Sækjandason').getByRole('button', { name: 'Senda frest' }),
    )

    const confirm = screen.getByTestId('confirmStatementDeadlineButton')
    await userEvent.click(confirm)
    await userEvent.click(confirm)

    expect(mockSetAppealStatementDeadline).toHaveBeenCalledTimes(1)

    resolveSend({ id: 'sd2', deadline: '2026-12-01T00:00:00.000Z' })

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
  })

  it('keeps the dialog open when the request fails', async () => {
    mockSetAppealStatementDeadline.mockResolvedValue(undefined)
    renderPage()

    await pickTomorrow('Sækjandi Sækjandason')
    await userEvent.click(
      card('Sækjandi Sækjandason').getByRole('button', { name: 'Senda frest' }),
    )
    await userEvent.click(screen.getByTestId('confirmStatementDeadlineButton'))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(mockSetWorkingCase).not.toHaveBeenCalled()
  })

  it('leads back to the defender step and on to the status, with the appeal id', async () => {
    renderPage()

    await userEvent.click(screen.getByTestId('previousButton'))

    expect(mockPush).toHaveBeenCalledWith(
      `${COURT_OF_APPEAL_VERDICT_APPEAL_DEFENDER_ROUTE}/case-id?appealCaseId=verdict-appeal`,
    )

    await userEvent.click(screen.getByTestId('continueButton'))

    expect(mockPush).toHaveBeenCalledWith(
      `${COURT_OF_APPEAL_VERDICT_APPEAL_STATUS_ROUTE}/case-id?appealCaseId=verdict-appeal`,
    )
  })
})
