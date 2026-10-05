import { render, screen } from '@testing-library/react'

import { Feature } from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { FeatureContext } from '@island.is/judicial-system-web/src/components/FeatureProvider/FeatureProvider'
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

import VerdictAppealOverview from './VerdictAppealOverview'

jest.mock('next/router', () => ({
  useRouter() {
    return { pathname: '', query: { appealCaseId: 'verdict-appeal' } }
  },
}))

const theCase = {
  ...mockCase(CaseType.INDICTMENT),
  state: CaseState.COMPLETED,
  courtCaseNumber: 'S-14/2026',
  verdictAppealCase: {
    id: 'verdict-appeal',
    appealState: AppealCaseState.RECEIVED,
    appealType: AppealCaseType.VERDICT,
  },
} as unknown as WorkingCase

const renderOverview = (features: Feature[]) =>
  render(
    <IntlProviderWrapper>
      <ApolloProviderWrapper>
        <FeatureContext.Provider value={{ features, isLoading: false }}>
          <UserContextWrapper userRole={UserRole.COURT_OF_APPEALS_JUDGE}>
            <FormContextWrapper theCase={theCase}>
              <VerdictAppealOverview />
            </FormContextWrapper>
          </UserContextWrapper>
        </FeatureContext.Provider>
      </ApolloProviderWrapper>
    </IntlProviderWrapper>,
  )

describe('VerdictAppealOverview', () => {
  // This page is not itself hidden - the court arrives from a case list that
  // is - so the button to the next step has to carry the gate. Without it the
  // court would be offered a step that turns it straight back.
  it('offers no way on while the feature is hidden', () => {
    renderOverview([])

    expect(screen.queryByTestId('continueButton')).not.toBeInTheDocument()
  })

  it('offers the defender step once the feature is shown', () => {
    renderOverview([Feature.INDICTMENT_APPEAL])

    expect(screen.getByTestId('continueButton')).toBeInTheDocument()
  })
})
