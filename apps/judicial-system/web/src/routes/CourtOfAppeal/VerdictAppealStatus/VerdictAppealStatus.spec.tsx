import type { FC, PropsWithChildren } from 'react'
import { useState } from 'react'
import addDays from 'date-fns/addDays'
import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { FileUploadStatus } from '@island.is/island-ui/core'
import {
  COURT_OF_APPEAL_VERDICT_APPEAL_STATEMENT_DEADLINES_ROUTE,
  COURT_OF_APPEAL_VERDICT_APPEAL_SUMMARY_ROUTE,
} from '@island.is/judicial-system/consts'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseRulingDecision,
  AppealCaseState,
  AppealCaseType,
  AppealCourtSessionType,
  AppealRulingType,
  CaseFileCategory,
  CaseState,
  CaseType,
  UserRole,
  VerdictAppealStatus as Status,
} from '@island.is/judicial-system-web/src/graphql/schema'
import type { TUploadFile } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  mockCase,
  mockCaseFile,
} from '@island.is/judicial-system-web/src/utils/mocks'
import {
  ApolloProviderWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import VerdictAppealStatus from './VerdictAppealStatus'

const mockPush = jest.fn()
const mockCreateAppealCourtSession = jest.fn()
const mockUpdateAppealCourtSession = jest.fn()
const mockDeleteAppealCourtSession = jest.fn()
const mockUpdateAppealCase = jest.fn()
let mockIsUpdatingAppealCase = false
const mockHandleUpload = jest.fn()
const mockHandleRemove = jest.fn()

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useAppealCase',
  () => ({
    __esModule: true,
    default: () => ({
      updateAppealCase: mockUpdateAppealCase,
      isUpdatingAppealCase: mockIsUpdatingAppealCase,
    }),
  }),
)

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useAppealCourtSession',
  () => ({
    __esModule: true,
    default: () => ({
      createAppealCourtSession: mockCreateAppealCourtSession,
      isCreatingAppealCourtSession: false,
      updateAppealCourtSession: mockUpdateAppealCourtSession,
      isUpdatingAppealCourtSession: false,
      deleteAppealCourtSession: mockDeleteAppealCourtSession,
      isDeletingAppealCourtSession: false,
    }),
  }),
)

