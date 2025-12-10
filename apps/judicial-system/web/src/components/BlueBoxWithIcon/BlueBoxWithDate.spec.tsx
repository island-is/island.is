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

window.scrollTo = jest.fn()

describe('BlueBoxWithDate', () => {
  const name = faker.name.firstName()
  const rulingDate = new Date().toISOString()

  const mockDefendant: Defendant = {
    name,
    id: faker.datatype.uuid(),
  }

  it('renders correctly when ruling decision is FINE', async () => {
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

    expect(await screen.findByText('Viðurlagaákvörðun')).toBeInTheDocument()
    expect(await screen.findByText(name)).toBeInTheDocument()
  })

  it('renders correctly when ruling decision is RULING', async () => {
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

    expect(await screen.findByText('Birting dóms')).toBeInTheDocument()
    expect(await screen.findByText(name)).toBeInTheDocument()
  })
})
