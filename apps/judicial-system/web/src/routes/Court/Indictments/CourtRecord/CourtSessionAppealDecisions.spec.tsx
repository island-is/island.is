import { fireEvent, render, screen, within } from '@testing-library/react'

import type {
  Case,
  CourtSessionResponse,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseState,
  AppealDecisionPartyRole,
  CaseAppealDecision,
  CourtSessionRulingType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'

import CourtSessionAppealDecisions from './CourtSessionAppealDecisions'

const mockUpdateCourtSessionAppealDecision = jest.fn()

// Mock the leaf hook (re-exported by the utils/hooks barrel) - requireActual on
// the barrel pulls in a circular dependency.
jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useCourtSessions',
  () => ({
    __esModule: true,
    default: () => ({
      updateCourtSessionAppealDecision: mockUpdateCourtSessionAppealDecision,
    }),
  }),
)

// The same case parties appear in every ORDER court session, so the appeal
// decision radios must be scoped to the session - otherwise their `name`/`id`
// collide across sessions and a label's `htmlFor` resolves to an earlier
// session's input, so clicking a later session's radio sends no request.
describe('CourtSessionAppealDecisions - radio group identity across sessions', () => {
  const defendantId = 'defendant-1'

  const workingCase = {
    id: 'case-1',
    defendants: [{ id: defendantId, name: 'Jón Jónsson' }],
    civilClaimants: [],
    appealDecisions: [],
  } as unknown as Case

  const session = (id: string, rulingFileId: string): CourtSessionResponse =>
    ({
      id,
      rulingFileId,
      isConfirmed: false,
      rulingType: CourtSessionRulingType.ORDER,
    } as unknown as CourtSessionResponse)

  const renderTwoSessions = () =>
    render(
      <IntlProviderWrapper>
        <div data-testid="session-a">
          <CourtSessionAppealDecisions
            courtSession={session('session-a', 'file-a')}
            workingCase={workingCase}
            setWorkingCase={jest.fn()}
          />
        </div>
        <div data-testid="session-b">
          <CourtSessionAppealDecisions
            courtSession={session('session-b', 'file-b')}
            workingCase={workingCase}
            setWorkingCase={jest.fn()}
          />
        </div>
      </IntlProviderWrapper>,
    )

  afterEach(() => jest.clearAllMocks())

  it('gives every radio a unique id across sessions', () => {
    renderTwoSessions()

    const ids = screen.getAllByRole('radio').map((radio) => radio.id)

    expect(ids.length).toBeGreaterThan(0)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('fires the mutation for the session whose radio is clicked', () => {
    renderTwoSessions()

    const sessionB = within(screen.getByTestId('session-b'))
    fireEvent.click(sessionB.getByLabelText('Ákærði kærir úrskurðinn'))

    expect(mockUpdateCourtSessionAppealDecision).toHaveBeenCalledTimes(1)
    expect(mockUpdateCourtSessionAppealDecision).toHaveBeenCalledWith(
      expect.objectContaining({
        courtSessionId: 'session-b',
        defendantId,
        decision: CaseAppealDecision.APPEAL,
      }),
    )
  })
})

// The announcement (yfirlýsing) is part of the court record, so switching a
// decision must only manage the auto-filled default - never discard text the
// judge typed.
describe('CourtSessionAppealDecisions - announcement preservation', () => {
  const defendantId = 'defendant-1'
  const rulingFileId = 'file-a'
  const appealDefault = 'Ákærði kærir úrskurðinn til Landsréttar.'

  const renderWithDecision = (
    decision?: CaseAppealDecision,
    announcement?: string,
  ) => {
    const workingCase = {
      id: 'case-1',
      defendants: [{ id: defendantId, name: 'Jón Jónsson' }],
      civilClaimants: [],
      appealDecisions: decision
        ? [
            {
              rulingFileId,
              partyRole: AppealDecisionPartyRole.DEFENDANT,
              defendantId,
              decision,
              announcement,
            },
          ]
        : [],
    } as unknown as Case

    return render(
      <IntlProviderWrapper>
        <CourtSessionAppealDecisions
          courtSession={
            {
              id: 'session-a',
              rulingFileId,
              isConfirmed: false,
              rulingType: CourtSessionRulingType.ORDER,
            } as unknown as CourtSessionResponse
          }
          workingCase={workingCase}
          setWorkingCase={jest.fn()}
        />
      </IntlProviderWrapper>,
    )
  }

  afterEach(() => jest.clearAllMocks())

  it('auto-fills the default statement when appealing into an empty field', () => {
    renderWithDecision()

    fireEvent.click(screen.getByLabelText('Ákærði kærir úrskurðinn'))

    expect(mockUpdateCourtSessionAppealDecision).toHaveBeenCalledWith(
      expect.objectContaining({
        decision: CaseAppealDecision.APPEAL,
        announcement: appealDefault,
      }),
    )
  })

  it('clears the auto-filled default when moving off APPEAL', () => {
    renderWithDecision(CaseAppealDecision.APPEAL, appealDefault)

    fireEvent.click(screen.getByLabelText('Ákærði unir úrskurðinum'))

    expect(mockUpdateCourtSessionAppealDecision).toHaveBeenCalledWith(
      expect.objectContaining({
        decision: CaseAppealDecision.ACCEPT,
        announcement: '',
      }),
    )
  })

  it('preserves custom announcement text when moving off APPEAL', () => {
    renderWithDecision(CaseAppealDecision.APPEAL, 'Sérstök yfirlýsing')

    fireEvent.click(screen.getByLabelText('Ákærði unir úrskurðinum'))

    expect(mockUpdateCourtSessionAppealDecision).toHaveBeenCalledWith(
      expect.objectContaining({
        decision: CaseAppealDecision.ACCEPT,
        announcement: 'Sérstök yfirlýsing',
      }),
    )
  })

  it('preserves custom announcement text when switching to APPEAL', () => {
    renderWithDecision(CaseAppealDecision.POSTPONE, 'Sérstök yfirlýsing')

    fireEvent.click(screen.getByLabelText('Ákærði kærir úrskurðinn'))

    expect(mockUpdateCourtSessionAppealDecision).toHaveBeenCalledWith(
      expect.objectContaining({
        decision: CaseAppealDecision.APPEAL,
        announcement: 'Sérstök yfirlýsing',
      }),
    )
  })
})

// Correcting the court record re-opens the session, so `isConfirmed` stops
// protecting the decisions at exactly the moment they are most exposed. Once the
// appeal they produced has left the court record's reach the section stays
// locked through the correction, mirroring the backend guard in
// courtSession.service.upsertAppealDecision.
describe('CourtSessionAppealDecisions - locked by the appeal state', () => {
  const rulingFileId = 'file-a'
  const defendantId = 'defendant-1'

  const openSession = {
    id: 'session-a',
    rulingFileId,
    isConfirmed: false,
    rulingType: CourtSessionRulingType.ORDER,
  } as unknown as CourtSessionResponse

  const caseWith = (appealCase?: Record<string, unknown>) =>
    ({
      id: 'case-1',
      defendants: [{ id: defendantId, name: 'Jón Jónsson' }],
      civilClaimants: [],
      appealDecisions: [],
      rulingOrderAppealCases: appealCase ? [appealCase] : [],
    } as unknown as Case)

  const renderWith = (workingCase: Case) =>
    render(
      <IntlProviderWrapper>
        <CourtSessionAppealDecisions
          courtSession={openSession}
          workingCase={workingCase}
          setWorkingCase={jest.fn()}
        />
      </IntlProviderWrapper>,
    )

  afterEach(() => jest.clearAllMocks())

  it('leaves the section editable for an in-court appeal at the district court', () => {
    renderWith(
      caseWith({
        id: 'appeal-1',
        rulingFileId,
        appealState: AppealCaseState.APPEALED,
        appealedOutOfCourt: false,
      }),
    )

    expect(
      screen
        .getAllByRole('radio')
        .every((radio) => !radio.hasAttribute('disabled')),
    ).toBe(true)
  })

  it('disables every input and says why when the ruling was appealed out of court', () => {
    renderWith(
      caseWith({
        id: 'appeal-1',
        rulingFileId,
        appealState: AppealCaseState.APPEALED,
        appealedOutOfCourt: true,
      }),
    )

    expect(
      screen
        .getAllByRole('radio')
        .every((radio) => radio.hasAttribute('disabled')),
    ).toBe(true)
    expect(screen.getByText(/kærður utan þinghalds/)).toBeInTheDocument()
  })

  it('disables every input and says why when the appeal has reached Landsréttur', () => {
    renderWith(
      caseWith({
        id: 'appeal-1',
        rulingFileId,
        appealState: AppealCaseState.RECEIVED,
        appealedOutOfCourt: false,
      }),
    )

    expect(
      screen
        .getAllByRole('radio')
        .every((radio) => radio.hasAttribute('disabled')),
    ).toBe(true)
    expect(screen.getByText(/komin til Landsréttar/)).toBeInTheDocument()
  })

  it('locks the ruling for every party, not just the appellant', () => {
    renderWith(
      caseWith({
        id: 'appeal-1',
        rulingFileId,
        appealState: AppealCaseState.APPEALED,
        appealedOutOfCourt: true,
      }),
    )

    expect(
      screen
        .getAllByRole('textbox')
        .every((input) => input.hasAttribute('disabled')),
    ).toBe(true)
  })

  it('leaves the section editable when the ruling has no appeal', () => {
    renderWith(caseWith())

    expect(
      screen
        .getAllByRole('radio')
        .every((radio) => !radio.hasAttribute('disabled')),
    ).toBe(true)
  })
})
