import { IntlProvider } from 'react-intl'
import faker from 'faker'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { render, screen } from '@testing-library/react'

import {
  Case,
  CaseOrigin,
  CaseState,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { PoliceCaseNumbers } from './PoliceCaseNumbers'

describe('PoliceCaseNumbers component', () => {
  it('should not have an option to remove the first police case number if the case was created in LOKE', async () => {
    // Arrange
    const workingCase: Case = {
      created: faker.date.past().toISOString(),
      modified: faker.date.past().toISOString(),
      id: faker.datatype.uuid(),
      type: CaseType.CUSTODY,
      origin: CaseOrigin.LOKE,
      state: CaseState.DRAFT,
      policeCaseNumbers: ['007-0000-0000', '008-0000-0000'],
    }

    // Act
    render(
      <ApolloProvider client={new ApolloClient({ cache: new InMemoryCache() })}>
        <IntlProvider locale="is" onError={jest.fn}>
          <PoliceCaseNumbers
            workingCase={workingCase}
            setWorkingCase={jest.fn}
            clientPoliceNumbers={workingCase.policeCaseNumbers}
            setClientPoliceNumbers={jest.fn}
          />
        </IntlProvider>
      </ApolloProvider>,
    )

    // Assert
    expect(await screen.findAllByTestId('icon-close')).toHaveLength(1)
    expect(
      await screen.findByLabelText('Eyða númeri 007-0000-0000'),
    ).toBeDisabled()
  })
})
