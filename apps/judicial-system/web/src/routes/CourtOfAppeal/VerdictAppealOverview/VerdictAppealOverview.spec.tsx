import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { COURT_OF_APPEAL_VERDICT_APPEAL_REGISTRATION_ROUTE } from '@island.is/judicial-system/consts'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseState,
  AppealCaseType,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  UserRole,
  VerdictAppealStatus,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  ApolloProviderWrapper,
  FormContextWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import VerdictAppealOverview from './VerdictAppealOverview'

const mockPush = jest.fn()

// A legacy link opens this page with no appeal named. That is the case the
// shared resolver answers with the case-level ruling appeal.
let mockAppealCaseId: string | undefined

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      query: { appealCaseId: mockAppealCaseId },
      push: mockPush,
    }
  },
}))

// A case can carry both proceedings at once, which is what makes picking the
// wrong one possible.
const theCase = {
  ...mockCase(CaseType.INDICTMENT),
  state: CaseState.COMPLETED,
  courtCaseNumber: 'S-14/2026',
  appealCase: {
    id: 'ruling-appeal',
    appealState: AppealCaseState.RECEIVED,
    appealType: AppealCaseType.RULING,
    appealCaseNumber: '100/2026',
  },
  verdictAppealCase: {
    id: 'verdict-appeal',
    appealState: AppealCaseState.RECEIVED,
    appealType: AppealCaseType.VERDICT,
    appealCaseNumber: '555/2026',
  },
} as unknown as WorkingCase

// Both courts have written their concluding words.
const concludedCase = (appeal: Record<string, unknown>) =>
  ({
    ...theCase,
    indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
    courtSessions: [
      { id: 'session', ruling: 'Ákærði skal sæta fangelsi í 30 daga.' },
    ],
    verdictAppealCase: {
      ...theCase.verdictAppealCase,
      appealState: AppealCaseState.APPEALED,
      appealConclusion: 'Hinn áfrýjaði dómur skal vera óraskaður.',
      ...appeal,
    },
  } as unknown as WorkingCase)

const renderOverview = (c: WorkingCase = theCase) =>
  render(
    <IntlProviderWrapper>
      <ApolloProviderWrapper>
        <UserContextWrapper userRole={UserRole.COURT_OF_APPEALS_JUDGE}>
          <FormContextWrapper theCase={c}>
            <VerdictAppealOverview />
          </FormContextWrapper>
        </UserContextWrapper>
      </ApolloProviderWrapper>
    </IntlProviderWrapper>,
  )

describe('VerdictAppealOverview', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockAppealCaseId = undefined
  })

  it('leads with the number of the verdict appeal, not the ruling appeal', () => {
    renderOverview()

    expect(
      screen.getByRole('heading', { level: 2, name: 'Mál nr. 555/2026' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Mál nr. 100/2026' }),
    ).not.toBeInTheDocument()
  })

  it('carries the verdict appeal on to the next step', async () => {
    mockAppealCaseId = 'verdict-appeal'
    renderOverview()

    await userEvent.click(screen.getByTestId('continueButton'))

    expect(mockPush).toHaveBeenCalledWith(
      `${COURT_OF_APPEAL_VERDICT_APPEAL_REGISTRATION_ROUTE}/${theCase.id}?appealCaseId=verdict-appeal`,
    )
  })

  // The page is only ever about the verdict appeal, so a link that names no
  // appeal must not hand the next step the ruling appeal it happens to carry.
  it('carries it even when the url names no appeal', async () => {
    renderOverview()

    await userEvent.click(screen.getByTestId('continueButton'))

    expect(mockPush).toHaveBeenCalledWith(
      `${COURT_OF_APPEAL_VERDICT_APPEAL_REGISTRATION_ROUTE}/${theCase.id}?appealCaseId=verdict-appeal`,
    )
  })

  // Words recorded under "Lokið" stay on record when the status is moved
  // away from it, and are not shown for an appeal that has not ended.
  it('hides the Court of Appeals conclusion while the appeal is not marked finished', () => {
    renderOverview(
      concludedCase({
        verdictAppealStatus: VerdictAppealStatus.UNDER_ADVISEMENT,
      }),
    )

    expect(screen.getByText('Dómsorð héraðsdóms')).toBeInTheDocument()
    expect(
      screen.getByText('Ákærði skal sæta fangelsi í 30 daga.'),
    ).toBeInTheDocument()
    expect(screen.queryByText('Dómsorð Landsréttar')).not.toBeInTheDocument()
    expect(
      screen.queryByText('Hinn áfrýjaði dómur skal vera óraskaður.'),
    ).not.toBeInTheDocument()
  })

  it('shows the Court of Appeals conclusion once the appeal is marked finished', () => {
    renderOverview(
      concludedCase({ verdictAppealStatus: VerdictAppealStatus.COMPLETED }),
    )

    expect(screen.getByText('Dómsorð héraðsdóms')).toBeInTheDocument()
    expect(screen.getByText('Dómsorð Landsréttar')).toBeInTheDocument()
    expect(
      screen.getByText('Hinn áfrýjaði dómur skal vera óraskaður.'),
    ).toBeInTheDocument()
  })

  it('shows the verdict appeal on the info card when the url names no appeal', () => {
    renderOverview()

    const appealNumberItem = screen.getByRole('heading', {
      name: 'Málsnúmer Landsréttar',
    }).parentElement

    if (!appealNumberItem) {
      throw new Error('The appeal number has no item on the info card')
    }

    expect(within(appealNumberItem).getByText('555/2026')).toBeInTheDocument()
    expect(screen.queryByText('100/2026')).not.toBeInTheDocument()
  })
})
