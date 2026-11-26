import type { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react'
import { useEffect, useState } from 'react'
import { act, render, screen, waitFor, within } from '@testing-library/react'
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
import { formatDateForServer } from '@island.is/judicial-system-web/src/utils/hooks/useCase/useCase.logic'
import {
  mockCase,
  mockCaseFile,
} from '@island.is/judicial-system-web/src/utils/mocks'
import {
  ApolloProviderWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'
import { applyAppealCaseUpdate } from '@island.is/judicial-system-web/src/utils/utils'

import VerdictAppealSummary from './VerdictAppealSummary'

const mockPush = jest.fn()
const mockScrollTo = jest.fn()
const mockTransitionAppealCase = jest.fn()
const mockUpdateAppealCase = jest.fn()
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
      updateAppealCase: mockUpdateAppealCase,
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

// The appeal the URL names. A legacy link names none, which is when the
// shared resolver answers with the case level ruling appeal.
let mockAppealCaseIdQuery: string | undefined

// The footer's back button goes through the default router export, the page
// itself through the hook, so both are mocked onto the same push.
jest.mock('next/router', () => ({
  __esModule: true,
  default: { push: (url: string) => mockPush(url) },
  useRouter() {
    return {
      pathname: '',
      query: { appealCaseId: mockAppealCaseIdQuery },
      push: mockPush,
    }
  },
}))

const rulingFile = {
  ...mockCaseFile(CaseFileCategory.VERDICT_APPEAL_RULING),
  id: 'ruling-file',
  name: 'domur-landsrettar.pdf',
  type: 'application/pdf',
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
  rulingDate: new Date(2026, 4, 20).toISOString(),
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
    appealRulingDate: new Date(2026, 5, 10).toISOString(),
    sentAppealSummonses: [
      {
        id: 'sent-summons',
        sentToCourtOfAppealsDate: '2026-06-05T10:00:00.000Z',
        defendants: [],
        services: [],
      },
    ],
  },
} as unknown as WorkingCase

// Another appeal ready to confirm, in another case, for moving between
// appeals while the page stays mounted.
const otherCase = {
  ...theCase,
  id: 'other-case',
  caseFiles: [{ ...rulingFile, id: 'other-ruling-file' }],
  verdictAppealCase: {
    ...theCase.verdictAppealCase,
    id: 'other-appeal',
    appealCaseNumber: '556/2026',
  },
} as unknown as WorkingCase

const withAppeal = (update: Record<string, unknown>) =>
  ({
    ...theCase,
    verdictAppealCase: { ...theCase.verdictAppealCase, ...update },
  } as unknown as WorkingCase)

// Holds the case in state, so what the transition writes back shows. A new
// case passed in replaces it, the way the form provider loads the case of the
// route the user moves to without remounting the page.
const StatefulFormContext: FC<PropsWithChildren<{ theCase: WorkingCase }>> = ({
  theCase,
  children,
}) => {
  const [workingCase, setWorkingCase] = useState(theCase)

  useEffect(() => setWorkingCase(theCase), [theCase])

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

const page = (
  c: WorkingCase = theCase,
  userRole: UserRole = UserRole.COURT_OF_APPEALS_JUDGE,
) => (
  <IntlProviderWrapper>
    <ApolloProviderWrapper>
      <UserContextWrapper userRole={userRole}>
        <StatefulFormContext theCase={c}>
          <VerdictAppealSummary />
        </StatefulFormContext>
      </UserContextWrapper>
    </ApolloProviderWrapper>
  </IntlProviderWrapper>
)

const renderPage = (
  c: WorkingCase = theCase,
  userRole: UserRole = UserRole.COURT_OF_APPEALS_JUDGE,
) => render(page(c, userRole))

const modalTitle = 'Viltu staðfesta dómsúrlausn og ljúka máli?'
const rulingDateHeading = 'Dagsetning lykta'
const rulingDateInstruction =
  'Vinsamlegast skráið dagsetningu lykta, þ.e. hvenær dómur var kveðinn upp, dagsetning viðurlagaákvörðunar eða annarra lykta.'
const rulingDateConsequence =
  'Þessi dagsetning skilar sér til ríkissaksóknara og áfrýjunarfrestir og aðrir frestir miðast við hana.'

const startOfToday = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return today
}

// Today, the latest day the picker allows. With no date on record the
// calendar opens on the current month, so the cell is found there.
const pickToday = async () => {
  const today = new Date()

  await userEvent.click(screen.getByLabelText(/Dagsetning lykta/))

  // The calendar pads its grid with the neighbouring months' days, so the
  // number alone can match twice. Only a cell of the month on view counts.
  const cell = screen
    .getAllByText(String(today.getDate()))
    .find(
      (el) =>
        el.className.includes('react-datepicker__day') &&
        !el.className.includes('outside-month'),
    )

  if (!cell) {
    throw new Error('No calendar cell for today')
  }

  await userEvent.click(cell)
}
const notReleasedTitle = 'Niðurstaða skráð en ekki gefin út'

// Confirms the appeal the way the real transition does: it writes the
// confirmed appeal into the working case through the setter it is given.
// Like the real one, it writes only to the appeal it was sent for.
const confirmAppeal = (
  _caseId: string,
  appealCaseId: string,
  _transition: AppealCaseTransition,
  setWorkingCase: Dispatch<SetStateAction<WorkingCase>>,
) => {
  setWorkingCase((current) =>
    applyAppealCaseUpdate(current, appealCaseId, {
      appealState: AppealCaseState.READY_TO_COMPLETE,
    }),
  )

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
    mockUpdateAppealCase.mockReset()
    mockUpdateAppealCase.mockResolvedValue({ id: 'verdict-appeal' })
    mockGetFileUrl.mockReset()
    mockGetFileUrl.mockResolvedValue('https://files.dummy.dd/domur.pdf')
    mockToastError.mockReset()
    mockFileIsGone = false
    mockAppealCaseIdQuery = 'verdict-appeal'
    mockScrollTo.mockReset()
    window.scrollTo = mockScrollTo
  })

  it('shows the outcome, both conclusions and the document', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { level: 2, name: 'Mál nr. 555/2026' }),
    ).toBeInTheDocument()
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

  // The server refuses to confirm an appeal the public prosecution has not
  // sent to the Court of Appeals.
  it('cannot be confirmed before the appeal is sent to the Court of Appeals', () => {
    renderPage(withAppeal({ sentAppealSummonses: [] }))

    expect(screen.getByTestId('continueButton')).toBeDisabled()
  })

  it('asks for the date the appeal ended', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { name: rulingDateHeading }),
    ).toBeInTheDocument()
    expect(screen.getByText(rulingDateInstruction)).toBeInTheDocument()
    expect(screen.getByText(rulingDateConsequence)).toBeInTheDocument()
    expect(screen.getByLabelText(/Dagsetning lykta/)).toHaveValue('10.06.2026')
  })

  it('cannot be confirmed before the date the appeal ended is entered', () => {
    renderPage(withAppeal({ appealRulingDate: null }))

    expect(screen.getByTestId('continueButton')).toBeDisabled()
  })

  it('saves the date the appeal ended once it is picked', async () => {
    renderPage(withAppeal({ appealRulingDate: null }))

    await pickToday()

    await waitFor(() =>
      expect(mockUpdateAppealCase).toHaveBeenCalledWith(
        'case-id',
        'verdict-appeal',
        {
          appealRulingDate: formatDateForServer(startOfToday()),
        },
      ),
    )
    expect(mockUpdateAppealCase).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('continueButton')).toBeEnabled()
  })

  // The working case holds only what the server stored, so a failed save
  // cannot be confirmed with a date that is not on record.
  it('shows the stored date again when the date cannot be saved', async () => {
    mockUpdateAppealCase.mockResolvedValue(undefined)
    renderPage(withAppeal({ appealRulingDate: null }))

    await pickToday()

    await waitFor(() => expect(mockUpdateAppealCase).toHaveBeenCalled())
    await waitFor(() =>
      expect(screen.getByLabelText(/Dagsetning lykta/)).toHaveValue(''),
    )
    expect(screen.getByTestId('continueButton')).toBeDisabled()
  })

  // The date is withheld from everyone outside the court, and the server
  // refuses it from them.
  it('does not ask anyone outside the Court of Appeals for the date', () => {
    renderPage(theCase, UserRole.PROSECUTOR)

    expect(
      screen.queryByRole('heading', { name: rulingDateHeading }),
    ).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/Dagsetning lykta/)).not.toBeInTheDocument()
  })

  // Moving the status away from "Lokið" keeps the outcome, its type, the
  // concluding words and the document on record. None of it is shown for an
  // appeal that has not ended.
  it('hides how the appeal ended while it is not marked finished', () => {
    renderPage(withAppeal({ verdictAppealStatus: Status.UNDER_ADVISEMENT }))

    expect(screen.queryByText('Niðurstaða Landsréttar')).not.toBeInTheDocument()
    expect(screen.queryByText('Staðfesting')).not.toBeInTheDocument()
    expect(screen.queryByText('Dómsorð Landsréttar')).not.toBeInTheDocument()
    expect(
      screen.queryByText('Hinn áfrýjaði dómur skal vera óraskaður.'),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Dómur Landsréttar' }),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('domur-landsrettar.pdf')).not.toBeInTheDocument()
    expect(screen.getByText('Dómsorð héraðsdóms')).toBeInTheDocument()
    expect(
      screen.getByText('Ákærði skal sæta fangelsi í 30 daga.'),
    ).toBeInTheDocument()
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
    // The date on record, not the day the court confirms.
    expect(screen.getByText('10.06.2026')).toBeInTheDocument()
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

    expect(screen.getByTestId('confirmVerdictAppealButton')).toBeDisabled()

    await reviewDocument()

    expect(screen.getByTestId('confirmVerdictAppealButton')).toBeEnabled()
  })

  it('marks the appeal ready to complete and shows it confirmed', async () => {
    mockTransitionAppealCase.mockImplementation(confirmAppeal)
    renderPage()

    await openModal()
    await reviewDocument()
    await userEvent.click(screen.getByTestId('confirmVerdictAppealButton'))

    expect(mockTransitionAppealCase).toHaveBeenCalledWith(
      'case-id',
      'verdict-appeal',
      AppealCaseTransition.MARK_APPEAL_READY_TO_COMPLETE,
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
    // The date can still be corrected once the appeal is confirmed.
    expect(
      screen.getByRole('heading', { name: rulingDateHeading }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/Dagsetning lykta/)).toBeEnabled()
    expect(mockPush).not.toHaveBeenCalled()
    // What changed is at the top of the page, above the button that was used.
    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
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
    expect(screen.getByTestId('confirmVerdictAppealButton')).toBeDisabled()
  })

  it('stays in the modal when the appeal could not be confirmed', async () => {
    mockTransitionAppealCase.mockResolvedValue(false)
    renderPage()

    await openModal()
    await reviewDocument()
    await userEvent.click(screen.getByTestId('confirmVerdictAppealButton'))

    await waitFor(() => expect(mockTransitionAppealCase).toHaveBeenCalled())
    expect(screen.getByText(modalTitle)).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
    expect(mockScrollTo).not.toHaveBeenCalled()
  })

  it('confirms the appeal once however often it is confirmed', async () => {
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
    await userEvent.click(screen.getByTestId('confirmVerdictAppealButton'))
    await clickRegardless(screen.getByTestId('confirmVerdictAppealButton'))

    expect(mockTransitionAppealCase).toHaveBeenCalledTimes(1)

    await act(async () => finishTransition(true))

    await waitFor(() =>
      expect(screen.queryByText(modalTitle)).not.toBeInTheDocument(),
    )
    expect(mockTransitionAppealCase).toHaveBeenCalledTimes(1)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('cannot be closed while the appeal is being confirmed', async () => {
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
    await userEvent.click(screen.getByTestId('confirmVerdictAppealButton'))

    const cancelButton = screen.getByRole('button', { name: 'Hætta við' })

    expect(cancelButton).toBeDisabled()

    await clickRegardless(cancelButton)
    await userEvent.keyboard('{Escape}')

    expect(screen.getByText(modalTitle)).toBeInTheDocument()

    await act(async () => finishTransition(false))

    expect(screen.getByRole('button', { name: 'Hætta við' })).toBeEnabled()
  })

  it('shows a confirmed appeal as it ended, with nothing more to do', () => {
    renderPage(withAppeal({ appealState: AppealCaseState.READY_TO_COMPLETE }))

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
    // With the banner gone, the info card carries the outcome.
    const outcomeItem = screen.getByRole('heading', {
      name: 'Lyktir',
    }).parentElement

    if (!outcomeItem) {
      throw new Error('The outcome has no item on the info card')
    }

    expect(within(outcomeItem).getByText('Staðfesting')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Staðfesta' }),
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('continueButton')).not.toBeInTheDocument()
    expect(screen.getByTestId('previousButton')).toBeInTheDocument()
  })

  // Correcting how a confirmed appeal ended takes it back to APPEALED, and the
  // page then asks for confirmation again, saying nothing of its own about it.
  it('offers to confirm again once a confirmed appeal is taken back', () => {
    const { rerender } = renderPage(
      withAppeal({ appealState: AppealCaseState.READY_TO_COMPLETE }),
    )

    expect(screen.getByText(notReleasedTitle)).toBeInTheDocument()
    expect(screen.queryByTestId('continueButton')).not.toBeInTheDocument()

    rerender(page(withAppeal({ appealState: AppealCaseState.APPEALED })))

    expect(screen.queryByText(notReleasedTitle)).not.toBeInTheDocument()
    expect(screen.queryAllByText('Jón Jónsson')).toHaveLength(0)
    expect(screen.getByText('Niðurstaða Landsréttar')).toBeInTheDocument()
    expect(screen.getByTestId('continueButton')).toHaveTextContent('Staðfesta')
    expect(screen.getByTestId('continueButton')).toBeEnabled()
  })

  // A confirmed appeal has ended, so how it ended stays on the page even when
  // its status was later moved away from "Lokið".
  it('keeps showing how a confirmed appeal ended under another status', () => {
    renderPage(
      withAppeal({
        appealState: AppealCaseState.READY_TO_COMPLETE,
        verdictAppealStatus: Status.UNDER_ADVISEMENT,
      }),
    )

    expect(screen.getByText(notReleasedTitle)).toBeInTheDocument()
    expect(screen.getByText('Dómsorð Landsréttar')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Dómur Landsréttar' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Lyktir' })).toBeInTheDocument()
  })

  it('shows a completed appeal as it ended, released and with nothing more to do', () => {
    renderPage(withAppeal({ appealState: AppealCaseState.COMPLETED }))

    expect(screen.getByRole('heading', { name: 'Samantekt' })).toBeVisible()
    expect(screen.getAllByText('Jón Jónsson').length).toBeGreaterThan(0)
    expect(screen.getByText('Dómsorð Landsréttar')).toBeInTheDocument()
    expect(screen.queryByText(notReleasedTitle)).not.toBeInTheDocument()
    expect(screen.queryByText('Niðurstaða Landsréttar')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Staðfesta' }),
    ).not.toBeInTheDocument()
    expect(screen.queryByTestId('continueButton')).not.toBeInTheDocument()
    expect(screen.getByTestId('previousButton')).toBeInTheDocument()
  })

  // A case can carry a ruling appeal as well. The info card describes the
  // verdict appeal like the rest of the page, whatever the URL names.
  it.each([AppealCaseState.READY_TO_COMPLETE, AppealCaseState.COMPLETED])(
    'shows the %s verdict appeal on the info card when the url names no appeal',
    (appealState) => {
      mockAppealCaseIdQuery = undefined

      renderPage({
        ...withAppeal({ appealState }),
        appealCase: {
          id: 'ruling-appeal',
          appealType: AppealCaseType.RULING,
          appealState: AppealCaseState.COMPLETED,
          appealCaseNumber: '100/2026',
          appealAssistant: { id: 'assistant', name: 'Aðstoðarmaður úrskurðar' },
        },
      } as unknown as WorkingCase)

      const appealNumberItem = screen.getByRole('heading', {
        name: 'Málsnúmer Landsréttar',
      }).parentElement

      if (!appealNumberItem) {
        throw new Error('The appeal number has no item on the info card')
      }

      expect(within(appealNumberItem).getByText('555/2026')).toBeInTheDocument()
      expect(screen.queryByText('100/2026')).not.toBeInTheDocument()
      expect(
        screen.queryByText('Aðstoðarmaður úrskurðar'),
      ).not.toBeInTheDocument()
      expect(
        screen.getByRole('heading', { name: 'Lyktir' }),
      ).toBeInTheDocument()
    },
  )

  it('shows no info card before the appeal is confirmed', () => {
    renderPage()

    expect(screen.queryAllByText('Jón Jónsson')).toHaveLength(0)
    expect(screen.queryByText(notReleasedTitle)).not.toBeInTheDocument()
  })

  describe('moving to another appeal', () => {
    it('does not open the document of the appeal left behind', async () => {
      let resolveUrl: (url: string) => void = () => undefined
      mockGetFileUrl.mockImplementationOnce(
        () =>
          new Promise<string>((resolve) => {
            resolveUrl = resolve
          }),
      )
      const { rerender } = renderPage()

      await userEvent.click(screen.getByTestId('continueButton'))

      expect(mockGetFileUrl).toHaveBeenCalledWith('ruling-file')
      expect(screen.getByTestId('continueButton')).toBeDisabled()

      rerender(page(otherCase))

      await screen.findByRole('heading', { level: 2, name: 'Mál nr. 556/2026' })
      await act(async () => resolveUrl('https://files.dummy.dd/domur.pdf'))

      expect(screen.queryByText(modalTitle)).not.toBeInTheDocument()
      expect(screen.queryByTestId('pdfViewer')).not.toBeInTheDocument()
      expect(screen.getByTestId('continueButton')).toBeEnabled()
    })

    it('drops the review of the appeal left behind', async () => {
      const { rerender } = renderPage()

      await openModal()
      await reviewDocument()

      expect(reviewedCheckbox()).toBeChecked()

      rerender(page(otherCase))

      await waitFor(() =>
        expect(screen.queryByText(modalTitle)).not.toBeInTheDocument(),
      )

      mockGetFileUrl.mockResolvedValue('https://files.dummy.dd/annar-domur.pdf')

      await openModal()

      expect(mockGetFileUrl).toHaveBeenLastCalledWith('other-ruling-file')
      expect(screen.getByTestId('pdfViewer')).toHaveAttribute(
        'data-file',
        'https://files.dummy.dd/annar-domur.pdf',
      )
      expect(reviewedCheckbox()).not.toBeChecked()
      expect(reviewedCheckbox()).toBeDisabled()
      expect(screen.getByTestId('confirmVerdictAppealButton')).toBeDisabled()
    })

    it('leaves the appeal on the page alone when the one left behind is confirmed', async () => {
      let finishTransition: (completed: boolean) => void = () => undefined
      mockTransitionAppealCase.mockImplementationOnce(
        (
          caseId: string,
          appealCaseId: string,
          transition: AppealCaseTransition,
          setWorkingCase: Dispatch<SetStateAction<WorkingCase>>,
        ) =>
          new Promise<boolean>((resolve) => {
            finishTransition = (completed) => {
              if (completed) {
                confirmAppeal(caseId, appealCaseId, transition, setWorkingCase)
              }

              resolve(completed)
            }
          }),
      )
      const { rerender } = renderPage()

      await openModal()
      await reviewDocument()
      await userEvent.click(screen.getByTestId('confirmVerdictAppealButton'))

      expect(mockTransitionAppealCase).toHaveBeenCalledWith(
        'case-id',
        'verdict-appeal',
        AppealCaseTransition.MARK_APPEAL_READY_TO_COMPLETE,
        expect.any(Function),
      )

      rerender(page(otherCase))

      await waitFor(() =>
        expect(screen.queryByText(modalTitle)).not.toBeInTheDocument(),
      )

      await act(async () => finishTransition(true))

      expect(screen.queryByText(notReleasedTitle)).not.toBeInTheDocument()
      expect(screen.getByTestId('continueButton')).toBeEnabled()
      expect(mockScrollTo).not.toHaveBeenCalled()
    })
  })
})
