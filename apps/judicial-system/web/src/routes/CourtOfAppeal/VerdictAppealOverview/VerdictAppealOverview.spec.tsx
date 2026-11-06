import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { COURT_OF_APPEAL_VERDICT_APPEAL_DEFENDER_ROUTE } from '@island.is/judicial-system/consts'
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

import VerdictAppealOverview from './VerdictAppealOverview'

const mockPush = jest.fn()

// A legacy link opens this page with no appeal named. That is the case the
// shared resolver answers with the case-level ruling appeal.
let mockAppealCaseId: string | undefined

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      query: { appealCaseId: mockAppealCaseId },
      push: mockPush,
    }
  },
}))

// A case can carry both proceedings at once, which is what makes picking the
// wrong one possible.
const theCase = {
  ...mockCase(CaseType.INDICTMENT),
  state: CaseState.COMPLETED,
  courtCaseNumber: 'S-14/2026',
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

const renderOverview = () =>
  render(
    <IntlProviderWrapper>
      <ApolloProviderWrapper>
        <UserContextWrapper userRole={UserRole.COURT_OF_APPEALS_JUDGE}>
          <FormContextWrapper theCase={theCase}>
            <VerdictAppealOverview />
          </FormContextWrapper>
        </UserContextWrapper>
      </ApolloProviderWrapper>
    </IntlProviderWrapper>,
  )

describe('VerdictAppealOverview', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockAppealCaseId = undefined
  })

  it('carries the verdict appeal on to the next step', async () => {
    mockAppealCaseId = 'verdict-appeal'
    renderOverview()

    await userEvent.click(screen.getByTestId('continueButton'))

    expect(mockPush).toHaveBeenCalledWith(
      `${COURT_OF_APPEAL_VERDICT_APPEAL_DEFENDER_ROUTE}/${theCase.id}?appealCaseId=verdict-appeal`,
    )
  })

  // The page is only ever about the verdict appeal, so a link that names no
  // appeal must not hand the next step the ruling appeal it happens to carry.
  it('carries it even when the url names no appeal', async () => {
    renderOverview()

    await userEvent.click(screen.getByTestId('continueButton'))

    expect(mockPush).toHaveBeenCalledWith(
      `${COURT_OF_APPEAL_VERDICT_APPEAL_DEFENDER_ROUTE}/${theCase.id}?appealCaseId=verdict-appeal`,
    )
  })
})
