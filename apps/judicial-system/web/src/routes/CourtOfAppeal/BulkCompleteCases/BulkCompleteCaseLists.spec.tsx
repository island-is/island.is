import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'

import * as tableStyles from '@island.is/judicial-system-web/src/components/Table/Table.css'
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
  appealCaseId = `${caseId}-appeal`,
): CaseTableRow => ({
  caseId,
  appealCaseId,
  defendantIds: [`${caseId}-defendant`],
  actionOnRowClick: CaseActionType.OPEN_APPEAL_CASE,
  contextMenuActions: [],
  isMyCase: false,
  cells: [
    // Sort values differ from the text shown, as a padded case number does.
    {
      sortValue: `sort-${caseNumber}`,
      value: { __typename: 'StringValue', str: caseNumber },
    },
    {
      sortValue: defendant.toLowerCase(),
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

  it('shows the staging columns without sort buttons while nothing is staged', async () => {
    const { container } = renderLists()
    await turnOnSelection()

    const [stagingTable, sourceTable] = Array.from(
      container.querySelectorAll('table'),
    )
    expect(
      within(stagingTable).getAllByRole('columnheader', { hidden: true }),
    ).toHaveLength(columns.length + 1)
    expect(
      within(stagingTable).getByText('Málsnúmer', { ignore: 'button *' }),
    ).toBeInTheDocument()
    expect(
      within(stagingTable).queryByRole('button', { name: /Raða eftir dálki/ }),
    ).not.toBeInTheDocument()
    expect(
      within(sourceTable).getAllByRole('button', { name: /Raða eftir dálki/ }),
    ).toHaveLength(columns.length)
    expect(
      screen.getByText('Engin mál valin – smelltu á mál til að velja það'),
    ).toBeInTheDocument()

    await stage('S-1/2026, Jón Jónsson')

    expect(container.querySelector('table')).toBe(stagingTable)
    expect(
      within(stagingTable).getAllByRole('button', { name: /Raða eftir dálki/ }),
    ).toHaveLength(columns.length)
    expect(
      screen.queryByText('Engin mál valin – smelltu á mál til að velja það'),
    ).not.toBeInTheDocument()
  })

  it('shows that all cases are selected when every row is staged', async () => {
    const { container } = renderLists()
    await turnOnSelection()

    await stage('S-1/2026, Jón Jónsson')
    await stage('S-2/2026, Gunna Gunnarsdóttir')
    await stage('S-3/2026, Siggi Sigurðsson')

    const sourceTable = container.querySelectorAll('table')[1]
    expect(screen.getByText('Öll mál valin')).toBeInTheDocument()
    expect(
      within(sourceTable).queryByRole('button', { name: /Raða eftir dálki/ }),
    ).not.toBeInTheDocument()
    expect(screen.getByLabelText('Velja mál til að ljúka')).toBeChecked()

    await user.click(
      screen.getByRole('button', {
        name: unstageLabel('S-2/2026, Gunna Gunnarsdóttir'),
      }),
    )

    expect(screen.queryByText('Öll mál valin')).not.toBeInTheDocument()
    expect(
      within(sourceTable).getAllByRole('button', { name: /Raða eftir dálki/ }),
    ).toHaveLength(columns.length)
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

  it('takes the confirm modal down before the success modal shows', async () => {
    renderLists()
    await turnOnSelection()
    await stage('S-1/2026, Jón Jónsson')
    await user.click(confirmButton())

    await user.click(screen.getByRole('button', { name: 'Já, ljúka málum' }))

    expect(await screen.findByText('Málunum er lokið')).toBeInTheDocument()
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    expect(screen.queryByText('Viltu ljúka málunum?')).not.toBeInTheDocument()
  })

  it('lays out both lists with the same fixed columns', async () => {
    const { container } = renderLists()
    await turnOnSelection()
    await stage('S-1/2026, Jón Jónsson')

    const tables = container.querySelectorAll('table')
    expect(tables).toHaveLength(2)
    tables.forEach((table) =>
      expect(table).toHaveClass(tableStyles.fixedLayoutTable),
    )
  })

  it('gives both lists the design widths when there are six columns', async () => {
    const sixColumns = [
      'Málsnúmer',
      'Varnaraðili',
      'Tegund',
      'Staða',
      'Dómsuppkvaðning',
      'Dómari',
    ].map((title) => ({ title }))
    const { container } = render(
      <BulkCompleteCaseLists
        rows={rows}
        columns={sixColumns}
        onComplete={jest.fn(async () => undefined)}
      />,
    )
    await turnOnSelection()
    await stage('S-1/2026, Jón Jónsson')

    const tables = container.querySelectorAll('table')
    expect(tables).toHaveLength(2)
    tables.forEach((table) =>
      expect(
        Array.from(table.querySelectorAll('th')).map((th) => th.style.width),
      ).toEqual([
        '14.14%',
        '17.11%',
        '14.88%',
        '17.11%',
        '16.37%',
        '15.63%',
        '',
      ]),
    )
  })

  it('shows the success modal when the completed cases leave the list', async () => {
    let resolveComplete: () => void = () => undefined
    const onComplete = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveComplete = resolve
        }),
    )
    const { rerender } = renderLists(onComplete)
    await turnOnSelection()
    await stage('S-1/2026, Jón Jónsson')
    await stage('S-2/2026, Gunna Gunnarsdóttir')
    await stage('S-3/2026, Siggi Sigurðsson')
    await user.click(confirmButton())
    await user.click(screen.getByRole('button', { name: 'Já, ljúka málum' }))

    await act(async () => resolveComplete())
    rerender(
      <BulkCompleteCaseLists
        rows={[]}
        columns={columns}
        onComplete={onComplete}
      />,
    )

    expect(await screen.findByText('Málunum er lokið')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Áfrýjun er lokið í 3 málum: S-1/2026, S-2/2026 og S-3/2026.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('Engin mál fundust')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Loka' }))

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    )
    expect(screen.getByText('Engin mál fundust')).toBeInTheDocument()

    rerender(
      <BulkCompleteCaseLists
        rows={rows}
        columns={columns}
        onComplete={onComplete}
      />,
    )

    expect(screen.getByLabelText('Velja mál til að ljúka')).not.toBeChecked()
    expect(stagingHeading()).not.toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: /^Opna mál S-/ }),
    ).toHaveLength(3)
  })

  it('stages the rows of one case each on their own', async () => {
    const onComplete = jest.fn(async () => undefined)
    const sameCaseRows = [
      caseRow('a', 'S-1/2026', 'Jón Jónsson', 'a-appeal-1'),
      caseRow('a', 'S-2/2026', 'Jón Jónsson', 'a-appeal-2'),
    ]
    renderLists(onComplete, sameCaseRows)
    await turnOnSelection()

    await stage('S-1/2026, Jón Jónsson')
    await stage('S-2/2026, Jón Jónsson')
    await user.click(
      screen.getByRole('button', {
        name: unstageLabel('S-1/2026, Jón Jónsson'),
      }),
    )

    expect(
      screen.getByRole('button', { name: stageLabel('S-1/2026, Jón Jónsson') }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: unstageLabel('S-2/2026, Jón Jónsson'),
      }),
    ).toBeInTheDocument()

    await user.click(confirmButton())
    await user.click(screen.getByRole('button', { name: 'Já, ljúka málum' }))

    expect(onComplete).toHaveBeenCalledWith([sameCaseRows[1]])
  })

  it('moves focus to the row that takes the place of a row moved with the keyboard', async () => {
    renderLists()
    await turnOnSelection()

    screen
      .getByRole('button', { name: stageLabel('S-1/2026, Jón Jónsson') })
      .focus()
    await user.keyboard('{Enter}')

    const sourceRows = screen.getAllByRole('button', { name: /^Velja mál/ })
    expect(sourceRows[0]).toHaveAttribute(
      'aria-label',
      stageLabel('S-2/2026, Gunna Gunnarsdóttir'),
    )
    expect(sourceRows[0]).toHaveFocus()
  })

  it('moves focus to the toggle when a keyboard move empties the list', async () => {
    renderLists()
    await turnOnSelection()
    await stage('S-1/2026, Jón Jónsson')

    screen
      .getByRole('button', { name: unstageLabel('S-1/2026, Jón Jónsson') })
      .focus()
    await user.keyboard('{Enter}')

    expect(screen.getByLabelText('Velja mál til að ljúka')).toHaveFocus()
  })

  it('announces each move', async () => {
    const { container } = renderLists()
    await turnOnSelection()
    const liveRegion = container.querySelector('[aria-live="polite"]')

    await stage('S-1/2026, Jón Jónsson')
    expect(liveRegion).toHaveTextContent(
      'Mál S-1/2026, Jón Jónsson valið til að ljúka',
    )

    await user.click(
      screen.getByRole('button', {
        name: unstageLabel('S-1/2026, Jón Jónsson'),
      }),
    )
    expect(liveRegion).toHaveTextContent(
      'Mál S-1/2026, Jón Jónsson tekið af lista',
    )
  })

  it('shows that no cases were found and no toggle when there are no rows', () => {
    renderLists(undefined, [])

    expect(screen.getByText('Engin mál fundust')).toBeInTheDocument()
    expect(
      screen.queryByLabelText('Velja mál til að ljúka'),
    ).not.toBeInTheDocument()
  })
})
