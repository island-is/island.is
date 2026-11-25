import { render, screen } from '@testing-library/react'

import type {
  Defendant,
  Verdict,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseType,
  VerdictAppealDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  ApolloProviderWrapper,
  FormContextWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import VerdictAppealDecisionChoice from './VerdictAppealDecisionChoice'

describe('VerdictAppealDecisionChoice', () => {
  const defendant: Defendant = { id: 'defendant_id', name: 'Jón Jónsson' }
  const verdict: Verdict = {
    id: 'verdict_id',
    appealDecision: VerdictAppealDecision.ACCEPT,
  }

  const renderChoice = () =>
    render(
      <IntlProviderWrapper>
        <ApolloProviderWrapper>
          <FormContextWrapper theCase={mockCase(CaseType.INDICTMENT)}>
            <VerdictAppealDecisionChoice
              defendant={defendant}
              verdict={verdict}
            />
          </FormContextWrapper>
        </ApolloProviderWrapper>
      </IntlProviderWrapper>,
    )

  // The design draws accepting the verdict first, taking the appeal period second.
  it('offers accepting the verdict before taking the appeal period', () => {
    renderChoice()

    const options = screen.getAllByRole('radio')

    expect(options.map((option) => option.id)).toEqual([
      'defendant-defendant_id-verdict-appeal-decision-accept',
      'defendant-defendant_id-verdict-appeal-decision-postpone',
    ])
    expect(screen.getByLabelText('Dómfelldi unir')).toBeChecked()
    expect(
      screen.getByLabelText('Dómfelldi tekur áfrýjunarfrest'),
    ).not.toBeChecked()
  })
})
