import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { COURT_OF_APPEAL_VERDICT_APPEAL_STATEMENT_DEADLINES_ROUTE } from '@island.is/judicial-system/consts'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseState,
  AppealCaseType,
  AppealEventType,
  CaseFileCategory,
  CaseState,
  CaseType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  ApolloProviderWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import VerdictAppealStatementUpload from './VerdictAppealStatementUpload'

const mockPush = jest.fn()
const mockFileAppealStatement = jest.fn()
const mockHandleUpload = jest.fn()
const mockHandleRemove = jest.fn()
const mockRefreshCase = jest.fn()
let mockQuery: Record<string, string> = {}

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useAppealStatementDeadline',
  () => ({
    __esModule: true,
    default: () => ({
      fileAppealStatement: mockFileAppealStatement,
    }),
  }),
)

jest.mock('../../../utils/hooks/useS3Upload/useS3Upload', () => ({
  ...jest.requireActual('../../../utils/hooks/useS3Upload/useS3Upload'),
  __esModule: true,
  default: () => ({
    handleUpload: mockHandleUpload,
    handleRemove: mockHandleRemove,
  }),
}))

jest.mock('../../../utils/hooks/useFileList', () => ({
  ...jest.requireActual('../../../utils/hooks/useFileList'),
  __esModule: true,
  default: () => ({ onOpenFile: jest.fn() }),
}))

// The layout's not-found banner comes from island-ui, whose source reaches
// for a React global that this app's jest does not set up, so that one file
// is stood in for by its title. Mocked by path rather than through the
// barrel: a mock of the whole barrel trips over its own imports.
jest.mock(
  '../../../../../../../libs/island-ui/core/src/lib/AlertBanner/AlertBanner',
  () => ({
    AlertBanner: ({ title }: { title: string }) => (
      <div role="alert">{title}</div>
    ),
  }),
)

jest.mock('next/router', () => ({
  __esModule: true,
  default: { push: (url: string) => mockPush(url) },
  useRouter() {
    return {
      // The side panel tells the step from the route, so the page's own.
      pathname: '/landsrettur/afryjun/greinargerd/[id]',
      query: { appealCaseId: 'verdict-appeal', ...mockQuery },
      push: mockPush,
    }
  },
}))

const theCase = {
  ...mockCase(CaseType.INDICTMENT),
  id: 'case-id',
  state: CaseState.COMPLETED,
  courtCaseNumber: 'S-123/2026',
  caseFiles: [],
  defendants: [{ id: 'd1', name: 'Gervimaður Jónsson' }],
  civilClaimants: [{ id: 'c1', name: 'Fyrsti Kröfuhafi' }],
  appealProsecutor: { id: 'p1', name: 'Sækjandi Sækjandason' },
  verdictAppealCase: {
    id: 'verdict-appeal',
    appealState: AppealCaseState.RECEIVED,
    appealType: AppealCaseType.VERDICT,
    appealCaseNumber: '555/2026',
    statementDeadlines: [],
    appealEventLogs: [
      {
        id: 'e1',
        eventType: AppealEventType.APPEAL_STATEMENT_SENT,
        civilClaimantId: 'c1',
      },
    ],
  },
} as unknown as WorkingCase

const renderPage = (c: WorkingCase = theCase) =>
  render(
    <IntlProviderWrapper>
      <ApolloProviderWrapper>
        <UserContextWrapper userRole={UserRole.COURT_OF_APPEALS_JUDGE}>
          <FormContext.Provider
            value={{
              workingCase: c,
              setWorkingCase: jest.fn(),
              isLoadingWorkingCase: false,
              caseNotFound: false,
              isCaseUpToDate: true,
              refreshCase: mockRefreshCase,
              getCase: jest.fn(),
              isCreating: false,
            }}
          >
            <VerdictAppealStatementUpload />
          </FormContext.Provider>
        </UserContextWrapper>
      </ApolloProviderWrapper>
    </IntlProviderWrapper>,
  )

const deadlinesUrl = `${COURT_OF_APPEAL_VERDICT_APPEAL_STATEMENT_DEADLINES_ROUTE}/case-id?appealCaseId=verdict-appeal`

// The first box on the page is the statement's, the second the attachments'.
const chooseStatement = async (container: HTMLElement) => {
  const input = container.querySelector('input[name="appealStatement"]')

  if (!(input instanceof HTMLInputElement)) {
    throw new Error('No statement input')
  }

  await userEvent.upload(
    input,
    new File(['%PDF'], 'greinargerd.pdf', { type: 'application/pdf' }),
  )
}

