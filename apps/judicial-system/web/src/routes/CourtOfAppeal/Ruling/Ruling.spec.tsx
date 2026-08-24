import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { render, screen, waitFor } from '@testing-library/react'

import type {
  Case,
  CaseFile,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseRulingDecision,
  AppealCaseState,
  CaseDecision,
  CaseFileCategory,
  CaseState,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  mockCase,
  mockCaseFile,
} from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import Ruling from './Ruling'

let mockRouterQuery: Record<string, string> = { id: 'test_id' }

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      query: mockRouterQuery,
    }
  },
}))

describe('COA - Ruling', () => {
  beforeEach(() => {
    mockRouterQuery = { id: 'test_id' }
  })

  it('should render fields to change validToDate and isolation if the case appeal ruling decision is CHANGED', async () => {
    render(
      <IntlProviderWrapper>
        <ApolloProvider
          client={new ApolloClient({ cache: new InMemoryCache() })}
        >
          <FormContextWrapper
            theCase={{
              ...mockCase(CaseType.CUSTODY),
              state: CaseState.ACCEPTED,
              decision: CaseDecision.ACCEPTING,
              appealCase: {
                id: 'test_appeal_case_id',
                appealState: AppealCaseState.RECEIVED,
                appealRulingDecision: AppealCaseRulingDecision.CHANGED,
              },
            }}
          >
            <Ruling />
          </FormContextWrapper>
        </ApolloProvider>
      </IntlProviderWrapper>,
    )

    expect(await screen.findByTestId('caseDecisionSection')).toBeInTheDocument()
  })

  it('should not render fields to change validToDate and isolation if the case appeal ruling decision is not CHANGED', async () => {
    render(
      <IntlProviderWrapper>
        <ApolloProvider
          client={new ApolloClient({ cache: new InMemoryCache() })}
        >
          <FormContextWrapper
            theCase={{
              ...mockCase(CaseType.CUSTODY),
              state: CaseState.ACCEPTED,
              decision: CaseDecision.ACCEPTING,
              appealCase: {
                id: 'test_appeal_case_id',
                appealState: AppealCaseState.RECEIVED,
                appealRulingDecision:
                  AppealCaseRulingDecision.DISMISSED_FROM_COURT,
              },
            }}
          >
            <Ruling />
          </FormContextWrapper>
        </ApolloProvider>
      </IntlProviderWrapper>,
    )

    await waitFor(() => {
      expect(
        screen.queryByTestId('caseDecisionSection'),
      ).not.toBeInTheDocument()
    })
  })

  describe('appeal ruling upload box', () => {
    // A dismissed indictment appealed at case level, on a case that also has an
    // earlier appealed ruling order. Each appeal owns its own appeal ruling.
    const rulingOrderAppealRuling = {
      ...mockCaseFile(CaseFileCategory.APPEAL_RULING),
      name: 'urskurdur-undir-rekstri.pdf',
      rulingFileId: 'ruling_order_file_id',
    }
    const caseLevelAppealRuling = {
      ...mockCaseFile(CaseFileCategory.APPEAL_RULING),
      name: 'urskurdur-fravisun.pdf',
      rulingFileId: null,
    }
    const appealCaseFields = {
      appealState: AppealCaseState.RECEIVED,
      appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
      appealConclusion: 'Niðurstaða',
    }

    const renderRuling = (caseFiles: CaseFile[]) =>
      render(
        <IntlProviderWrapper>
          <ApolloProvider
            client={new ApolloClient({ cache: new InMemoryCache() })}
          >
            <FormContextWrapper
              theCase={
                {
                  ...mockCase(CaseType.INDICTMENT),
                  state: CaseState.COMPLETED,
                  caseFiles,
                  appealCase: {
                    id: 'case_level_appeal_case_id',
                    ...appealCaseFields,
                  },
                  rulingOrderAppealCases: [
                    {
                      id: 'ruling_order_appeal_case_id',
                      rulingFileId: 'ruling_order_file_id',
                      ...appealCaseFields,
                    },
                  ],
                } as Case
              }
            >
              <Ruling />
            </FormContextWrapper>
          </ApolloProvider>
        </IntlProviderWrapper>,
      )

    it('should only show the case level appeal ruling on the case level appeal', async () => {
      renderRuling([rulingOrderAppealRuling, caseLevelAppealRuling])

      expect(
        await screen.findByLabelText(`Opna ${caseLevelAppealRuling.name}`),
      ).toBeInTheDocument()
      expect(
        screen.queryByLabelText(`Opna ${rulingOrderAppealRuling.name}`),
      ).not.toBeInTheDocument()
    })

    it('should only show the ruling order appeal ruling on the ruling order appeal', async () => {
      mockRouterQuery = {
        id: 'test_id',
        appealCaseId: 'ruling_order_appeal_case_id',
      }

      renderRuling([rulingOrderAppealRuling, caseLevelAppealRuling])

      expect(
        await screen.findByLabelText(`Opna ${rulingOrderAppealRuling.name}`),
      ).toBeInTheDocument()
      expect(
        screen.queryByLabelText(`Opna ${caseLevelAppealRuling.name}`),
      ).not.toBeInTheDocument()
    })

    it('should not allow the case level appeal to continue on another appeal ruling', async () => {
      renderRuling([rulingOrderAppealRuling])

      expect(await screen.findByTestId('continueButton')).toBeDisabled()
    })

    it('should allow the case level appeal to continue on its own appeal ruling', async () => {
      renderRuling([caseLevelAppealRuling])

      expect(await screen.findByTestId('continueButton')).not.toBeDisabled()
    })
  })
})
