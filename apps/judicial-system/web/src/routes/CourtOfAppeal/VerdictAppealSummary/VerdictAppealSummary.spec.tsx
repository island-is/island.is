import type { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react'
import { useState } from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'

import { COURT_OF_APPEAL_VERDICT_APPEAL_STATUS_ROUTE } from '@island.is/judicial-system/consts'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCaseTransition,
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

import VerdictAppealSummary from './VerdictAppealSummary'

const mockPush = jest.fn()
const mockTransitionAppealCase = jest.fn()
const mockGetFileUrl = jest.fn()
const mockToastError = jest.fn()
// Whether the server says the file is gone. The hook then raises
// fileNotFound on the instance that fetched it, as the real one does.
let mockFileIsGone = false

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useAppealCase',
  () => ({
    __esModule: true,
    default: () => ({
      transitionAppealCase: mockTransitionAppealCase,
      isTransitioningAppealCase: false,
    }),
  }),
)

jest.mock('@island.is/judicial-system-web/src/utils/hooks/useFileList', () => {
  const { useState } = jest.requireActual('react')

  const useMockFileList = () => {
    const [fileNotFound, setFileNotFound] = useState(false)

    return {
      getFileUrl: async (fileId: string) => {
        const url = await mockGetFileUrl(fileId)

        if (mockFileIsGone) {
          setFileNotFound(true)
        }

        return url
      },
      onOpen: jest.fn(),
      onOpenFile: jest.fn(),
      fileNotFound,
      dismissFileNotFound: () => setFileNotFound(false),
    }
  }

  return { __esModule: true, default: useMockFileList }
})

jest.mock('@island.is/judicial-system-web/src/utils/toast', () => ({
  toast: {
    error: (message: string) => mockToastError(message),
    success: jest.fn(),
  },
}))

// The viewer draws a real PDF in the browser. Here it only reports back, on
// a button the test presses, the way it does once the document has loaded
// or failed to. Its own module is mocked rather than the library's index,
// which cannot be spread from inside a mock of itself.
jest.mock(
  '../../../../../../../libs/island-ui/core/src/lib/PdfViewer/PdfViewer',
  () => ({
    PdfViewer: ({
      file,
      onLoadingSuccess,
      onLoadingError,
    }: {
      file: string
      onLoadingSuccess?: () => void
      onLoadingError?: () => void
    }) => (
      <div data-testid="pdfViewer" data-file={file}>
        <button type="button" onClick={() => onLoadingSuccess?.()}>
          PDF hlaðið
        </button>
        <button type="button" onClick={() => onLoadingError?.()}>
          PDF villa
        </button>
      </div>
    ),
  }),
)

// The footer's back button goes through the default router export, the page
// itself through the hook, so both are mocked onto the same push.
jest.mock('next/router', () => ({
  __esModule: true,
  default: { push: (url: string) => mockPush(url) },
  useRouter() {
    return {
      pathname: '',
      query: { appealCaseId: 'verdict-appeal' },
      push: mockPush,
    }
  },
}))

const rulingFile = {
  ...mockCaseFile(CaseFileCategory.VERDICT_APPEAL_RULING),
  id: 'ruling-file',
  name: 'domur-landsrettar.pdf',
  userGeneratedFilename: null,
  isKeyAccessible: true,
}

// An appeal the court has marked as finished, with how it ended on record,
// and not yet confirmed.
const theCase = {
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
  caseFiles: [rulingFile],
  verdictAppealCase: {
    id: 'verdict-appeal',
    appealState: AppealCaseState.APPEALED,
    appealType: AppealCaseType.VERDICT,
    appealCaseNumber: '555/2026',
    verdictAppealStatus: Status.COMPLETED,
    appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
    appealRulingType: AppealRulingType.VERDICT,
    appealConclusion: 'Hinn áfrýjaði dómur skal vera óraskaður.',
  },
} as unknown as WorkingCase

const withAppeal = (update: Record<string, unknown>) =>
  ({
    ...theCase,
    verdictAppealCase: { ...theCase.verdictAppealCase, ...update },
  } as unknown as WorkingCase)

