import { render, screen, waitFor } from '@testing-library/react'
import userEvent, { PointerEventsCheckLevel } from '@testing-library/user-event'

import { UserContext } from '@island.is/judicial-system-web/src/components'
import type { CaseTableRow } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseActionType,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockUser } from '@island.is/judicial-system-web/src/utils/mocks'

import BulkCompleteCases from './BulkCompleteCases'

const mockUseCaseTableQuery = jest.fn()
const mockRefetch = jest.fn()
const mockCompleteVerdictAppeals = jest.fn()
const mockToastError = jest.fn()
let mockAsPath = '/malalistar/afryjud-mal-i-domsuppkvadningu'

jest.mock('next/router', () => ({
  useRouter() {
    return { asPath: mockAsPath, pathname: '', push: jest.fn() }
  },
}))

jest.mock(
  '@island.is/judicial-system-web/src/routes/Shared/CaseTable/caseTable.generated',
  () => ({
    useCaseTableQuery: (options: unknown) => mockUseCaseTableQuery(options),
  }),
)

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useAppealCase/completeVerdictAppeals.generated',
  () => ({
    useCompleteVerdictAppealsMutation: () => [mockCompleteVerdictAppeals],
  }),
)

jest.mock(
  '@island.is/judicial-system-web/src/components/Table/TableSkeleton/TableSkeleton',
  () => ({
    __esModule: true,
    default: () => <div>Sæki málalista</div>,
  }),
)

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
    handleOpenCase: jest.fn(),
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
    warning: jest.fn(),
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
  caseRow('case-a', 'S-1/2026', 'Jón Jónsson'),
  caseRow('case-b', 'S-2/2026', 'Gunna Gunnarsdóttir'),
]

const loaded = (theRows: CaseTableRow[] = rows) => ({
  data: { caseTable: { rowCount: theRows.length, rows: theRows } },
  loading: false,
  error: undefined,
  refetch: mockRefetch,
})

const stageLabel = (label: string) => `Velja mál ${label} til að ljúka`
const unstageLabel = (label: string) => `Taka mál ${label} af lista`

