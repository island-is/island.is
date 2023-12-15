import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { render, screen } from '@testing-library/react'

import { CaseState, UserRole } from '@island.is/judicial-system/types'
import {
  UserContext,
  UserProvider,
} from '@island.is/judicial-system-web/src/components'
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
  it('should render checkbox for prosecutors to request the court of appeal ruling be not published', () => {
    render(
      <IntlProviderWrapper>
        <ApolloProvider
          client={new ApolloClient({ cache: new InMemoryCache() })}
        >
          <UserContext.Provider
            value={{
              user: {
                // TODO: Create a mockUser, like moclCase
                // TODO: Move into testHelpers
                active: true,
                created: '',
                email: '',
                id: '',
                mobileNumber: '',
                modified: '',
                name: '',
                nationalId: '',
                title: '',
                role: UserRole.PROSECUTOR,
              },
            }}
          >
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
          </UserContext.Provider>
        </ApolloProvider>
      </IntlProviderWrapper>,
    )

    expect(
      screen.getByText(
        'Þess er óskað að birtingu úrskurðar á vef Landsréttar verði frestað',
      ),
    ).toBeInTheDocument()
  })
})
