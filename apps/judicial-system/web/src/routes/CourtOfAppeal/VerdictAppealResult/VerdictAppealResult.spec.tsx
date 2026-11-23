import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { COURT_OF_APPEAL_VERDICT_APPEAL_SUMMARY_ROUTE } from '@island.is/judicial-system/consts'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCaseType,
  AppealRulingType,
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  UserRole,
  VerdictAppealStatus as Status,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  mockCase,
  mockCaseFile,
} from '@island.is/judicial-system-web/src/utils/mocks'
import {
  ApolloProviderWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import VerdictAppealResult from './VerdictAppealResult'

const mockPush = jest.fn()
const mockReplace = jest.fn()

jest.mock('@island.is/judicial-system-web/src/utils/hooks/useFileList', () => ({
  __esModule: true,
  default: () => ({
    getFileUrl: jest.fn(),
    onOpen: jest.fn(),
    onOpenFile: jest.fn(),
    fileNotFound: false,
    dismissFileNotFound: jest.fn(),
  }),
}))

jest.mock('next/router', () => ({
  __esModule: true,
  default: { push: (url: string) => mockPush(url) },
  useRouter() {
    return {
      pathname: '',
      query: { appealCaseId: 'verdict-appeal' },
      push: mockPush,
      replace: mockReplace,
    }
  },
}))

const finishedCase = {
  ...mockCase(CaseType.INDICTMENT),
  id: 'case-id',
  state: CaseState.COMPLETED,
  courtCaseNumber: 'S-123/2026',
  indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
  judge: { id: 'judge', name: 'Dómari Dómarason' },
  courtSessions: [
    { id: 'session', ruling: 'Ákærði skal sæta fangelsi í 30 daga.' },
  ],
  defendants: [
    {
      id: 'd1',
      name: 'Jón Jónsson',
      verdict: { appealDate: '2026-06-04T10:00:00.000Z' },
      isAppealDefenderConfirmed: true,
    },
  ],
  caseFiles: [
    {
      ...mockCaseFile(CaseFileCategory.VERDICT_APPEAL_RULING),
      name: 'domur-landsrettar.pdf',
      userGeneratedFilename: null,
    },
  ],
  verdictAppealCase: {
    id: 'verdict-appeal',
    appealState: AppealCaseState.COMPLETED,
    appealType: AppealCaseType.VERDICT,
    appealCaseNumber: '555/2026',
    verdictAppealStatus: Status.COMPLETED,
    appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
    appealRulingType: AppealRulingType.VERDICT,
    appealConclusion: 'Hinn áfrýjaði dómur skal vera óraskaður.',
  },
} as unknown as WorkingCase

const openCase = {
  ...finishedCase,
  verdictAppealCase: {
    ...finishedCase.verdictAppealCase,
    appealState: AppealCaseState.APPEALED,
  },
} as unknown as WorkingCase

const renderPage = (c: WorkingCase, isLoadingWorkingCase = false) =>
  render(
    <IntlProviderWrapper>
      <ApolloProviderWrapper>
        <UserContextWrapper userRole={UserRole.COURT_OF_APPEALS_JUDGE}>
          <FormContext.Provider
            value={{
              workingCase: c,
              setWorkingCase: jest.fn(),
              isLoadingWorkingCase,
              caseNotFound: false,
              isCaseUpToDate: !isLoadingWorkingCase,
              refreshCase: jest.fn(),
              getCase: jest.fn(),
              isCreating: false,
            }}
          >
            <VerdictAppealResult />
          </FormContext.Provider>
        </UserContextWrapper>
      </ApolloProviderWrapper>
    </IntlProviderWrapper>,
  )

describe('VerdictAppealResult', () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockReplace.mockReset()
  })

  it('shows how a finished appeal ended', () => {
    renderPage(finishedCase)

    expect(screen.getByRole('heading', { name: 'Máli lokið' })).toBeVisible()
    expect(
      screen.getByText('Málsnr. héraðsdóms S-123/2026'),
    ).toBeInTheDocument()
    expect(screen.getByText('Dómsorð héraðsdóms')).toBeInTheDocument()
    expect(screen.getByText('Dómsorð Landsréttar')).toBeInTheDocument()
    expect(
      screen.getByText('Hinn áfrýjaði dómur skal vera óraskaður.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Dómur Landsréttar' }),
    ).toBeInTheDocument()
    expect(screen.getByText('domur-landsrettar.pdf')).toBeInTheDocument()
    expect(screen.queryByTestId('continueButton')).not.toBeInTheDocument()
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('goes back to the summary of the same appeal', async () => {
    renderPage(finishedCase)

    await userEvent.click(screen.getByTestId('previousButton'))

    expect(mockPush).toHaveBeenCalledWith(
      `${COURT_OF_APPEAL_VERDICT_APPEAL_SUMMARY_ROUTE}/case-id?appealCaseId=verdict-appeal`,
    )
  })

  it('sends an appeal that is not finished to the summary', async () => {
    renderPage(openCase)

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith(
        `${COURT_OF_APPEAL_VERDICT_APPEAL_SUMMARY_ROUTE}/case-id?appealCaseId=verdict-appeal`,
      ),
    )
  })

  it('waits for the case before deciding', () => {
    renderPage(
      { ...openCase, id: '', verdictAppealCase: null } as WorkingCase,
      true,
    )

    expect(mockReplace).not.toHaveBeenCalled()
  })
})
