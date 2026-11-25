import { render, screen } from '@testing-library/react'

import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
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

import PageLayout from './PageLayout'

// Which appeal the page is about is read out of the query string, so the
// heading changes with it and nothing else.
let mockAppealCaseId: string | undefined

jest.mock('next/router', () => ({
  useRouter() {
    return { pathname: '', query: { appealCaseId: mockAppealCaseId } }
  },
}))

const caseWithBothAppeals = {
  ...mockCase(CaseType.INDICTMENT),
  state: CaseState.COMPLETED,
  appealCase: {
    id: 'ruling-appeal',
    appealState: AppealCaseState.RECEIVED,
    appealType: AppealCaseType.RULING,
  },
  verdictAppealCase: {
    id: 'verdict-appeal',
    appealState: AppealCaseState.RECEIVED,
    appealType: AppealCaseType.VERDICT,
  },
} as unknown as WorkingCase

const renderSidePanel = (userRole: UserRole, theCase = caseWithBothAppeals) =>
  render(
    <IntlProviderWrapper>
      <ApolloProviderWrapper>
        <UserContextWrapper userRole={userRole}>
          <FormContextWrapper theCase={theCase}>
            <PageLayout
              workingCase={theCase}
              isLoading={false}
              notFound={false}
            >
              <div>child content</div>
            </PageLayout>
          </FormContextWrapper>
        </UserContextWrapper>
      </ApolloProviderWrapper>
    </IntlProviderWrapper>,
  )

describe('side panel title', () => {
  beforeEach(() => {
    mockAppealCaseId = undefined
  })

  // The stepper repeats these words as step names further down the panel, so
  // the assertion has to name the heading rather than the text.
  const panelTitle = () => screen.getByRole('heading', { name: /./, level: 3 })

  // An áfrýjun and a kæra are two different proceedings, and this court runs
  // both. Naming the panel after the wrong one tells the judge they are
  // somewhere they are not.
  it('names a verdict appeal an áfrýjun', () => {
    mockAppealCaseId = 'verdict-appeal'

    renderSidePanel(UserRole.COURT_OF_APPEALS_JUDGE)

    expect(panelTitle()).toHaveTextContent('Áfrýjun')
  })

  it('leaves a ruling appeal named as before', () => {
    mockAppealCaseId = 'ruling-appeal'

    renderSidePanel(UserRole.COURT_OF_APPEALS_JUDGE)

    expect(panelTitle()).toHaveTextContent('Kærumál')
  })

  // Every other court reads the same case as an ordinary indictment.
  it('leaves other users alone', () => {
    mockAppealCaseId = 'verdict-appeal'

    renderSidePanel(UserRole.DISTRICT_COURT_JUDGE)

    expect(panelTitle()).toHaveTextContent('Sakamál')
  })
})
