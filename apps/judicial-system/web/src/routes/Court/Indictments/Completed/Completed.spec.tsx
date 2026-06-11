import { render, screen } from '@testing-library/react'

import {
  AppealCaseState,
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { mockCase } from '../../../../utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '../../../../utils/testHelpers'
import Completed from './Completed'

jest.mock('next/router', () => ({
  __esModule: true,
  default: { push: jest.fn() },
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock('@island.is/judicial-system-web/src/utils/hooks', () => ({
  useCase: () => ({ updateCase: jest.fn() }),
  useAppealCaseBanner: () => ({ appealBanner: null, appealModals: null }),
  useS3Upload: () => ({ handleUpload: jest.fn() }),
  useUploadFiles: () => ({
    uploadFiles: [],
    addUploadFiles: jest.fn(),
    updateUploadFile: jest.fn(),
    removeUploadFile: jest.fn(),
  }),
}))

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useEventLog',
  () => () => ({ createEventLog: jest.fn() }),
)

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useVerdict',
  () => () => ({ deliverCaseVerdict: jest.fn() }),
)

jest.mock('@island.is/judicial-system-web/src/components', () => ({
  ...jest.requireActual('@island.is/judicial-system-web/src/components'),
  AllIndictmentCaseFiles: () => null,
  AppealRulingModifiedAlert: () => null,
  Conclusion: () => null,
  InfoCardClosedIndictment: () => null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PageLayout: ({ children }: any) => children,
  PageHeader: () => null,
  PageTitle: () => null,
  RulingModifiedAlert: () => null,
  RulingInput: () => null,
  SectionHeading: () => null,
  ServiceAnnouncements: () => null,
}))

jest.mock(
  '@island.is/judicial-system-web/src/components/VerdictStatusAlert/VerdictStatusAlert',
  () => ({
    __esModule: true,
    default: () => null,
  }),
)

window.scrollTo = jest.fn()

describe('Completed - reopen button visibility in footer', () => {
  const completedIndictmentCase = {
    ...mockCase(CaseType.INDICTMENT),
    state: CaseState.COMPLETED,
    indictmentCompletedDate: '2024-01-01',
    indictmentSentToPublicProsecutorDate: '2024-01-02',
  }

  const renderComponent = (
    userRole: UserRole,
    workingCase = completedIndictmentCase,
  ) =>
    render(
      <IntlProviderWrapper>
        <UserContextWrapper userRole={userRole}>
          <FormContextWrapper theCase={workingCase}>
            <Completed />
          </FormContextWrapper>
        </UserContextWrapper>
      </IntlProviderWrapper>,
    )

  it('shows the "Enduropna mál" action button to a district court user when case is sent to prosecutor', () => {
    renderComponent(UserRole.DISTRICT_COURT_JUDGE)

    expect(
      screen.getByRole('button', { name: 'Enduropna mál' }),
    ).toBeInTheDocument()
  })

  it('shows "Leiðrétta mál" to non-district-court users', () => {
    renderComponent(UserRole.PROSECUTOR)

    expect(
      screen.queryByRole('button', { name: 'Enduropna mál' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Leiðrétta mál' }),
    ).toBeInTheDocument()
  })

  it('shows "Leiðrétta mál" when there is an active appeal', () => {
    const caseWithActiveAppeal = {
      ...completedIndictmentCase,
      appealCase: { id: 'appeal_id', appealState: AppealCaseState.RECEIVED },
    }

    renderComponent(UserRole.DISTRICT_COURT_JUDGE, caseWithActiveAppeal)

    expect(
      screen.queryByRole('button', { name: 'Enduropna mál' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Leiðrétta mál' }),
    ).toBeInTheDocument()
  })

  it('shows "Enduropna mál" when the appeal is completed', () => {
    const caseWithCompletedAppeal = {
      ...completedIndictmentCase,
      appealCase: { id: 'appeal_id', appealState: AppealCaseState.COMPLETED },
    }

    renderComponent(UserRole.DISTRICT_COURT_JUDGE, caseWithCompletedAppeal)

    expect(
      screen.getByRole('button', { name: 'Enduropna mál' }),
    ).toBeInTheDocument()
  })

  it('shows "Enduropna mál" when the appeal is withdrawn', () => {
    const caseWithWithdrawnAppeal = {
      ...completedIndictmentCase,
      appealCase: { id: 'appeal_id', appealState: AppealCaseState.WITHDRAWN },
    }

    renderComponent(UserRole.DISTRICT_COURT_JUDGE, caseWithWithdrawnAppeal)

    expect(
      screen.getByRole('button', { name: 'Enduropna mál' }),
    ).toBeInTheDocument()
  })

  it('hides the action button entirely when the ruling decision is withdrawal', () => {
    const withdrawnCase = {
      ...completedIndictmentCase,
      indictmentRulingDecision: CaseIndictmentRulingDecision.WITHDRAWAL,
    }

    renderComponent(UserRole.DISTRICT_COURT_JUDGE, withdrawnCase)

    expect(
      screen.queryByRole('button', { name: 'Enduropna mál' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Leiðrétta mál' }),
    ).not.toBeInTheDocument()
  })

  it('shows "Leiðrétta mál" when the case has been merged', () => {
    const mergedCase = {
      ...completedIndictmentCase,
      mergeCase: { id: 'merged_case_id' },
    }

    renderComponent(UserRole.DISTRICT_COURT_JUDGE, mergedCase)

    expect(
      screen.queryByRole('button', { name: 'Enduropna mál' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Leiðrétta mál' }),
    ).toBeInTheDocument()
  })

  it('shows "Leiðrétta mál" when the case has not been sent to public prosecutor', () => {
    const notSentCase = {
      ...completedIndictmentCase,
      indictmentSentToPublicProsecutorDate: undefined,
    }

    renderComponent(UserRole.DISTRICT_COURT_JUDGE, notSentCase)

    expect(
      screen.queryByRole('button', { name: 'Enduropna mál' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Leiðrétta mál' }),
    ).toBeInTheDocument()
  })
})
