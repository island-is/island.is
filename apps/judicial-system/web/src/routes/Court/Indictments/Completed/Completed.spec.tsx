import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react'

import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseState,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  mockCase,
  mockCaseTableMembershipQuery,
} from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import Completed from './Completed'

jest.mock('next/router', () => {
  const router = { pathname: '', query: {}, push: jest.fn() }

  return { __esModule: true, default: router, useRouter: () => router }
})

window.scrollTo = jest.fn()

describe('Court Indictments Completed', () => {
  describe('the concluding words of the court of appeals', () => {
    const conclusion = 'Hinn áfrýjaði dómur skal vera óraskaður.'

    const completedCase = (appealState: AppealCaseState): WorkingCase => ({
      ...mockCase(CaseType.INDICTMENT),
      state: CaseState.COMPLETED,
      indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
      defendants: [{ id: 'defendant_id', name: 'Gervi Sakborningur' }],
      verdictAppealCase: {
        id: 'verdict_appeal_case_id',
        appealState,
        appealConclusion: conclusion,
      },
    })

    const renderCompleted = (theCase: WorkingCase) =>
      render(
        <MockedProvider
          mocks={[...mockCaseTableMembershipQuery('test_id')]}
          addTypename={false}
        >
          <UserContextWrapper userRole={UserRole.DISTRICT_COURT_JUDGE}>
            <IntlProviderWrapper>
              <FormContextWrapper theCase={theCase}>
                <Completed />
              </FormContextWrapper>
            </IntlProviderWrapper>
          </UserContextWrapper>
        </MockedProvider>,
      )

    it('shows them once the verdict appeal is completed', async () => {
      renderCompleted(completedCase(AppealCaseState.COMPLETED))

      expect(await screen.findByText('Dómsorð Landsréttar')).toBeInTheDocument()
      expect(screen.getByText(conclusion)).toBeInTheDocument()
    })

    it('does not show them before the verdict appeal is completed', async () => {
      renderCompleted(completedCase(AppealCaseState.READY_TO_COMPLETE))

      await screen.findAllByText('Gervi Sakborningur')
      expect(screen.queryByText('Dómsorð Landsréttar')).not.toBeInTheDocument()
      expect(screen.queryByText(conclusion)).not.toBeInTheDocument()
    })
  })
})
