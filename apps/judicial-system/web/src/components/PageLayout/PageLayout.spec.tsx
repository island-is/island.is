import { render, screen } from '@testing-library/react'

import {
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import PageLayout from './PageLayout'

const renderPageLayout = (props: { isLoading: boolean; notFound: boolean }) => {
  const theCase = mockCase(CaseType.INDICTMENT)

  return render(
    <IntlProviderWrapper>
      <UserContextWrapper userRole={UserRole.DISTRICT_COURT_JUDGE}>
        <FormContextWrapper theCase={theCase}>
          <PageLayout workingCase={theCase} {...props}>
            <div>child content</div>
          </PageLayout>
        </FormContextWrapper>
      </UserContextWrapper>
    </IntlProviderWrapper>,
  )
}

describe('PageLayout', () => {
  // The cancellation modal (and other modals) portal into the #modal target via
  // a sibling of PageLayout. Before, the target only existed in the children
  // branch; this asserts it is also present while loading (a non-children state).
  it('renders the modal portal target while loading', () => {
    renderPageLayout({ isLoading: true, notFound: false })

    expect(screen.getByTestId('modal')).toBeInTheDocument()
  })
})
