import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { render, screen } from '@testing-library/react'

import { CaseState } from '@island.is/judicial-system/types'
import {
  CaseAppealRulingDecision,
  CaseDecision,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import Ruling from './Ruling'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      query: {
        id: 'test_id',
      },
    }
  },
}))

describe('COA - Ruling', () => {
  it('should render fields to change validToDate and isolation if the case appeal ruling decision is CHANGED', () => {
    render(
      <IntlProviderWrapper>
        <ApolloProvider
          client={new ApolloClient({ cache: new InMemoryCache() })}
        >
          <FormContextWrapper
            theCase={{
              ...mockCase(CaseType.CUSTODY),
              state: CaseState.ACCEPTED,
              decision: CaseDecision.ACCEPTING,
              appealRulingDecision: CaseAppealRulingDecision.CHANGED,
            }}
          >
            <Ruling />
          </FormContextWrapper>
        </ApolloProvider>
      </IntlProviderWrapper>,
    )

    expect(screen.getByTestId('caseDecisionSection')).toBeInTheDocument()
  })

  it('should not render fields to change validToDate and isolation if the case appeal ruling decision is not CHANGED', () => {
    render(
      <IntlProviderWrapper>
        <ApolloProvider
          client={new ApolloClient({ cache: new InMemoryCache() })}
        >
          <FormContextWrapper
            theCase={{
              ...mockCase(CaseType.CUSTODY),
              state: CaseState.ACCEPTED,
              decision: CaseDecision.ACCEPTING,
              appealRulingDecision:
                CaseAppealRulingDecision.DISMISSED_FROM_COURT,
            }}
          >
            <Ruling />
          </FormContextWrapper>
        </ApolloProvider>
      </IntlProviderWrapper>,
    )

    expect(screen.queryByTestId('caseDecisionSection')).not.toBeInTheDocument()
  })
})
