import type { ReactNode } from 'react'
import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import type {
  AppealCase,
  Case,
  CaseFile,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseState,
  CaseFileCategory,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  mockCase,
  mockProsecutor,
} from '@island.is/judicial-system-web/src/utils/mocks'
import { IntlProviderWrapper } from '@island.is/judicial-system-web/src/utils/testHelpers'

import RulingOrderAppealFilesAccordion from './RulingOrderAppealFilesAccordion'

const mockHandleRemove = jest.fn(
  async (file: { id?: string }, callback?: (file: { id?: string }) => void) => {
    callback?.(file)
  },
)

// Mock the leaf hook (re-exported by the utils/hooks barrel) rather than the
// barrel itself - requireActual on the barrel pulls in a circular dependency.
jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useS3Upload/useS3Upload',
  () => ({
    __esModule: true,
    default: () => ({ handleRemove: mockHandleRemove }),
    useUploadFiles: jest.fn(),
  }),
)

describe('RulingOrderAppealFilesAccordion', () => {
  const rulingFileId = 'ruling-file-1'

  const appealCase = {
    id: 'appeal-1',
    rulingFileId,
    appealState: AppealCaseState.APPEALED,
    appealedByRole: UserRole.PROSECUTOR,
    prosecutorStatementDate: '2026-08-25T10:00:00.000Z',
  } as AppealCase

  const rulingFile = {
    id: rulingFileId,
    name: 'urskurdur.pdf',
    category: CaseFileCategory.COURT_INDICTMENT_RULING_ORDER,
  } as CaseFile

  const appealBriefFile = {
    id: 'brief-1',
    name: 'kaera.pdf',
    category: CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
    rulingFileId,
    isKeyAccessible: true,
    created: '2026-08-24T10:00:00.000Z',
  } as CaseFile

  const statementFile = {
    id: 'statement-1',
    name: 'greinargerd.pdf',
    category: CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
    rulingFileId,
    isKeyAccessible: true,
    created: '2026-08-25T10:00:00.000Z',
  } as CaseFile

  const makeCase = (caseFiles: CaseFile[]): Case =>
    ({
      ...mockCase(CaseType.INDICTMENT),
      state: CaseState.RECEIVED,
      rulingOrderAppealCases: [appealCase],
      caseFiles,
    } as Case)

  const makeFormContext = (
    workingCase: Case,
    setWorkingCase: (updater: (prev: Case) => Case) => void = jest.fn(),
  ) =>
    ({
      workingCase,
      setWorkingCase,
      isLoadingWorkingCase: false,
      caseNotFound: false,
      isCaseUpToDate: true,
      refreshCase: jest.fn(),
      getCase: jest.fn(),
      isCreating: false,
    } as unknown as React.ContextType<typeof FormContext>)

  const wrapInProviders = (
    children: ReactNode,
    formContext: React.ContextType<typeof FormContext>,
  ) => (
    <MockedProvider addTypename={false}>
      <IntlProviderWrapper>
        <UserContext.Provider value={{ user: mockProsecutor }}>
          <FormContext.Provider value={formContext}>
            {children}
          </FormContext.Provider>
        </UserContext.Provider>
      </IntlProviderWrapper>
    </MockedProvider>
  )

  const accordion = (
    <RulingOrderAppealFilesAccordion
      appealCase={appealCase}
      rulingFile={rulingFile}
      onOpenFile={jest.fn()}
    />
  )

  afterEach(() => jest.clearAllMocks())

  // Regression test: the greinargerð was not shown until a page refresh
  // because the file list was snapshotted into local state at mount and never
  // re-synced when the refetched working case arrived.
  it('shows a newly added greinargerð when the working case updates', async () => {
    const { rerender } = render(
      wrapInProviders(accordion, makeFormContext(makeCase([appealBriefFile]))),
    )

    expect(await screen.findByText('kaera.pdf')).toBeInTheDocument()
    expect(screen.queryByText('greinargerd.pdf')).not.toBeInTheDocument()

    // The refetched case now also contains the appeal statement
    rerender(
      wrapInProviders(
        accordion,
        makeFormContext(makeCase([appealBriefFile, statementFile])),
      ),
    )

    expect(await screen.findByText('greinargerd.pdf')).toBeInTheDocument()
    expect(screen.getByText('kaera.pdf')).toBeInTheDocument()
  })

  it('removes a deleted file from the working case', async () => {
    const deletableFile = {
      id: 'gogn-1',
      name: 'gogn.pdf',
      category: CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
      rulingFileId,
      isKeyAccessible: true,
      created: '2026-08-25T11:00:00.000Z',
    } as CaseFile

    let workingCase = makeCase([appealBriefFile, deletableFile])
    const setWorkingCase = jest.fn((updater: (prev: Case) => Case) => {
      workingCase = updater(workingCase)
    })

    const { rerender } = render(
      wrapInProviders(accordion, makeFormContext(workingCase, setWorkingCase)),
    )

    fireEvent.click(await screen.findByLabelText('Valmynd fyrir gogn.pdf'))
    fireEvent.click(await screen.findByText('Eyða'))

    await waitFor(() => expect(mockHandleRemove).toHaveBeenCalled())
    expect(setWorkingCase).toHaveBeenCalled()
    expect(workingCase.caseFiles?.map((f) => f.id)).toEqual(['brief-1'])

    // The next working case render no longer contains the deleted file
    rerender(
      wrapInProviders(accordion, makeFormContext(workingCase, setWorkingCase)),
    )

    expect(screen.queryByText('gogn.pdf')).not.toBeInTheDocument()
    expect(screen.getByText('kaera.pdf')).toBeInTheDocument()
  })
})