describe('BulkCompleteCases', () => {
  let user: ReturnType<typeof userEvent.setup>
  let modalRoot: HTMLDivElement

  beforeEach(() => {
    modalRoot = document.createElement('div')
    modalRoot.id = 'modal'
    document.body.appendChild(modalRoot)
    user = userEvent.setup()
    mockAsPath = '/malalistar/afryjud-mal-i-domsuppkvadningu'
    mockUseCaseTableQuery.mockReset()
    mockUseCaseTableQuery.mockReturnValue(loaded())
    mockRefetch.mockReset()
    mockRefetch.mockResolvedValue({})
    mockCompleteVerdictAppeals.mockReset()
    mockToastError.mockReset()
  })

  afterEach(() => {
    modalRoot.remove()
  })

  const renderPage = (role = UserRole.COURT_OF_APPEALS_JUDGE) =>
    render(
      <UserContext.Provider value={{ user: mockUser(role) }}>
        <BulkCompleteCases />
      </UserContext.Provider>,
    )

  const stageBoth = async () => {
    await user.click(screen.getByLabelText('Velja mál til að ljúka'))
    await user.click(
      screen.getByRole('button', { name: stageLabel('S-1/2026, Jón Jónsson') }),
    )
    await user.click(
      screen.getByRole('button', {
        name: stageLabel('S-2/2026, Gunna Gunnarsdóttir'),
      }),
    )
  }

  const confirm = async () => {
    await user.click(screen.getByRole('button', { name: 'Ljúka málum' }))
    await user.click(screen.getByRole('button', { name: 'Já, ljúka málum' }))
  }

  it('loads the list to complete, uncached', () => {
    renderPage()

    expect(mockUseCaseTableQuery).toHaveBeenCalledWith({
      variables: {
        input: {
          type: 'COURT_OF_APPEALS_VERDICT_APPEALS_READY_TO_COMPLETE',
        },
      },
      skip: false,
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    })
  })

  it('shows a skeleton while the list loads', () => {
    mockUseCaseTableQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
      refetch: mockRefetch,
    })

    renderPage()

    expect(screen.getByText('Sæki málalista')).toBeInTheDocument()
    expect(screen.queryByText('S-1/2026')).not.toBeInTheDocument()
  })

  it('shows an error when the list cannot be loaded', () => {
    mockUseCaseTableQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: new Error('Villa'),
      refetch: mockRefetch,
    })

    renderPage()

    expect(
      screen.getByText('Ekki tókst að sækja málalista'),
    ).toBeInTheDocument()
  })

  it('tells a user without the list that they have no access to it', () => {
    renderPage(UserRole.DISTRICT_COURT_JUDGE)

    expect(
      screen.getByText('Þú hefur ekki aðgang að þessum málalista'),
    ).toBeInTheDocument()
    expect(mockUseCaseTableQuery).toHaveBeenCalledWith(
      expect.objectContaining({ skip: true }),
    )
  })

  it.each([
    '/malalistar/afryjud-mal-i-domsuppkvadningu?x=1',
    '/malalistar/afryjud-mal-i-domsuppkvadningu#efst',
    '/malalistar/afryjud-mal-i-domsuppkvadningu?x=1#efst',
  ])('finds the list at %s', (asPath) => {
    mockAsPath = asPath

    renderPage()

    expect(screen.getByText('S-1/2026')).toBeInTheDocument()
    expect(
      screen.queryByText('Þú hefur ekki aðgang að þessum málalista'),
    ).not.toBeInTheDocument()
  })

  it('shows the rows under the title and columns of the table', () => {
    renderPage()

    expect(screen.getByText('Mál í dómsuppkvaðningu')).toBeInTheDocument()
    expect(screen.getByText('S-1/2026')).toBeInTheDocument()
    expect(screen.getByText('Gunna Gunnarsdóttir')).toBeInTheDocument()
    expect(screen.getByText('Dómsuppkvaðning')).toBeInTheDocument()
    expect(screen.getByText('Dómsformaður')).toBeInTheDocument()
  })

  it('completes the staged appeals with one request, by appeal case id', async () => {
    mockCompleteVerdictAppeals.mockResolvedValue({
      data: {
        completeVerdictAppeals: [
          { id: 'case-a-appeal', appealState: 'COMPLETED' },
          { id: 'case-b-appeal', appealState: 'COMPLETED' },
        ],
      },
    })
    renderPage()
    await stageBoth()

    await confirm()
    // The button is disabled by now; the second click is pressed through it.
    await userEvent
      .setup({ pointerEventsCheck: PointerEventsCheckLevel.Never })
      .click(screen.getByRole('button', { name: /Já, ljúka málum/ }))

    expect(await screen.findByText('Málunum er lokið')).toBeInTheDocument()
    expect(mockCompleteVerdictAppeals).toHaveBeenCalledTimes(1)
    expect(mockCompleteVerdictAppeals).toHaveBeenCalledWith({
      variables: {
        input: { appealCaseIds: ['case-a-appeal', 'case-b-appeal'] },
      },
    })
  })

  it('reloads the list once the appeals are completed', async () => {
    mockCompleteVerdictAppeals.mockResolvedValue({
      data: {
        completeVerdictAppeals: [
          { id: 'case-a-appeal', appealState: 'COMPLETED' },
          { id: 'case-b-appeal', appealState: 'COMPLETED' },
        ],
      },
    })
    renderPage()
    await stageBoth()

    await confirm()

    await waitFor(() => expect(mockRefetch).toHaveBeenCalledTimes(1))
    expect(await screen.findByText('Málunum er lokið')).toBeInTheDocument()
    expect(mockToastError).not.toHaveBeenCalled()
  })

  it('keeps the cases staged and shows an error when the request fails', async () => {
    mockCompleteVerdictAppeals.mockRejectedValue(new Error('Network error'))
    renderPage()
    await stageBoth()

    await confirm()

    await waitFor(() => expect(mockToastError).toHaveBeenCalledTimes(1))
    expect(
      screen.getByRole('button', {
        name: unstageLabel('S-1/2026, Jón Jónsson'),
      }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Málunum er lokið')).not.toBeInTheDocument()
    // The list is reloaded all the same, so an appeal completed elsewhere
    // leaves it before the next try.
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it.each([
    [
      'errors and no data',
      { data: null, errors: [{ message: 'Bad request' }] },
    ],
    [
      'errors alongside data',
      {
        data: { completeVerdictAppeals: [] },
        errors: [{ message: 'Bad request' }],
      },
    ],
    ['no data', { data: undefined }],
  ])('counts a response with %s as a failure', async (_, response) => {
    mockCompleteVerdictAppeals.mockResolvedValue(response)
    renderPage()
    await stageBoth()

    await confirm()

    await waitFor(() => expect(mockToastError).toHaveBeenCalledTimes(1))
    expect(screen.queryByText('Málunum er lokið')).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: unstageLabel('S-2/2026, Gunna Gunnarsdóttir'),
      }),
    ).toBeInTheDocument()
    // The list is reloaded all the same, so an appeal completed elsewhere
    // leaves it before the next try.
    expect(mockRefetch).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['with the rows it had', loaded().data],
    ['without data', undefined],
  ])(
    'keeps the success modal when the reload after completing fails, %s',
    async (_, dataAfterFailure) => {
      mockCompleteVerdictAppeals.mockResolvedValue({
        data: {
          completeVerdictAppeals: [
            { id: 'case-a-appeal', appealState: 'COMPLETED' },
            { id: 'case-b-appeal', appealState: 'COMPLETED' },
          ],
        },
      })
      mockRefetch.mockImplementation(async () => {
        mockUseCaseTableQuery.mockReturnValue({
          data: dataAfterFailure,
          loading: false,
          error: new Error('Reload failed'),
          refetch: mockRefetch,
        })

        throw new Error('Reload failed')
      })
      renderPage()
      await stageBoth()

      await confirm()

      expect(await screen.findByText('Málunum er lokið')).toBeInTheDocument()
      expect(
        screen.queryByText('Ekki tókst að sækja málalista'),
      ).not.toBeInTheDocument()
      expect(mockToastError).not.toHaveBeenCalled()
    },
  )

  it('reloads the list and still reports the failure when the reload fails too', async () => {
    mockCompleteVerdictAppeals.mockRejectedValue(new Error('Network error'))
    mockRefetch.mockRejectedValue(new Error('Reload failed'))
    renderPage()
    await stageBoth()

    await confirm()

    await waitFor(() => expect(mockToastError).toHaveBeenCalledTimes(1))
    expect(mockRefetch).toHaveBeenCalledTimes(1)
    expect(screen.queryByText('Málunum er lokið')).not.toBeInTheDocument()
  })
})
