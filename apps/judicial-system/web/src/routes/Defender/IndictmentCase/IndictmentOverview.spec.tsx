import { MockedProvider } from '@apollo/client/testing'
import { render, screen, within } from '@testing-library/react'

import { Feature } from '@island.is/judicial-system/types'
import { FeatureContext } from '@island.is/judicial-system-web/src/components'
import type { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  ServiceRequirement,
  UserRole,
  VerdictAppealDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import IndictmentOverview from './IndictmentOverview'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      push: jest.fn(),
    }
  },
}))

window.scrollTo = jest.fn()

const defenderNationalId = '1111111111'

interface CompletedCaseOptions {
  // Both defenders confirmed, as they are once a case has been tried.
  defendersConfirmed?: boolean
  ownClientAppealDate?: string
  verdictAppealCase?: Case['verdictAppealCase']
  // The public prosecution office has not yet decided whether the first
  // defendant's verdict must be served.
  ownClientServiceUndecided?: boolean
}

const completedCase = (
  indictmentRulingDecision: CaseIndictmentRulingDecision,
  {
    defendersConfirmed = false,
    ownClientAppealDate,
    verdictAppealCase,
    ownClientServiceUndecided = false,
  }: CompletedCaseOptions = {},
): Case => ({
  ...mockCase(CaseType.INDICTMENT),
  state: CaseState.COMPLETED,
  indictmentRulingDecision,
  verdictAppealCase,
  defendants: [
    {
      id: 'own_client_id',
      created: '2020-09-16T19:50:08.033Z',
      modified: '2020-09-16T19:51:39.466Z',
      caseId: 'test_id',
      name: 'Eigin sakborningur',
      defenderNationalId,
      isDefenderChoiceConfirmed: defendersConfirmed,
      verdict: ownClientServiceUndecided
        ? { id: 'own_client_verdict_id' }
        : {
            id: 'own_client_verdict_id',
            serviceRequirement: ServiceRequirement.REQUIRED,
            serviceDate: '2026-06-01T13:31:00.000Z',
            appealDecision: VerdictAppealDecision.POSTPONE,
            appealDate: ownClientAppealDate,
          },
    },
    {
      id: 'other_client_id',
      created: '2020-09-16T19:50:08.033Z',
      modified: '2020-09-16T19:51:39.466Z',
      caseId: 'test_id',
      name: 'Annar sakborningur',
      defenderNationalId: '2222222222',
      isDefenderChoiceConfirmed: defendersConfirmed,
      verdict: {
        id: 'other_client_verdict_id',
        serviceRequirement: ServiceRequirement.REQUIRED,
        serviceDate: '2026-06-02T13:31:00.000Z',
        appealDecision: VerdictAppealDecision.ACCEPT,
      },
    },
  ],
})

const renderOverview = (theCase: Case, features: Feature[] = []) =>
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <FeatureContext.Provider value={{ features, isLoading: false }}>
        <UserContextWrapper
          userRole={UserRole.DEFENDER}
          nationalId={defenderNationalId}
        >
          <IntlProviderWrapper>
            <FormContextWrapper theCase={theCase}>
              <IndictmentOverview />
            </FormContextWrapper>
          </IntlProviderWrapper>
        </UserContextWrapper>
      </FeatureContext.Provider>
    </MockedProvider>,
  )

// The card's menu button, named for the defendant, when the card has actions.
const menuButtonOf = (card: HTMLElement) =>
  within(card).queryByRole('button', { name: /Valmynd fyrir birtingu dóms/ })

