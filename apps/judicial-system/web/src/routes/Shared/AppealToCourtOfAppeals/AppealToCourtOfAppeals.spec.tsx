import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { render, screen } from '@testing-library/react'

import { CaseState, UserRole } from '@island.is/judicial-system/types'
import { UserContext } from '@island.is/judicial-system-web/src/components'
import {
  CaseAppealRulingDecision,
  CaseDecision,
  CaseType,
  InstitutionType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  mockCase,
  mockUser,
} from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import AppealToCourtOfAppeals from './AppealToCourtOfAppeals'

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

describe('AppealToCourtOfAppeals', () => {
  it('should render checkbox for prosecutors to request the court of appeal ruling be not published', () => {
    render(
      <IntlProviderWrapper>
        <ApolloProvider
          client={new ApolloClient({ cache: new InMemoryCache() })}
        >
          <UserContextWrapper>
            <FormContextWrapper
              theCase={{
                ...mockCase(CaseType.CUSTODY),
                state: CaseState.ACCEPTED,
                decision: CaseDecision.ACCEPTING,
                appealRulingDecision: CaseAppealRulingDecision.CHANGED,
              }}
            >
              <AppealToCourtOfAppeals />
            </FormContextWrapper>
          </UserContextWrapper>
        </ApolloProvider>
      </IntlProviderWrapper>,
    )

    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })
})
