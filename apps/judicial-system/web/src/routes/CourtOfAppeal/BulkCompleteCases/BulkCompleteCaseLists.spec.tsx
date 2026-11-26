import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'

import type { CaseTableRow } from '@island.is/judicial-system-web/src/graphql/schema'
import { CaseActionType } from '@island.is/judicial-system-web/src/graphql/schema'

import BulkCompleteCaseLists from './BulkCompleteCaseLists'

const mockHandleOpenCase = jest.fn()
const mockToastError = jest.fn()

jest.mock('motion/react', () => ({
  ...jest.requireActual('motion/react'),
  useReducedMotion: () => true,
}))

jest.mock('@island.is/judicial-system-web/src/utils/hooks/useCaseList', () => ({
  __esModule: true,
  default: () => ({
    isOpeningCaseId: null,
    isOpeningDefendantIds: null,
    isOpeningAppealCaseId: null,
    handleOpenCase: mockHandleOpenCase,
    LoadingIndicator: () => <span>Sæki</span>,
    showLoading: false,
  }),
}))

jest.mock(
  '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenuItems/OpenCaseInNewTab',
  () => ({
    useOpenCaseInNewTab: () => ({
      openCaseInNewTab: () => ({
        title: 'Opna mál í nýjum flipa',
        onClick: jest.fn(),
      }),
    }),
  }),
)

jest.mock('@island.is/judicial-system-web/src/utils/toast', () => ({
  toast: {
    error: (message: string) => mockToastError(message),
    success: jest.fn(),
  },
}))

const caseRow = (
  caseId: string,
  caseNumber: string,
  defendant: string,
): CaseTableRow => ({
  caseId,
  appealCaseId: `${caseId}-appeal`,
  defendantIds: [`${caseId}-defendant`],
  actionOnRowClick: CaseActionType.OPEN_APPEAL_CASE,
  contextMenuActions: [],
  isMyCase: false,
  cells: [
    {
      sortValue: caseNumber,
      value: { __typename: 'StringValue', str: caseNumber },
    },
    {
      sortValue: defendant,
      value: { __typename: 'StringValue', str: defendant },
    },
  ],
})

const rows = [
  caseRow('a', 'S-1/2026', 'Jón Jónsson'),
  caseRow('b', 'S-2/2026', 'Gunna Gunnarsdóttir'),
  caseRow('c', 'S-3/2026', 'Siggi Sigurðsson'),
]

const columns = [{ title: 'Málsnúmer' }, { title: 'Varnaraðili' }]

const stageLabel = (label: string) => `Velja mál ${label} til að ljúka`
const unstageLabel = (label: string) => `Taka mál ${label} af lista`

