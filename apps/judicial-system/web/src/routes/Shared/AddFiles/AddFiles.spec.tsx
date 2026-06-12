import { render, screen, waitFor } from '@testing-library/react'

import {
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

import AddFiles from './AddFiles'

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

const renderWithRole = (userRole: UserRole) =>
  render(
    <IntlProviderWrapper>
      <ApolloProviderWrapper>
        <UserContextWrapper userRole={userRole}>
          <FormContextWrapper theCase={mockCase(CaseType.INDICTMENT)}>
            <AddFiles />
          </FormContextWrapper>
        </UserContextWrapper>
      </ApolloProviderWrapper>
    </IntlProviderWrapper>,
  )

describe('AddFiles', () => {
  it('should show the Réttarvörslugáttarglugginn note for prosecution users', async () => {
    renderWithRole(UserRole.PROSECUTOR)

    expect(
      await screen.findByText(/Réttarvörslugáttargluggann í LÖKE/),
    ).toBeInTheDocument()
  })

  it('should not show the Réttarvörslugáttarglugginn note for defence users', async () => {
    renderWithRole(UserRole.DEFENDER)

    // The base instruction always renders, confirming the page mounted...
    expect(
      await screen.findByText(/Gögnin verða að hafa lýsandi skráarheiti\./),
    ).toBeInTheDocument()
    // ...but the prosecution-only note must not be present.
    await waitFor(() => {
      expect(
        screen.queryByText(/Réttarvörslugáttargluggann í LÖKE/),
      ).not.toBeInTheDocument()
    })
  })
})
