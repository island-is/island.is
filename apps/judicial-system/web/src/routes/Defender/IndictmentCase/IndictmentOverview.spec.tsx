import { MockedProvider } from '@apollo/client/testing'
import { render, screen, within } from '@testing-library/react'

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

const completedCase = (
  indictmentRulingDecision: CaseIndictmentRulingDecision,
): Case => ({
  ...mockCase(CaseType.INDICTMENT),
  state: CaseState.COMPLETED,
  indictmentRulingDecision,
  defendants: [
    {
      id: 'own_client_id',
      created: '2020-09-16T19:50:08.033Z',
      modified: '2020-09-16T19:51:39.466Z',
      caseId: 'test_id',
      name: 'Eigin sakborningur',
      defenderNationalId,
      verdict: {
        id: 'own_client_verdict_id',
        serviceRequirement: ServiceRequirement.REQUIRED,
        serviceDate: '2026-06-01T13:31:00.000Z',
        appealDecision: VerdictAppealDecision.POSTPONE,
      },
    },
    {
      id: 'other_client_id',
      created: '2020-09-16T19:50:08.033Z',
      modified: '2020-09-16T19:51:39.466Z',
      caseId: 'test_id',
      name: 'Annar sakborningur',
      defenderNationalId: '2222222222',
      verdict: {
        id: 'other_client_verdict_id',
        serviceRequirement: ServiceRequirement.REQUIRED,
        serviceDate: '2026-06-02T13:31:00.000Z',
        appealDecision: VerdictAppealDecision.ACCEPT,
      },
    },
  ],
})

const renderOverview = (theCase: Case) =>
  render(
    <MockedProvider mocks={[]} addTypename={false}>
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
    </MockedProvider>,
  )

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