describe('Defender IndictmentOverview', () => {
  // The verdict information is read only, so it is shown for every defendant on
  // the case - the same way InfoCardClosedIndictment lists them all - not only
  // for the defendants this defender represents.
  it('renders a verdict timeline card for every defendant on the case', async () => {
    renderOverview(completedCase(CaseIndictmentRulingDecision.RULING))

    const timelineCards = await screen.findAllByTestId(
      'defenderVerdictTimelineCard',
    )

    expect(timelineCards).toHaveLength(2)
    expect(
      within(timelineCards[0]).getByText('Eigin sakborningur'),
    ).toBeInTheDocument()
    expect(
      within(timelineCards[0]).getByText('• Dómur birtur 01.06.2026'),
    ).toBeInTheDocument()
    expect(
      within(timelineCards[1]).getByText('Annar sakborningur'),
    ).toBeInTheDocument()
    expect(
      within(timelineCards[1]).getByText('• Dómfelldi unir'),
    ).toBeInTheDocument()
  })

  // The confirmed defender of the first defendant, with the feature on, can act
  // on that defendant's verdict and only that one.
  it('offers the appeal action only on the cards of defendants this defender represents', async () => {
    renderOverview(
      completedCase(CaseIndictmentRulingDecision.RULING, {
        defendersConfirmed: true,
      }),
      [Feature.INDICTMENT_APPEAL],
    )

    const timelineCards = await screen.findAllByTestId(
      'defenderVerdictTimelineCard',
    )

    expect(menuButtonOf(timelineCards[0])).toBeInTheDocument()
    expect(menuButtonOf(timelineCards[1])).not.toBeInTheDocument()
  })

  it('offers no appeal action while the feature is hidden', async () => {
    renderOverview(
      completedCase(CaseIndictmentRulingDecision.RULING, {
        defendersConfirmed: true,
      }),
    )

    const timelineCards = await screen.findAllByTestId(
      'defenderVerdictTimelineCard',
    )

    expect(menuButtonOf(timelineCards[0])).not.toBeInTheDocument()
  })

  it('offers to withdraw once the verdict has been appealed', async () => {
    renderOverview(
      completedCase(CaseIndictmentRulingDecision.RULING, {
        defendersConfirmed: true,
        ownClientAppealDate: '2026-06-04T13:34:00.000Z',
        verdictAppealCase: { id: 'verdict_appeal_case_id' },
      }),
      [Feature.INDICTMENT_APPEAL],
    )

    const timelineCards = await screen.findAllByTestId(
      'defenderVerdictTimelineCard',
    )

    expect(menuButtonOf(timelineCards[0])).toBeInTheDocument()
    expect(
      within(timelineCards[0]).getByText('• Dómfelldi áfrýjaði 04.06.2026'),
    ).toBeInTheDocument()
  })

  // The card would have nothing to say until the public prosecution office has
  // decided whether the verdict must be served, so it stays away per defendant.
  it('renders no verdict timeline card for a defendant whose verdict service is undecided', async () => {
    renderOverview(
      completedCase(CaseIndictmentRulingDecision.RULING, {
        ownClientServiceUndecided: true,
      }),
    )

    const timelineCards = await screen.findAllByTestId(
      'defenderVerdictTimelineCard',
    )

    expect(timelineCards).toHaveLength(1)
    expect(
      within(timelineCards[0]).getByText('Annar sakborningur'),
    ).toBeInTheDocument()
  })

  it('renders no verdict timeline card when the case did not end in a verdict', async () => {
    renderOverview(completedCase(CaseIndictmentRulingDecision.FINE))

    expect(
      await screen.findByRole('heading', { name: 'Máli lokið' }),
    ).toBeInTheDocument()
    expect(screen.queryAllByTestId('defenderVerdictTimelineCard')).toHaveLength(
      0,
    )
  })

  it('renders no verdict timeline card while the case is still open', async () => {
    renderOverview({
      ...completedCase(CaseIndictmentRulingDecision.RULING),
      state: CaseState.RECEIVED,
    })

    expect(await screen.findByText('Yfirlit ákæru')).toBeInTheDocument()
    expect(screen.queryAllByTestId('defenderVerdictTimelineCard')).toHaveLength(
      0,
    )
  })
})