describe('BulkCompleteCaseLists', () => {
  let user: ReturnType<typeof userEvent.setup>
  let modalRoot: HTMLDivElement

  beforeEach(() => {
    modalRoot = document.createElement('div')
    modalRoot.id = 'modal'
    document.body.appendChild(modalRoot)
    user = userEvent.setup()
    window.localStorage.clear()
    mockHandleOpenCase.mockReset()
    mockToastError.mockReset()
  })

  afterEach(() => {
    modalRoot.remove()
  })

  const renderLists = (
    onComplete: (rows: CaseTableRow[]) => Promise<void> = jest.fn(
      async () => undefined,
    ),
    theRows = rows,
  ) =>
    render(
      <BulkCompleteCaseLists
        rows={theRows}
        columns={columns}
        onComplete={onComplete}
      />,
    )

  const turnOnSelection = () =>
    user.click(screen.getByLabelText('Velja mál til að ljúka'))

  const stagingHeading = () => screen.queryByText('Mál til að ljúka')

  const stage = async (label: string) =>
    user.click(screen.getByRole('button', { name: stageLabel(label) }))

  const confirmButton = () =>
    screen.getByRole('button', { name: 'Ljúka málum' })

  it('shows and hides the staging section with the toggle', async () => {
    renderLists()

    expect(stagingHeading()).not.toBeInTheDocument()

    await turnOnSelection()
    expect(stagingHeading()).toBeInTheDocument()
    expect(
      screen.getByText('Engin mál valin – smelltu á mál til að velja það'),
    ).toBeInTheDocument()

    await turnOnSelection()
    await waitFor(() => expect(stagingHeading()).not.toBeInTheDocument())
  })

  it('opens the appeal on a row click when selection is off', async () => {
    renderLists()

    await user.click(
      screen.getByRole('button', { name: 'Opna mál S-1/2026, Jón Jónsson' }),
    )

    expect(mockHandleOpenCase).toHaveBeenCalledWith(
      'a',
      false,
      ['a-defendant'],
      'a-appeal',
    )
    expect(stagingHeading()).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', {
        name: unstageLabel('S-1/2026, Jón Jónsson'),
      }),
    ).not.toBeInTheDocument()
  })

  it('moves a row to the staging list and back on click', async () => {
    renderLists()
    await turnOnSelection()

    await stage('S-2/2026, Gunna Gunnarsdóttir')

    const unstage = screen.getByRole('button', {
      name: unstageLabel('S-2/2026, Gunna Gunnarsdóttir'),
    })
    expect(
      screen.queryByRole('button', {
        name: stageLabel('S-2/2026, Gunna Gunnarsdóttir'),
      }),
    ).not.toBeInTheDocument()
    expect(mockHandleOpenCase).not.toHaveBeenCalled()

    await user.click(unstage)

    expect(
      screen.getByRole('button', {
        name: stageLabel('S-2/2026, Gunna Gunnarsdóttir'),
      }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', {
        name: unstageLabel('S-2/2026, Gunna Gunnarsdóttir'),
      }),
    ).not.toBeInTheDocument()
  })

  it('moves a row with the Enter key', async () => {
    renderLists()
    await turnOnSelection()

    screen
      .getByRole('button', { name: stageLabel('S-1/2026, Jón Jónsson') })
      .focus()
    await user.keyboard('{Enter}')

    expect(
      screen.getByRole('button', {
        name: unstageLabel('S-1/2026, Jón Jónsson'),
      }),
    ).toBeInTheDocument()
  })

  it('stages only the double-clicked row', async () => {
    renderLists()
    await turnOnSelection()

    await user.dblClick(
      screen.getByRole('button', { name: stageLabel('S-1/2026, Jón Jónsson') }),
    )

    expect(
      screen
        .getAllByRole('button', { name: /^Taka mál/ })
        .map((r) => r.getAttribute('aria-label')),
    ).toEqual([unstageLabel('S-1/2026, Jón Jónsson')])
    expect(screen.getAllByRole('button', { name: /^Velja mál/ })).toHaveLength(
      2,
    )
  })

  it('ignores the second click of a double click that lands on another row', async () => {
    renderLists()
    await turnOnSelection()

    // The row that slides up under the pointer after the first click.
    fireEvent.click(
      screen.getByRole('button', {
        name: stageLabel('S-2/2026, Gunna Gunnarsdóttir'),
      }),
      { detail: 2 },
    )

    expect(
      screen.queryByRole('button', { name: /^Taka mál/ }),
    ).not.toBeInTheDocument()
  })

  it('clears the staged cases when selection is switched off', async () => {
    renderLists()
    await turnOnSelection()
    await stage('S-1/2026, Jón Jónsson')

    await turnOnSelection()
    await waitFor(() => expect(stagingHeading()).not.toBeInTheDocument())
    await turnOnSelection()

    expect(
      screen.getByText('Engin mál valin – smelltu á mál til að velja það'),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Velja mál/ })).toHaveLength(
      3,
    )
  })

  it('disables the complete button while nothing is staged', async () => {
    renderLists()
    await turnOnSelection()

    // A text button marks itself disabled with aria-disabled.
    expect(confirmButton()).toHaveAttribute('aria-disabled', 'true')

    await stage('S-1/2026, Jón Jónsson')
    expect(confirmButton()).not.toHaveAttribute('aria-disabled', 'true')
  })

  it('names one staged case in the confirm modal', async () => {
    renderLists()
    await turnOnSelection()
    await stage('S-1/2026, Jón Jónsson')

    await user.click(confirmButton())

    const modal = screen.getByRole('dialog')
    expect(within(modal).getByText('Viltu ljúka málunum?')).toBeInTheDocument()
    expect(
      within(modal).getByText('Áfrýjun verður lokið í 1 máli: S-1/2026.'),
    ).toBeInTheDocument()
  })

  it('names the staged cases in staged order in the confirm modal', async () => {
    renderLists()
    await turnOnSelection()
    await stage('S-3/2026, Siggi Sigurðsson')
    await stage('S-1/2026, Jón Jónsson')

    await user.click(confirmButton())

    expect(
      screen.getByText('Áfrýjun verður lokið í 2 málum: S-3/2026 og S-1/2026.'),
    ).toBeInTheDocument()
  })

  it('completes the staged cases once even when confirmed twice', async () => {
    let resolveComplete: () => void = () => undefined
    const onComplete = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveComplete = resolve
        }),
    )
    renderLists(onComplete)
    await turnOnSelection()
    await stage('S-2/2026, Gunna Gunnarsdóttir')
    await user.click(confirmButton())

    const primary = screen.getByRole('button', { name: /Já, ljúka málum/ })
    await user.click(primary)
    // The button is disabled by now; the second click is pressed through it.
    await userEvent
      .setup({ pointerEventsCheck: PointerEventsCheckLevel.Never })
      .click(primary)

    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith([rows[1]])

    resolveComplete()

    expect(await screen.findByText('Málunum er lokið')).toBeInTheDocument()
  })

  it('keeps the cases staged and shows an error when completing fails', async () => {
    const onComplete = jest.fn(async () => {
      throw new Error('Villa')
    })
    renderLists(onComplete)
    await turnOnSelection()
    await stage('S-1/2026, Jón Jónsson')
    await user.click(confirmButton())

    await user.click(screen.getByRole('button', { name: 'Já, ljúka málum' }))

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
    expect(mockToastError).toHaveBeenCalledTimes(1)
    expect(
      screen.getByRole('button', {
        name: unstageLabel('S-1/2026, Jón Jónsson'),
      }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Málunum er lokið')).not.toBeInTheDocument()
  })

  it('shows the success modal and clears staging when it is closed', async () => {
    renderLists()
    await turnOnSelection()
    await stage('S-1/2026, Jón Jónsson')
    await stage('S-2/2026, Gunna Gunnarsdóttir')
    await user.click(confirmButton())

    await user.click(screen.getByRole('button', { name: 'Já, ljúka málum' }))

    expect(await screen.findByText('Málunum er lokið')).toBeInTheDocument()
    expect(
      screen.getByText('Áfrýjun er lokið í 2 málum: S-1/2026 og S-2/2026.'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Loka' }))

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
    await waitFor(() => expect(stagingHeading()).not.toBeInTheDocument())
    expect(screen.getByLabelText('Velja mál til að ljúka')).not.toBeChecked()
    expect(
      screen.getAllByRole('button', { name: /^Opna mál S-/ }),
    ).toHaveLength(3)
  })

  it('shows that no cases were found and no toggle when there are no rows', () => {
    renderLists(undefined, [])

    expect(screen.getByText('Engin mál fundust')).toBeInTheDocument()
    expect(
      screen.queryByLabelText('Velja mál til að ljúka'),
    ).not.toBeInTheDocument()
  })
})
