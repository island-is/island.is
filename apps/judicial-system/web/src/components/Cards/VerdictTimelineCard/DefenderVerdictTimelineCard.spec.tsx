import { render, screen } from '@testing-library/react'

import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  ServiceRequirement,
  VerdictAppealDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'

import DefenderVerdictTimelineCard from './DefenderVerdictTimelineCard'

/**
 * Which bullets a verdict comes to is covered directly in
 * DefenderVerdictTimelineCard.logic.spec.ts. What is left for the rendered card
 * is that they reach the page, that the tone survives, and that nothing the
 * public prosecution office keeps to itself appears.
 */
describe('DefenderVerdictTimelineCard', () => {
  const name = 'Jón Sigurður Jónsson'

  const renderComponent = (defendant: Defendant) =>
    render(
      <IntlProviderWrapper>
        <DefenderVerdictTimelineCard defendant={defendant} />
      </IntlProviderWrapper>,
    )

  const servedDefendant = {
    id: 'defendant_id',
    name,
    verdict: {
      serviceRequirement: ServiceRequirement.REQUIRED,
      serviceDate: '2026-06-01T13:31:00.000Z',
      appealDecision: VerdictAppealDecision.POSTPONE,
    },
  } as Defendant

  it('renders nothing when the defendant has no verdict', () => {
    const { container } = renderComponent({
      id: 'defendant_id',
      name,
    } as Defendant)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders the heading, the defendant and the bullets', async () => {
    renderComponent(servedDefendant)

    expect(await screen.findByText('Birting dóms')).toBeInTheDocument()
    expect(screen.getByText(name)).toBeInTheDocument()
    expect(screen.getByText('• Dómur birtur 01.06.2026')).toBeInTheDocument()
    expect(
      screen.getByText('• Dómfelldi tekur áfrýjunarfrest'),
    ).toBeInTheDocument()
  })

  it('renders the appeal in a tone of its own', async () => {
    renderComponent({
      ...servedDefendant,
      verdict: {
        ...servedDefendant.verdict,
        appealDate: '2026-06-04T13:34:00.000Z',
      },
    } as Defendant)

    const appealItem = await screen.findByText(
      '• Dómfelldi áfrýjaði 04.06.2026',
    )

    // The appeal stands out from the rest of the timeline, see the design
    expect(appealItem.className).toMatch(/red600/)
  })

  // The appeal deadline is already on InfoCardClosedIndictment for defence
  // users, and enforcement is internal to the prosecution.
  it('leaves out the lines that belong to the public prosecution office', async () => {
    renderComponent({
      ...servedDefendant,
      verdictAppealDeadline: '2026-06-29T23:59:59.999Z',
      isSentToPrisonAdmin: true,
      sentToPrisonAdminDate: '2026-06-10T13:31:00.000Z',
      isClosedWithoutEnforcement: true,
      closedWithoutEnforcementDate: '2026-06-11T13:31:00.000Z',
      publicProsecutorIsRegisteredInPoliceSystem: true,
    } as Defendant)

    expect(await screen.findByText('Birting dóms')).toBeInTheDocument()
    expect(screen.queryByText(/Áfrýjunarfrestur/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Sent til fullnustu/)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/Máli lokið án fullnustu/),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('Afstaða dómfellda til dóms'),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: `Valmynd fyrir ${name}` }),
    ).not.toBeInTheDocument()
  })
})
