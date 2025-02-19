import faker from 'faker'
import { render, screen } from '@testing-library/react'

import {
  CaseIndictmentRulingDecision,
  CaseType,
  Defendant,
} from '../../graphql/schema'
import { mockCase } from '../../utils/mocks'
import {
  ApolloProviderWrapper,
  FormContextWrapper,
  IntlProviderWrapper,
} from '../../utils/testHelpers'
import BlueBoxWithDate from './BlueBoxWithDate'

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

describe('BlueBoxWithDate', () => {
  const name = faker.name.firstName()
  const rulingDate = new Date().toISOString()

  const mockDefendant: Defendant = {
    name,
    id: faker.datatype.uuid(),
  }

  it('renders correctly when ruling decision is FINE', () => {
    render(
      <IntlProviderWrapper>
        <ApolloProviderWrapper>
          <FormContextWrapper
            theCase={{
              ...mockCase(CaseType.INDICTMENT),
              indictmentRulingDecision: CaseIndictmentRulingDecision.FINE,
              defendants: [mockDefendant],
              rulingDate,
            }}
          >
            <BlueBoxWithDate defendant={mockDefendant} />
          </FormContextWrapper>
        </ApolloProviderWrapper>
      </IntlProviderWrapper>,
    )

    expect(screen.getByText('Viðurlagaákvörðun')).toBeInTheDocument()
    expect(screen.getByText(name)).toBeInTheDocument()
  })

  it('renders correctly when ruling decision is RULING', () => {
    render(
      <IntlProviderWrapper>
        <ApolloProviderWrapper>
          <FormContextWrapper
            theCase={{
              ...mockCase(CaseType.INDICTMENT),
              indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
              defendants: [mockDefendant],
              rulingDate,
            }}
          >
            <BlueBoxWithDate defendant={mockDefendant} />
          </FormContextWrapper>
        </ApolloProviderWrapper>
      </IntlProviderWrapper>,
    )

    expect(screen.getByText('Birting dóms')).toBeInTheDocument()
    expect(screen.getByText(name)).toBeInTheDocument()
  })
})