// Holds the case in state, so what the transition writes back shows.
const StatefulFormContext: FC<PropsWithChildren<{ theCase: WorkingCase }>> = ({
  theCase,
  children,
}) => {
  const [workingCase, setWorkingCase] = useState(theCase)

  return (
    <FormContext.Provider
      value={{
        workingCase,
        setWorkingCase,
        isLoadingWorkingCase: false,
        caseNotFound: false,
        isCaseUpToDate: true,
        refreshCase: jest.fn(),
        getCase: jest.fn(),
        isCreating: false,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

const renderPage = (c: WorkingCase = theCase) =>
  render(
    <IntlProviderWrapper>
      <ApolloProviderWrapper>
        <UserContextWrapper userRole={UserRole.COURT_OF_APPEALS_JUDGE}>
          <StatefulFormContext theCase={c}>
            <VerdictAppealSummary />
          </StatefulFormContext>
        </UserContextWrapper>
      </ApolloProviderWrapper>
    </IntlProviderWrapper>,
  )

const modalTitle = 'Viltu staðfesta dómsúrlausn og ljúka máli?'
const notReleasedTitle = 'Niðurstaða skráð en ekki gefin út'

// Finishes the appeal the way the real transition does: it writes the
// finished appeal into the working case through the setter it is given.
const finishAppeal = (
  _caseId: string,
  _appealCaseId: string,
  _transition: AppealCaseTransition,
  setWorkingCase: Dispatch<SetStateAction<WorkingCase>>,
) => {
  setWorkingCase((current) => ({
    ...current,
    verdictAppealCase: current.verdictAppealCase
      ? {
          ...current.verdictAppealCase,
          appealState: AppealCaseState.COMPLETED,
        }
      : current.verdictAppealCase,
  }))

  return true
}

const openModal = async () => {
  await userEvent.click(screen.getByTestId('continueButton'))
  await screen.findByText(modalTitle)
}

// The checkbox repeats its label in a hidden copy, so it is found by role:
// it is the only one on the page.
const reviewedCheckbox = () =>
  screen.getByRole('checkbox', { name: /Ég hef rýnt þetta dómskjal/ })

// Clicks the way a user would even on a disabled control, whose styles block
// pointer events, to show the click does nothing.
const clickRegardless = (element: Element) =>
  userEvent
    .setup({ pointerEventsCheck: PointerEventsCheckLevel.Never })
    .click(element)

const reviewDocument = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'PDF hlaðið' }))
  await userEvent.click(reviewedCheckbox())
}

