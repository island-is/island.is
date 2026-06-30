import { ReactNode } from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  AppealCaseState,
  AppealCaseTransition,
  Case,
  CaseFile,
  CaseFileCategory,
  CaseState,
  CaseType,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  mockCase,
  mockJudge,
  mockProsecutor,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'

import RulingOrderFileRow from './RulingOrderFileRow'

const mockTransitionAppealCase = jest.fn().mockResolvedValue(true)

jest.mock('next/router', () => ({
  __esModule: true,
  default: { push: jest.fn() },
}))

// Mock the leaf hook (re-exported by the utils/hooks barrel) rather than the
// barrel itself - requireActual on the barrel pulls in a circular dependency.
jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useAppealCase',
  () => ({
    __esModule: true,
    default: () => ({ transitionAppealCase: mockTransitionAppealCase }),
  }),
)

// District court sending an in-court ruling-order appeal straight to
// Landsréttur. An in-court appeal creates the appeal case in APPEALED state
// with no named appellant (appealedByRole/appealedByNationalId are null), so
// the row must light up from appeal-case existence alone.
describe('RulingOrderFileRow - send in-court appeal to Landsréttur', () => {
  const rulingFileId = 'ruling-file-1'
  const appealCaseId = 'appeal-1'
  const appealedDate = '2026-06-05T14:30:00.000Z'
  const fileName = 'urskurdur.pdf'

  const inCourtAppealCase = {
    id: appealCaseId,
    rulingFileId,
    appealState: AppealCaseState.APPEALED,
    appealedInCourt: true,
    appealedDate,
  }

  const rulingOrderFile = {
    id: rulingFileId,
    name: fileName,
    category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
    hasBeenAppealed: true,
    isKeyAccessible: true,
  } as CaseFile

  const renderRow = (user: User) => {
    const workingCase = {
      ...mockCase(CaseType.INDICTMENT),
      state: CaseState.RECEIVED,
      rulingOrderAppealCases: [inCourtAppealCase],
    } as Case

    const wrapInProviders = (children: ReactNode) => (
      <MockedProvider addTypename={false}>
        <IntlProviderWrapper>
          <UserContext.Provider value={{ user }}>
            <FormContext.Provider
              value={
                {
                  workingCase,
                  setWorkingCase: jest.fn(),
                  isLoadingWorkingCase: false,
                  caseNotFound: false,
                  isCaseUpToDate: true,
                  refreshCase: jest.fn(),
                  getCase: jest.fn(),
                  isCreating: false,
                } as unknown as React.ContextType<typeof FormContext>
              }
            >
              {children}
            </FormContext.Provider>
          </UserContext.Provider>
        </IntlProviderWrapper>
      </MockedProvider>
    )

    return render(
      wrapInProviders(
        <RulingOrderFileRow file={rulingOrderFile} onOpenFile={jest.fn()} />,
      ),
    )
  }

  const openMenu = () =>
    fireEvent.click(screen.getByLabelText(`Valmynd fyrir ${fileName}`))

  afterEach(() => jest.clearAllMocks())

  it('shows the "Kært í þinghaldi" status for the in-court appeal', async () => {
    renderRow(mockJudge)

    expect(await screen.findByText(/Kært í þinghaldi/)).toBeInTheDocument()
  })

  it('offers "Senda til Landsréttar" to a district court user', async () => {
    renderRow(mockJudge)
    openMenu()

    expect(await screen.findByText('Senda til Landsréttar')).toBeInTheDocument()
  })

  it('receives the appeal (RECEIVE_APPEAL) when sending to Landsréttur', async () => {
    renderRow(mockJudge)
    openMenu()

    fireEvent.click(await screen.findByText('Senda til Landsréttar'))

    await waitFor(() =>
      expect(mockTransitionAppealCase).toHaveBeenCalledWith(
        expect.any(String),
        appealCaseId,
        AppealCaseTransition.RECEIVE_APPEAL,
      ),
    )
  })

  it('does not offer "Senda til Landsréttar" to the prosecution, only statements', async () => {
    renderRow(mockProsecutor)
    openMenu()

    expect(await screen.findByText('Senda inn greinargerð')).toBeInTheDocument()
    expect(screen.queryByText('Senda til Landsréttar')).not.toBeInTheDocument()
  })
})