// The upload list is real; only the trip to storage is mocked.
jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useS3Upload/useS3Upload',
  () => ({
    ...jest.requireActual(
      '@island.is/judicial-system-web/src/utils/hooks/useS3Upload/useS3Upload',
    ),
    __esModule: true,
    default: () => ({
      handleUpload: mockHandleUpload,
      handleRemove: mockHandleRemove,
      handleRetry: jest.fn(),
    }),
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

const theCase = {
  ...mockCase(CaseType.INDICTMENT),
  id: 'case-id',
  state: CaseState.COMPLETED,
  courtCaseNumber: 'S-123/2026',
  defendants: [
    {
      id: 'd1',
      name: 'Jón Jónsson',
      verdict: { appealDate: '2026-06-04T10:00:00.000Z' },
      // The stepper only offers the steps after the defender step once every
      // advocate is confirmed, as the court will have done to get here.
      isAppealDefenderConfirmed: true,
    },
  ],
  verdictAppealCase: {
    id: 'verdict-appeal',
    appealState: AppealCaseState.RECEIVED,
    appealType: AppealCaseType.VERDICT,
    appealCaseNumber: '555/2026',
  },
} as unknown as WorkingCase

const bookedSession = {
  id: 'session-1',
  sessionType: AppealCourtSessionType.MAIN_HEARING,
  sessionDate: new Date(2026, 11, 12, 14, 0).toISOString(),
  courtRoom: '1',
}

const caseWithBookedSession = {
  ...theCase,
  verdictAppealCase: {
    ...theCase.verdictAppealCase,
    courtSessions: [bookedSession],
  },
} as unknown as WorkingCase

// An appeal the court has marked as finished, with how it ended on record.
const finishedCase = {
  ...theCase,
  caseFiles: [
    {
      ...mockCaseFile(CaseFileCategory.VERDICT_APPEAL_RULING),
      name: 'domur-landsrettar.pdf',
    },
  ],
  verdictAppealCase: {
    ...theCase.verdictAppealCase,
    verdictAppealStatus: Status.COMPLETED,
    appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
    appealRulingType: AppealRulingType.VERDICT,
    appealConclusion: 'Hinn áfrýjaði dómur skal vera óraskaður.',
  },
} as unknown as WorkingCase

// Everything about how the appeal ended is on record but the document.
const finishedCaseWithoutDocument = {
  ...finishedCase,
  caseFiles: [],
} as unknown as WorkingCase

// Stores each file the way a successful upload does: done, under the id the
// server gave it.
const uploadSucceeds = async (
  files: TUploadFile[],
  updateFile: (file: TUploadFile, newId?: string) => void,
) => {
  for (const file of files) {
    updateFile(
      {
        ...file,
        key: `uploads/${file.name}`,
        percent: 100,
        status: FileUploadStatus.done,
      },
      `stored-${file.name}`,
    )
  }

  return 'ALL_SUCCEEDED'
}

const removeSucceeds = async (
  file: TUploadFile,
  callback?: (file: TUploadFile) => void,
) => callback?.(file)

const chooseRulingDocument = async (container: HTMLElement) => {
  const input = container.querySelector('input[name="verdict-appeal-ruling"]')

  if (!(input instanceof HTMLInputElement)) {
    throw new Error('No ruling document input')
  }

  await userEvent.upload(
    input,
    new File(['%PDF'], 'nyr-domur.pdf', { type: 'application/pdf' }),
  )
}

// Picks another status, waits for the form to fold away, and comes back.
const leaveAndReturnToFinished = async () => {
  await userEvent.click(screen.getByLabelText('Dómtekið'))
  await waitFor(() =>
    expect(
      screen.queryByRole('group', { name: 'Lyktir' }),
    ).not.toBeInTheDocument(),
  )
  await userEvent.click(screen.getByLabelText('Lokið'))
  expect(
    await screen.findByRole('group', { name: 'Lyktir' }),
  ).toBeInTheDocument()
}

// Holds the case in state, unlike the shared wrapper, so what the page writes
// back after booking, changing or cancelling a session shows in the list.
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
            <VerdictAppealStatus />
          </StatefulFormContext>
        </UserContextWrapper>
      </ApolloProviderWrapper>
    </IntlProviderWrapper>,
  )

// The menu item's role sits on the list item; what reacts is the button in it.
const clickMenuItem = async (name: string) =>
  userEvent.click(
    within(await screen.findByRole('menuitem', { name })).getByRole('button'),
  )

// Tomorrow rather than a fixed day: the picker refuses dates in the past.
const pickTomorrow = async () => {
  const today = new Date()
  const tomorrow = addDays(today, 1)

  await userEvent.click(screen.getByLabelText(/Dagsetning/))

  if (tomorrow.getMonth() !== today.getMonth()) {
    await userEvent.click(screen.getByLabelText('Next month'))
  }

  // The calendar pads its grid with the neighbouring months' days, so the
  // number alone can match twice. Only a cell of the month on view counts.
  const cell = screen
    .getAllByText(String(tomorrow.getDate()))
    .find(
      (el) =>
        el.className.includes('react-datepicker__day') &&
        !el.className.includes('outside-month'),
    )

  if (!cell) {
    throw new Error('No calendar cell for tomorrow')
  }

  await userEvent.click(cell)
}

const fillInSession = async () => {
  await userEvent.click(screen.getByLabelText('Boða til þinghalds'))
  await userEvent.click(screen.getByText('Veldu tegund þinghalds'))
  await userEvent.click(screen.getByText('Aðalmeðferð'))
  await pickTomorrow()
  await userEvent.type(
    screen.getByTestId('appeal-court-session-date-time'),
    '14:00',
  )
  await userEvent.type(screen.getByLabelText(/Dómsalur/), '1')
}

describe('VerdictAppealStatus', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockCreateAppealCourtSession.mockReset()
    mockUpdateAppealCourtSession.mockReset()
    mockDeleteAppealCourtSession.mockReset()
    mockUpdateAppealCase.mockReset()
    mockIsUpdatingAppealCase = false
    mockUpdateAppealCase.mockResolvedValue({ id: 'verdict-appeal' })
    mockHandleUpload.mockReset()
    mockHandleUpload.mockImplementation(uploadSucceeds)
    mockHandleRemove.mockReset()
    mockHandleRemove.mockImplementation(removeSucceeds)
  })

  it('names the case and who appealed', () => {
    renderPage()

    expect(
      screen.getByText('Málsnr. héraðsdóms S-123/2026'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Dómfelldi áfrýjaði 4. júní 2026'),
    ).toBeInTheDocument()
  })

  it('offers every status as one group of radios', () => {
    renderPage()

    const group = screen.getByRole('group', { name: 'Staða' })

    expect(group).toBeInTheDocument()
    expect(
      screen.getAllByRole('radio').map((r) => r.getAttribute('id')),
    ).toEqual([
      'verdict-appeal-status-STATEMENT_DEADLINE_GRANTED',
      'verdict-appeal-status-COURT_SESSION_SCHEDULED',
      'verdict-appeal-status-POSTPONED',
      'verdict-appeal-status-UNDER_ADVISEMENT',
      'verdict-appeal-status-COMPLETED',
    ])
  })

  // The booking form is only about one of the statuses, so it stays out of
  // the way until that one is chosen.
  it('shows the session form only when the court is calling a session', async () => {
    renderPage()

    expect(
      screen.queryByRole('heading', { name: 'Boða til þinghalds' }),
    ).not.toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Boða til þinghalds'))

    expect(
      screen.getByRole('heading', { name: 'Boða til þinghalds' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Tegund þinghalds')).toBeInTheDocument()
    expect(screen.getByLabelText(/Dagsetning/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Tímasetning/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Dómsalur/)).toBeInTheDocument()

    await userEvent.click(screen.getByLabelText('Lokið'))

    // The section animates out, so it leaves the document a moment later.
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Boða til þinghalds' }),
      ).not.toBeInTheDocument(),
    )
  })

  it('opens on the status the court saved', () => {
    renderPage({
      ...caseWithBookedSession,
      verdictAppealCase: {
        ...caseWithBookedSession.verdictAppealCase,
        verdictAppealStatus: Status.UNDER_ADVISEMENT,
      },
    } as unknown as WorkingCase)

    expect(screen.getByLabelText('Dómtekið')).toBeChecked()
    expect(screen.getByTestId('continueButton')).toBeEnabled()
  })

  // The choice is held on the page until the court moves on, the way the
  // district court's decision is.
  it('saves the chosen status when the court continues, not when it is chosen', async () => {
    renderPage()

    await userEvent.click(screen.getByLabelText('Dómtekið'))

    expect(mockUpdateAppealCase).not.toHaveBeenCalled()

    await userEvent.click(screen.getByTestId('continueButton'))

    expect(mockUpdateAppealCase).toHaveBeenCalledWith(
      'case-id',
      'verdict-appeal',
      { verdictAppealStatus: Status.UNDER_ADVISEMENT },
    )
    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        `${COURT_OF_APPEAL_VERDICT_APPEAL_SUMMARY_ROUTE}/case-id?appealCaseId=verdict-appeal`,
      ),
    )
  })

  // A choice made while the save is under way would be left behind: the
  // earlier one is stored and the page moves on.
  it('holds the choice still while the status is being saved', () => {
    mockIsUpdatingAppealCase = true

    renderPage()

    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeDisabled()
    }
  })

  // The save is over before the next page has opened, and a choice made in
  // between would be left behind just the same.
  it('holds the choice still until the next page has opened', async () => {
    let finishNavigation: (navigated: boolean) => void = () => undefined
    mockPush.mockImplementationOnce(
      () =>
        new Promise<boolean>((resolve) => {
          finishNavigation = resolve
        }),
    )
    renderPage()

    await userEvent.click(screen.getByLabelText('Dómtekið'))
    await userEvent.click(screen.getByTestId('continueButton'))

    await waitFor(() => expect(mockPush).toHaveBeenCalled())

    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeDisabled()
    }
    expect(screen.getByTestId('continueButton')).toBeDisabled()

    // Navigation that came to nothing gives the page back to the court.
    await act(async () => finishNavigation(false))

    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeEnabled()
    }
  })

  // Nothing disables the stepper, so a second step picked while the first
  // leave is on its way must not start another save or navigation.
  it('ignores a second stepper choice while it is already leaving', async () => {
    let finishNavigation: (navigated: boolean) => void = () => undefined
    mockPush.mockImplementationOnce(
      () =>
        new Promise<boolean>((resolve) => {
          finishNavigation = resolve
        }),
    )
    renderPage()

    await userEvent.click(screen.getByLabelText('Frestun'))
    await userEvent.click(screen.getByRole('button', { name: 'Verjandi' }))
    await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1))

    await userEvent.click(screen.getByRole('button', { name: 'Verjandi' }))

    expect(mockPush).toHaveBeenCalledTimes(1)
    expect(mockUpdateAppealCase).toHaveBeenCalledTimes(1)

    await act(async () => finishNavigation(true))
  })

  it('stays on the page when the status could not be saved', async () => {
    mockUpdateAppealCase.mockResolvedValue(undefined)
    renderPage()

    await userEvent.click(screen.getByLabelText('Dómtekið'))
    await userEvent.click(screen.getByTestId('continueButton'))

    await waitFor(() => expect(mockUpdateAppealCase).toHaveBeenCalled())
    expect(mockPush).not.toHaveBeenCalled()

    await waitFor(() => expect(screen.getByLabelText('Dómtekið')).toBeEnabled())
  })

  it('writes nothing when the saved status is left as it is', async () => {
    renderPage({
      ...theCase,
      verdictAppealCase: {
        ...theCase.verdictAppealCase,
        verdictAppealStatus: Status.POSTPONED,
      },
    } as unknown as WorkingCase)

    await userEvent.click(screen.getByTestId('continueButton'))

    await waitFor(() => expect(mockPush).toHaveBeenCalled())
    expect(mockUpdateAppealCase).not.toHaveBeenCalled()
  })

  // The stepper is another way off the page, and a status the court has
  // settled on goes with it.
  it('saves a settled status when the stepper leads to another step', async () => {
    renderPage()

    await userEvent.click(screen.getByLabelText('Frestun'))
    await userEvent.click(screen.getByRole('button', { name: 'Verjandi' }))

    expect(mockUpdateAppealCase).toHaveBeenCalledWith(
      'case-id',
      'verdict-appeal',
      { verdictAppealStatus: Status.POSTPONED },
    )
    await waitFor(() => expect(mockPush).toHaveBeenCalled())
  })

  // An appeal from before the status was kept has none, so a booked session
  // is what says the court chose to call one. Opening the page reads that
  // back.
  it('opens on the session status with the booked session listed', () => {
    renderPage(caseWithBookedSession)

    expect(screen.getByLabelText('Boða til þinghalds')).toBeChecked()
    expect(screen.getByText('Aðalmeðferð')).toBeInTheDocument()
    expect(
      screen.getByText('12.12.2026 kl. 14:00 · Dómsalur 1'),
    ).toBeInTheDocument()
  })

  it('continues straight to the summary when there is nothing to book', async () => {
    renderPage(caseWithBookedSession)

    await userEvent.click(screen.getByTestId('continueButton'))

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        `${COURT_OF_APPEAL_VERDICT_APPEAL_SUMMARY_ROUTE}/case-id?appealCaseId=verdict-appeal`,
      ),
    )
    expect(mockCreateAppealCourtSession).not.toHaveBeenCalled()
    // The status read off the booked session is saved on the way.
    expect(mockUpdateAppealCase).toHaveBeenCalledWith(
      'case-id',
      'verdict-appeal',
      { verdictAppealStatus: Status.COURT_SESSION_SCHEDULED },
    )
  })

  // The stepper offers the summary as soon as the form is complete, and it
  // calls the page's navigation handler straight. It must not be a way
  // around the booking the continue button asks for.
  it('books a filled-in session before the summary opens, from the stepper too', async () => {
    mockCreateAppealCourtSession.mockResolvedValue(bookedSession)
    renderPage()

    await fillInSession()
    await userEvent.click(screen.getByRole('button', { name: 'Samantekt' }))

    expect(screen.getByText('Boða til þinghalds?')).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()

    await userEvent.click(screen.getByTestId('confirmSessionButton'))

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        `${COURT_OF_APPEAL_VERDICT_APPEAL_SUMMARY_ROUTE}/case-id?appealCaseId=verdict-appeal`,
      ),
    )
    expect(mockCreateAppealCourtSession).toHaveBeenCalledWith(
      expect.objectContaining({
        caseId: 'case-id',
        appealCaseId: 'verdict-appeal',
        sessionType: AppealCourtSessionType.MAIN_HEARING,
        courtRoom: '1',
      }),
    )
    // Saved after the session it stands on.
    expect(mockUpdateAppealCase).toHaveBeenCalledWith(
      'case-id',
      'verdict-appeal',
      { verdictAppealStatus: Status.COURT_SESSION_SCHEDULED },
    )
    expect(
      mockCreateAppealCourtSession.mock.invocationCallOrder[0],
    ).toBeLessThan(mockUpdateAppealCase.mock.invocationCallOrder[0])
  })

  // The list reads earliest session first, so one booked for tomorrow goes
  // above a session already called for later, wherever it was appended.
  it('lists a session it has just booked by its date', async () => {
    const tomorrow = addDays(new Date(), 1)
    const laterSession = {
      id: 'session-later',
      sessionType: AppealCourtSessionType.PREPARATORY_HEARING,
      sessionDate: addDays(tomorrow, 30).toISOString(),
      courtRoom: '2',
    }
    mockCreateAppealCourtSession.mockResolvedValue({
      ...bookedSession,
      sessionDate: tomorrow.toISOString(),
    })
    renderPage({
      ...theCase,
      verdictAppealCase: {
        ...theCase.verdictAppealCase,
        courtSessions: [laterSession],
      },
    } as unknown as WorkingCase)

    await fillInSession()
    await userEvent.click(screen.getByTestId('continueButton'))
    await userEvent.click(screen.getByTestId('confirmSessionButton'))

    await waitFor(() =>
      expect(
        within(
          screen.getByRole('list', { name: 'Bókuð þinghöld' }),
        ).getAllByRole('listitem'),
      ).toHaveLength(2),
    )
    const [first, second] = within(
      screen.getByRole('list', { name: 'Bókuð þinghöld' }),
    ).getAllByRole('listitem')
    expect(first).toHaveTextContent('Aðalmeðferð')
    expect(second).toHaveTextContent('Undirbúningsþinghald')
  })

  it('cannot continue before a status is chosen', () => {
    renderPage()

    expect(screen.getByTestId('continueButton')).toBeDisabled()
  })

  it('leads back to the deadlines step with the appeal id', async () => {
    renderPage()

    await userEvent.click(screen.getByTestId('previousButton'))

    expect(mockPush).toHaveBeenCalledWith(
      `${COURT_OF_APPEAL_VERDICT_APPEAL_STATEMENT_DEADLINES_ROUTE}/case-id?appealCaseId=verdict-appeal`,
    )
  })

  describe('a finished appeal', () => {
    it('asks how the appeal ended only once the court says it is finished', async () => {
      renderPage()

      expect(
        screen.queryByRole('group', { name: 'Lyktir' }),
      ).not.toBeInTheDocument()

      await userEvent.click(screen.getByLabelText('Lokið'))

      expect(
        await screen.findByRole('group', { name: 'Lyktir' }),
      ).toBeInTheDocument()

      await userEvent.click(screen.getByLabelText('Dómtekið'))

      await waitFor(() =>
        expect(
          screen.queryByRole('group', { name: 'Lyktir' }),
        ).not.toBeInTheDocument(),
      )
    })

    it('holds the court on the page until how it ended is on record', async () => {
      renderPage()

      await userEvent.click(screen.getByLabelText('Lokið'))

      expect(screen.getByTestId('continueButton')).toBeDisabled()

      // Leaving it for another status lets the court go again.
      await userEvent.click(screen.getByLabelText('Dómtekið'))

      expect(screen.getByTestId('continueButton')).toBeEnabled()
    })

    it('opens on what the court recorded and lets it continue', async () => {
      renderPage(finishedCase)

      expect(screen.getByLabelText('Lokið')).toBeChecked()
      expect(screen.getByLabelText('Staðfesting')).toBeChecked()
      expect(screen.getByLabelText('Dómur')).toBeChecked()
      expect(screen.getByText('domur-landsrettar.pdf')).toBeInTheDocument()

      await waitFor(() =>
        expect(screen.getByTestId('continueButton')).toBeEnabled(),
      )

      await userEvent.click(screen.getByTestId('continueButton'))

      // The status was already saved, so the court just moves on.
      expect(mockUpdateAppealCase).not.toHaveBeenCalled()
      await waitFor(() =>
        expect(mockPush).toHaveBeenCalledWith(
          `${COURT_OF_APPEAL_VERDICT_APPEAL_SUMMARY_ROUTE}/case-id?appealCaseId=verdict-appeal`,
        ),
      )
    })

    it('saves the outcome when it is picked and the status when the court continues', async () => {
      renderPage({
        ...finishedCase,
        verdictAppealCase: {
          ...finishedCase.verdictAppealCase,
          verdictAppealStatus: Status.UNDER_ADVISEMENT,
          appealRulingDecision: null,
          appealRulingType: null,
        },
      } as unknown as WorkingCase)

      await userEvent.click(screen.getByLabelText('Lokið'))
      await userEvent.click(await screen.findByLabelText('Staðfesting'))

      expect(mockUpdateAppealCase).toHaveBeenCalledWith(
        'case-id',
        'verdict-appeal',
        {
          appealRulingDecision: AppealCaseRulingDecision.ACCEPTING,
          appealRulingType: AppealRulingType.VERDICT,
        },
      )

      await waitFor(() =>
        expect(screen.getByTestId('continueButton')).toBeEnabled(),
      )
      await userEvent.click(screen.getByTestId('continueButton'))

      expect(mockUpdateAppealCase).toHaveBeenLastCalledWith(
        'case-id',
        'verdict-appeal',
        { verdictAppealStatus: Status.COMPLETED },
      )
    })

    it('lets the court continue with an outcome, a type, the words and the document', async () => {
      renderPage(finishedCase)

      await waitFor(() =>
        expect(screen.getByTestId('continueButton')).toBeEnabled(),
      )
    })

    it('holds the court on the page without the document', () => {
      renderPage(finishedCaseWithoutDocument)

      expect(screen.getByTestId('continueButton')).toBeDisabled()
    })

    it('holds the court on the page without the concluding words', () => {
      renderPage({
        ...finishedCase,
        verdictAppealCase: {
          ...finishedCase.verdictAppealCase,
          appealConclusion: null,
        },
      } as unknown as WorkingCase)

      expect(screen.getByTestId('continueButton')).toBeDisabled()
    })

    // A ruling appeal on the same case keeps its ruling in a category of its
    // own, and it has no place among this appeal's documents.
    it('lists only the verdict appeal document', () => {
      renderPage({
        ...finishedCase,
        caseFiles: [
          {
            ...mockCaseFile(CaseFileCategory.APPEAL_RULING),
            name: 'urskurdur-kaera.pdf',
          },
        ],
      } as unknown as WorkingCase)

      expect(screen.queryByText('urskurdur-kaera.pdf')).not.toBeInTheDocument()
      expect(screen.getByTestId('continueButton')).toBeDisabled()
    })

    it('keeps a document it has uploaded when the court picks another status and comes back', async () => {
      const { container } = renderPage(finishedCaseWithoutDocument)

      await chooseRulingDocument(container)

      expect(mockHandleUpload).toHaveBeenCalledWith(
        [
          expect.objectContaining({
            name: 'nyr-domur.pdf',
            category: CaseFileCategory.VERDICT_APPEAL_RULING,
          }),
        ],
        expect.any(Function),
      )
      expect(await screen.findByText('nyr-domur.pdf')).toBeInTheDocument()
      await waitFor(() =>
        expect(screen.getByTestId('continueButton')).toBeEnabled(),
      )

      await leaveAndReturnToFinished()

      expect(screen.getByText('nyr-domur.pdf')).toBeInTheDocument()
      expect(screen.getByTestId('continueButton')).toBeEnabled()
    })

    it('keeps a document it has removed away when the court picks another status and comes back', async () => {
      renderPage(finishedCase)

      await userEvent.click(
        screen.getByRole('button', { name: 'Fjarlægja skrá' }),
      )

      expect(mockHandleRemove).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'domur-landsrettar.pdf' }),
        expect.any(Function),
      )
      await waitFor(() =>
        expect(
          screen.queryByText('domur-landsrettar.pdf'),
        ).not.toBeInTheDocument(),
      )
      expect(screen.getByTestId('continueButton')).toBeDisabled()

      await leaveAndReturnToFinished()

      expect(
        screen.queryByText('domur-landsrettar.pdf'),
      ).not.toBeInTheDocument()
      expect(screen.getByTestId('continueButton')).toBeDisabled()
    })
  })

  describe('a booked session', () => {
    const openMenu = async () => {
      await userEvent.click(
        screen.getByRole('button', { name: /^Valmynd fyrir Aðalmeðferð/ }),
      )
    }

    it('can be changed or cancelled from its menu', async () => {
      renderPage(caseWithBookedSession)

      await openMenu()

      expect(
        (await screen.findAllByRole('menuitem')).map(
          (item) => item.textContent,
        ),
      ).toEqual(['Breyta þinghaldi', 'Eyða þinghaldi'])
    })

    // Changing a session takes over the form and the footer: the form holds
    // the session, the row says so, and the footer saves or gives up instead
    // of continuing.
    it('is held in the form while it is changed, until the court gives up', async () => {
      renderPage(caseWithBookedSession)

      await openMenu()
      await clickMenuItem('Breyta þinghaldi')

      expect(
        await screen.findByRole('heading', { name: 'Breyta þinghaldi' }),
      ).toBeInTheDocument()
      expect(screen.getByText('Verið að breyta')).toBeInTheDocument()
      expect(screen.getByLabelText(/Dómsalur/)).toHaveValue('1')
      expect(
        screen.getByRole('button', { name: 'Hætta við' }),
      ).toBeInTheDocument()
      expect(screen.getByTestId('saveChangesButton')).toBeEnabled()
      expect(screen.queryByTestId('continueButton')).not.toBeInTheDocument()

      await userEvent.click(screen.getByRole('button', { name: 'Hætta við' }))

      expect(
        await screen.findByRole('heading', { name: 'Boða til þinghalds' }),
      ).toBeInTheDocument()
      await waitFor(() =>
        expect(screen.queryByText('Verið að breyta')).not.toBeInTheDocument(),
      )
      expect(screen.getByLabelText(/Dómsalur/)).toHaveValue('')
      expect(screen.getByTestId('continueButton')).toBeInTheDocument()
    })

    it('is let go of when the court picks another status', async () => {
      renderPage(caseWithBookedSession)

      await openMenu()
      await clickMenuItem('Breyta þinghaldi')
      expect(await screen.findByText('Verið að breyta')).toBeInTheDocument()

      await userEvent.click(screen.getByLabelText('Dómtekið'))

      expect(
        screen.queryByRole('button', { name: 'Hætta við' }),
      ).not.toBeInTheDocument()
      expect(screen.queryByTestId('saveChangesButton')).not.toBeInTheDocument()
      expect(screen.getByTestId('continueButton')).toBeEnabled()

      await userEvent.click(screen.getByLabelText('Boða til þinghalds'))

      expect(
        await screen.findByRole('heading', { name: 'Boða til þinghalds' }),
      ).toBeInTheDocument()
      await waitFor(() =>
        expect(screen.queryByText('Verið að breyta')).not.toBeInTheDocument(),
      )
      expect(screen.getByLabelText(/Dómsalur/)).toHaveValue('')
    })

    it('is saved with its changes once the court confirms', async () => {
      const updated = { ...bookedSession, courtRoom: '2' }
      mockUpdateAppealCourtSession.mockResolvedValue(updated)
      renderPage(caseWithBookedSession)

      await openMenu()
      await clickMenuItem('Breyta þinghaldi')
      await userEvent.clear(screen.getByLabelText(/Dómsalur/))
      await userEvent.type(screen.getByLabelText(/Dómsalur/), '2')
      await userEvent.click(screen.getByTestId('saveChangesButton'))

      expect(
        screen.getByRole('heading', { name: 'Boða til þinghalds?' }),
      ).toBeInTheDocument()

      await userEvent.click(screen.getByTestId('confirmChangesButton'))

      expect(mockUpdateAppealCourtSession).toHaveBeenCalledWith({
        caseId: 'case-id',
        appealCaseId: 'verdict-appeal',
        appealCourtSessionId: 'session-1',
        sessionType: AppealCourtSessionType.MAIN_HEARING,
        sessionDate: bookedSession.sessionDate,
        courtRoom: '2',
      })
      await waitFor(() =>
        expect(
          screen.getByText('12.12.2026 kl. 14:00 · Dómsalur 2'),
        ).toBeInTheDocument(),
      )
      await waitFor(() =>
        expect(screen.queryByText('Verið að breyta')).not.toBeInTheDocument(),
      )
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('is cancelled once the court confirms', async () => {
      mockDeleteAppealCourtSession.mockResolvedValue(true)
      renderPage(caseWithBookedSession)

      await openMenu()
      await clickMenuItem('Eyða þinghaldi')

      expect(
        screen.getByRole('heading', { name: 'Eyða þinghaldi?' }),
      ).toBeInTheDocument()
      expect(mockDeleteAppealCourtSession).not.toHaveBeenCalled()

      await userEvent.click(screen.getByTestId('confirmDeleteSessionButton'))

      expect(mockDeleteAppealCourtSession).toHaveBeenCalledWith({
        caseId: 'case-id',
        appealCaseId: 'verdict-appeal',
        appealCourtSessionId: 'session-1',
      })
      await waitFor(() =>
        expect(
          screen.queryByText('12.12.2026 kl. 14:00 · Dómsalur 1'),
        ).not.toBeInTheDocument(),
      )
      // The form stays where it was, rather than folding away now that no
      // session says the court is calling one.
      expect(screen.getByLabelText('Boða til þinghalds')).toBeChecked()
      expect(
        screen.getByRole('heading', { name: 'Boða til þinghalds' }),
      ).toBeInTheDocument()
    })

    it('stays booked when the court thinks better of cancelling it', async () => {
      renderPage(caseWithBookedSession)

      await openMenu()
      await clickMenuItem('Eyða þinghaldi')
      await userEvent.click(screen.getByRole('button', { name: 'Hætta við' }))

      await waitFor(() =>
        expect(
          screen.queryByRole('heading', { name: 'Eyða þinghaldi?' }),
        ).not.toBeInTheDocument(),
      )
      expect(mockDeleteAppealCourtSession).not.toHaveBeenCalled()
      expect(
        screen.getByText('12.12.2026 kl. 14:00 · Dómsalur 1'),
      ).toBeInTheDocument()
    })
  })
})
