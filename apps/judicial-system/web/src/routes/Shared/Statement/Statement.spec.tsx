import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { render, screen, waitFor } from '@testing-library/react'

import {
  CaseAppealRulingDecision,
  CaseDecision,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import Statement from './Statement'

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

describe('Statement', () => {
  it('should render checkbox for prosecutors to request the court of appeal ruling be not published', async () => {
    render(
      <IntlProviderWrapper>
        <ApolloProvider
          client={new ApolloClient({ cache: new InMemoryCache() })}
        >
          <UserContextWrapper userRole={UserRole.PROSECUTOR}>
            <FormContextWrapper
              theCase={{
                ...mockCase(CaseType.CUSTODY),
                state: CaseState.ACCEPTED,
                decision: CaseDecision.ACCEPTING,
                appealRulingDecision: CaseAppealRulingDecision.CHANGED,
              }}
            >
              <Statement />
            </FormContextWrapper>
          </UserContextWrapper>
        </ApolloProvider>
      </IntlProviderWrapper>,
    )

    expect(await screen.findByRole('checkbox')).toBeInTheDocument()
  })

  it('should not render a checkbox for defenders to request the court of appeal ruling be not published', async () => {
    render(
      <IntlProviderWrapper>
        <ApolloProvider
          client={new ApolloClient({ cache: new InMemoryCache() })}
        >
          <UserContextWrapper userRole={UserRole.DEFENDER}>
            <FormContextWrapper
              theCase={{
                ...mockCase(CaseType.CUSTODY),
                state: CaseState.ACCEPTED,
                decision: CaseDecision.ACCEPTING,
                appealRulingDecision: CaseAppealRulingDecision.CHANGED,
              }}
            >
              <Statement />
            </FormContextWrapper>
          </UserContextWrapper>
        </ApolloProvider>
      </IntlProviderWrapper>,
    )

    await waitFor(() => {
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    })
  })
})
