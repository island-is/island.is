import { fireEvent, render, screen, within } from '@testing-library/react'

import {
  Case,
  CaseAppealDecision,
  CourtSessionResponse,
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