describe('VerdictAppealStatementUpload', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockRefreshCase.mockClear()
    mockFileAppealStatement.mockReset()
    mockHandleUpload.mockReset()
    mockHandleRemove.mockReset()
    mockQuery = { defendantId: 'd1' }
  })

  it('names the appeal and the party', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { name: 'Hlaða upp greinargerð', level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByText('Mál nr. 555/2026')).toBeInTheDocument()
    expect(screen.getByText('Ákærði Gervimaður Jónsson')).toBeInTheDocument()
  })

  it('names the prosecution when the query names nobody', () => {
    mockQuery = {}
    renderPage()

    expect(
      screen.getByText('Ákæruvaldið Sækjandi Sækjandason'),
    ).toBeInTheDocument()
  })

  it('holds the button until a statement is chosen', async () => {
    const { container } = renderPage()

    expect(screen.getByTestId('continueButton')).toBeDisabled()

    await chooseStatement(container)

    expect(screen.getByTestId('continueButton')).toBeEnabled()
  })

  it('uploads the files, files the statement and goes back to the deadlines', async () => {
    mockHandleUpload.mockResolvedValue('ALL_SUCCEEDED')
    mockFileAppealStatement.mockResolvedValue({ id: 'e2' })
    const { container } = renderPage()

    await chooseStatement(container)
    await userEvent.click(screen.getByTestId('continueButton'))

    expect(mockHandleUpload).toHaveBeenCalledTimes(1)
    expect(mockHandleUpload.mock.calls[0][0]).toEqual([
      expect.objectContaining({
        name: 'greinargerd.pdf',
        category: CaseFileCategory.DEFENDANT_VERDICT_APPEAL_STATEMENT,
        defendantId: 'd1',
      }),
    ])
    await waitFor(() =>
      expect(mockFileAppealStatement).toHaveBeenCalledWith({
        caseId: 'case-id',
        appealCaseId: 'verdict-appeal',
        defendantId: 'd1',
        civilClaimantId: undefined,
      }),
    )
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith(deadlinesUrl))
    expect(mockRefreshCase).toHaveBeenCalledTimes(1)
  })

  it('takes one submit while the upload is in flight', async () => {
    let finishUpload: (result: string) => void = () => undefined
    mockHandleUpload.mockImplementation(
      () => new Promise((resolve) => (finishUpload = resolve)),
    )
    const { container } = renderPage()

    await chooseStatement(container)
    await userEvent.click(screen.getByTestId('continueButton'))

    expect(screen.getByTestId('continueButton')).toBeDisabled()
    // Past the disabled button, straight at the handler.
    fireEvent.click(screen.getByTestId('continueButton'))

    expect(mockHandleUpload).toHaveBeenCalledTimes(1)

    finishUpload('SOME_SUCCEEDED')

    await waitFor(() =>
      expect(screen.getByTestId('continueButton')).toBeEnabled(),
    )
    expect(mockFileAppealStatement).not.toHaveBeenCalled()
  })

  it('keeps the boxes locked while the filing is still pending', async () => {
    let finishFiling: (result: { id: string }) => void = () => undefined
    mockHandleUpload.mockResolvedValue('ALL_SUCCEEDED')
    mockFileAppealStatement.mockImplementation(
      () => new Promise((resolve) => (finishFiling = resolve)),
    )
    const { container } = renderPage()

    await chooseStatement(container)
    expect(screen.getByLabelText('Fjarlægja skrá')).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('continueButton'))
    await waitFor(() => expect(mockFileAppealStatement).toHaveBeenCalled())

    // The upload is done, so the boxes' own state would open them again.
    const attachButtons = screen.getAllByRole('button', {
      name: 'Velja skjöl til að hlaða upp',
    })
    expect(attachButtons).toHaveLength(2)
    attachButtons.forEach((button) => expect(button).toBeDisabled())
    expect(screen.queryByLabelText('Fjarlægja skrá')).not.toBeInTheDocument()

    finishFiling({ id: 'e2' })

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith(deadlinesUrl))
  })

  it('files nothing when an upload fails', async () => {
    mockHandleUpload.mockResolvedValue('SOME_SUCCEEDED')
    const { container } = renderPage()

    await chooseStatement(container)
    await userEvent.click(screen.getByTestId('continueButton'))

    await waitFor(() => expect(mockHandleUpload).toHaveBeenCalledTimes(1))
    expect(mockFileAppealStatement).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('stays put when the filing fails', async () => {
    mockHandleUpload.mockResolvedValue('ALL_SUCCEEDED')
    mockFileAppealStatement.mockResolvedValue(undefined)
    const { container } = renderPage()

    await chooseStatement(container)
    await userEvent.click(screen.getByTestId('continueButton'))

    await waitFor(() => expect(mockFileAppealStatement).toHaveBeenCalled())
    expect(mockPush).not.toHaveBeenCalled()
    expect(mockRefreshCase).not.toHaveBeenCalled()
  })

  it('takes a file off the case once the submit has put it there', async () => {
    mockHandleUpload.mockImplementation(async (files, updateFile) => {
      files.forEach((file: { name: string }) =>
        updateFile({ ...file, key: `s3/${file.name}`, percent: 100 }, 'f1'),
      )
      return 'ALL_SUCCEEDED'
    })
    mockFileAppealStatement.mockResolvedValue(undefined)
    const { container } = renderPage()

    // Staged only: nothing on the case to delete.
    await chooseStatement(container)
    await userEvent.click(screen.getByLabelText('Fjarlægja skrá'))
    expect(mockHandleRemove).not.toHaveBeenCalled()
    expect(screen.queryByText('greinargerd.pdf')).not.toBeInTheDocument()

    // Uploaded by a submit whose filing then failed: on the case now.
    await chooseStatement(container)
    await userEvent.click(screen.getByTestId('continueButton'))
    await waitFor(() => expect(mockFileAppealStatement).toHaveBeenCalled())
    await userEvent.click(await screen.findByLabelText('Fjarlægja skrá'))

    expect(mockHandleRemove).toHaveBeenCalledWith(
      expect.objectContaining({ key: 's3/greinargerd.pdf' }),
      expect.any(Function),
    )
  })

  it('holds the submit while a file is coming off the case', async () => {
    let finishRemoval: () => void = () => undefined
    mockHandleUpload.mockImplementation(async (files, updateFile) => {
      files.forEach((file: { name: string }) =>
        updateFile({ ...file, key: `s3/${file.name}`, percent: 100 }, 'f1'),
      )
      return 'ALL_SUCCEEDED'
    })
    mockFileAppealStatement.mockResolvedValue(undefined)
    mockHandleRemove.mockImplementation(
      () => new Promise<void>((resolve) => (finishRemoval = resolve)),
    )
    const { container } = renderPage()

    await chooseStatement(container)
    await userEvent.click(screen.getByTestId('continueButton'))
    await waitFor(() =>
      expect(mockFileAppealStatement).toHaveBeenCalledTimes(1),
    )

    // The row stays while the case lets go of the file, so the button
    // cannot read readiness off it.
    await userEvent.click(await screen.findByLabelText('Fjarlægja skrá'))
    expect(screen.getByTestId('continueButton')).toBeDisabled()
    // Past the disabled button, straight at the handler.
    fireEvent.click(screen.getByTestId('continueButton'))
    expect(mockFileAppealStatement).toHaveBeenCalledTimes(1)

    finishRemoval()

    await waitFor(() =>
      expect(screen.getByTestId('continueButton')).toBeEnabled(),
    )
  })

  it('leads back to the deadlines with the appeal id', async () => {
    renderPage()

    await userEvent.click(screen.getByTestId('previousButton'))

    expect(mockPush).toHaveBeenCalledWith(deadlinesUrl)
  })

  // The panel lights the deadlines step on this page and links only to the
  // steps before it, so the way back is the step's own click.
  it('offers the deadlines step in the side panel', async () => {
    renderPage()

    await userEvent.click(
      screen.getByRole('button', { name: 'Greinargerðarfrestir' }),
    )

    expect(mockPush).toHaveBeenCalledWith(deadlinesUrl)
  })

  it('has nothing to offer for a case without a verdict appeal', () => {
    renderPage({ ...theCase, verdictAppealCase: undefined } as WorkingCase)

    expect(
      screen.queryByRole('heading', { name: 'Hlaða upp greinargerð' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Mál fannst ekki')
  })

  it.each([
    ['a party the case has not got', { defendantId: 'd2' }],
    ['a party whose statement is in', { civilClaimantId: 'c1' }],
  ])('has nothing to offer for %s', (_name, query) => {
    mockQuery = query
    renderPage()

    expect(
      screen.queryByRole('heading', { name: 'Hlaða upp greinargerð' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Mál fannst ekki')
  })
})