describe('VerdictAppealSummary', () => {
  beforeEach(() => {
    mockPush.mockReset()
    mockPush.mockResolvedValue(true)
    mockTransitionAppealCase.mockReset()
    mockGetFileUrl.mockReset()
    mockGetFileUrl.mockResolvedValue('https://files.dummy.dd/domur.pdf')
    mockToastError.mockReset()
    mockFileIsGone = false
  })

  it('shows the outcome, both conclusions and the document', () => {
    renderPage()

    expect(screen.getByText('Niðurstaða Landsréttar')).toBeInTheDocument()
    expect(screen.getByText('Staðfesting')).toBeInTheDocument()
    expect(screen.getByText('Dómsorð héraðsdóms')).toBeInTheDocument()
    expect(
      screen.getByText('Ákærði skal sæta fangelsi í 30 daga.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Dómari Dómarason')).toBeInTheDocument()
    expect(screen.getByText('Dómsorð Landsréttar')).toBeInTheDocument()
    expect(
      screen.getByText('Hinn áfrýjaði dómur skal vera óraskaður.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Dómur Landsréttar' }),
    ).toBeInTheDocument()
    expect(screen.getByText('domur-landsrettar.pdf')).toBeInTheDocument()
    expect(screen.getByTestId('continueButton')).toHaveTextContent('Staðfesta')
    expect(screen.getByTestId('continueButton')).toBeEnabled()
  })

  it('titles the document for a ruling', () => {
    renderPage(withAppeal({ appealRulingType: AppealRulingType.RULING }))

    expect(
      screen.getByRole('heading', { name: 'Úrskurður Landsréttar' }),
    ).toBeInTheDocument()
  })

  it('leads back to the status step with the appeal id', async () => {
    renderPage()

    await userEvent.click(screen.getByTestId('previousButton'))

    expect(mockPush).toHaveBeenCalledWith(
      `${COURT_OF_APPEAL_VERDICT_APPEAL_STATUS_ROUTE}/case-id?appealCaseId=verdict-appeal`,
    )
  })

  it('cannot be confirmed before the outcome is recorded', () => {
    renderPage({
      ...withAppeal({
        appealRulingDecision: null,
        appealRulingType: null,
        appealConclusion: null,
      }),
      caseFiles: [],
    } as unknown as WorkingCase)

    expect(screen.queryByText('Niðurstaða Landsréttar')).not.toBeInTheDocument()
    expect(screen.queryByText('Dómsorð Landsréttar')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Dómur Landsréttar' }),
    ).not.toBeInTheDocument()
    expect(screen.getByTestId('continueButton')).toBeDisabled()
  })

  it('cannot be confirmed while the appeal is not marked finished', () => {
    renderPage(withAppeal({ verdictAppealStatus: Status.UNDER_ADVISEMENT }))

    expect(screen.getByText('Niðurstaða Landsréttar')).toBeInTheDocument()
    expect(screen.getByTestId('continueButton')).toBeDisabled()
  })

  it('opens the document for review before confirming', async () => {
    renderPage()

    await openModal()

    expect(mockGetFileUrl).toHaveBeenCalledWith('ruling-file')
    expect(screen.getByTestId('pdfViewer')).toHaveAttribute(
      'data-file',
      'https://files.dummy.dd/domur.pdf',
    )
    expect(
      screen.getByText('Vinsamlegast rýnið skjal fyrir staðfestingu.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Ekkert er sent við staðfestingu. Aðilar máls sjá niðurstöðuna ekki fyrr en hún er gefin út.',
      ),
    ).toBeInTheDocument()
  })

  it('cannot be reviewed before the document has loaded', async () => {
    renderPage()

    await openModal()

    expect(reviewedCheckbox()).toBeDisabled()

    await userEvent.click(screen.getByRole('button', { name: 'PDF hlaðið' }))

    expect(reviewedCheckbox()).toBeEnabled()
  })

  it('holds the confirmation until the court has reviewed the document', async () => {
    renderPage()

    await openModal()

    expect(screen.getByTestId('confirmCompleteAppealButton')).toBeDisabled()

    await reviewDocument()

    expect(screen.getByTestId('confirmCompleteAppealButton')).toBeEnabled()
  })

  it('finishes the appeal and shows it finished once confirmed', async () => {
    mockTransitionAppealCase.mockImplementation(finishAppeal)
    renderPage()

    await openModal()
    await reviewDocument()
    await userEvent.click(screen.getByTestId('confirmCompleteAppealButton'))

    expect(mockTransitionAppealCase).toHaveBeenCalledWith(
      'case-id',
      'verdict-appeal',
      AppealCaseTransition.COMPLETE_APPEAL,
      expect.any(Function),
    )
    expect(await screen.findByText(notReleasedTitle)).toBeInTheDocument()
    expect(screen.getAllByText('Jón Jónsson').length).toBeGreaterThan(0)
    await waitFor(() =>
      expect(screen.queryByText(modalTitle)).not.toBeInTheDocument(),
    )
    expect(screen.queryByText('Niðurstaða Landsréttar')).not.toBeInTheDocument()
    expect(screen.queryByTestId('continueButton')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Samantekt' })).toBeVisible()
    expect(mockPush).not.toHaveBeenCalled()
  })

  // Without the document the page cannot be confirmed at all, so it never
  // reaches the fetch.
  it('cannot be confirmed without the document', () => {
    renderPage({ ...theCase, caseFiles: [] } as unknown as WorkingCase)

    expect(screen.getByTestId('continueButton')).toBeDisabled()
    expect(mockGetFileUrl).not.toHaveBeenCalled()
  })

  // The file hook has already toasted a failed request, so the page adds
  // nothing of its own.
  it('adds no message of its own when the document cannot be fetched', async () => {
    mockGetFileUrl.mockResolvedValue(undefined)
    renderPage()

    await userEvent.click(screen.getByTestId('continueButton'))

    await waitFor(() => expect(mockGetFileUrl).toHaveBeenCalled())
    await waitFor(() =>
      expect(screen.getByTestId('continueButton')).toBeEnabled(),
    )
    expect(mockToastError).not.toHaveBeenCalled()
    expect(screen.queryByText(modalTitle)).not.toBeInTheDocument()
  })

  it('explains a document the server no longer has', async () => {
    mockGetFileUrl.mockResolvedValue(undefined)
    mockFileIsGone = true
    renderPage()

    await userEvent.click(screen.getByTestId('continueButton'))

    expect(
      await screen.findByText(
        'Skjalið er ekki lengur aðgengilegt í Réttarvörslugátt',
      ),
    ).toBeInTheDocument()
    expect(mockToastError).not.toHaveBeenCalled()
    expect(screen.queryByText(modalTitle)).not.toBeInTheDocument()
  })

  it('cannot be confirmed when the document fails to load', async () => {
    renderPage()

    await openModal()
    await userEvent.click(screen.getByRole('button', { name: 'PDF villa' }))

    expect(reviewedCheckbox()).toBeDisabled()
    expect(screen.getByTestId('confirmCompleteAppealButton')).toBeDisabled()
  })

  it('stays in the modal when the appeal could not be finished', async () => {
    mockTransitionAppealCase.mockResolvedValue(false)
    renderPage()

    await openModal()
    await reviewDocument()
    await userEvent.click(screen.getByTestId('confirmCompleteAppealButton'))

    await waitFor(() => expect(mockTransitionAppealCase).toHaveBeenCalled())
    expect(screen.getByText(modalTitle)).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('finishes the appeal once however often it is confirmed', async () => {
    let finishTransition: (completed: boolean) => void = () => undefined
    mockTransitionAppealCase.mockImplementationOnce(
      () =>
        new Promise<boolean>((resolve) => {
          finishTransition = resolve
        }),
    )
    renderPage()

    await openModal()
    await reviewDocument()
    await userEvent.click(screen.getByTestId('confirmCompleteAppealButton'))
    await clickRegardless(screen.getByTestId('confirmCompleteAppealButton'))

    expect(mockTransitionAppealCase).toHaveBeenCalledTimes(1)

    await act(async () => finishTransition(true))

    await waitFor(() =>
      expect(screen.queryByText(modalTitle)).not.toBeInTheDocument(),
    )
    expect(mockTransitionAppealCase).toHaveBeenCalledTimes(1)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('cannot be closed while the appeal is being finished', async () => {
    let finishTransition: (completed: boolean) => void = () => undefined
    mockTransitionAppealCase.mockImplementationOnce(
      () =>
        new Promise<boolean>((resolve) => {
          finishTransition = resolve
        }),
    )
    renderPage()

    await openModal()
    await reviewDocument()
    await userEvent.click(screen.getByTestId('confirmCompleteAppealButton'))

    const cancelButton = screen.getByRole('button', { name: 'Hætta við' })

    expect(cancelButton).toBeDisabled()

    await clickRegardless(cancelButton)
    await userEvent.keyboard('{Escape}')

    expect(screen.getByText(modalTitle)).toBeInTheDocument()

    await act(async () => finishTransition(false))

    expect(screen.getByRole('button', { name: 'Hætta við' })).toBeEnabled()
  })

  it('shows a finished appeal as it ended, with nothing more to do', () => {
    renderPage(withAppeal({ appealState: AppealCaseState.COMPLETED }))

    expect(screen.getByRole('heading', { name: 'Samantekt' })).toBeVisible()
    expect(screen.getByText(notReleasedTitle)).toBeInTheDocument()
    expect(
      screen.getByText(
        'Aðilar máls sjá niðurstöðuna ekki fyrr en hún er gefin út.',
      ),
    ).toBeInTheDocument()
    // The info card names the defendants, which nothing else on the page does.
    expect(screen.getAllByText('Jón Jónsson').length).toBeGreaterThan(0)
    expect(screen.getByText('Dómsorð Landsréttar')).toBeInTheDocument()
    expect(screen.queryByText('Niðurstaða Landsréttar')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Staðfesta' }),
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('continueButton')).not.toBeInTheDocument()
    expect(screen.getByTestId('previousButton')).toBeInTheDocument()
  })

  it('shows no info card before the appeal is finished', () => {
    renderPage()

    expect(screen.queryAllByText('Jón Jónsson')).toHaveLength(0)
    expect(screen.queryByText(notReleasedTitle)).not.toBeInTheDocument()
  })
})
