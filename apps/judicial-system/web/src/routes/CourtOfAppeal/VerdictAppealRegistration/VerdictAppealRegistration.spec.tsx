import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  COURT_OF_APPEAL_VERDICT_APPEAL_DEFENDER_ROUTE,
  COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE,
} from '@island.is/judicial-system/consts'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import {
  AppealCaseState,
  AppealCaseType,
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

import VerdictAppealRegistration from './VerdictAppealRegistration'

const mockPush = jest.fn()
const mockUpdateAppealCase = jest.fn()
const mockSetWorkingCase = jest.fn()

jest.mock(
  '@island.is/judicial-system-web/src/utils/hooks/useAppealCase',
  () => ({
    __esModule: true,
    default: () => ({
      updateAppealCase: mockUpdateAppealCase,
      isUpdatingAppealCase: false,
    }),
  }),
)

jest.mock(
  '@island.is/judicial-system-web/src/routes/CourtOfAppeal/components/AppealRoles/appealCaseUsers.generated',
  () => ({
    useAppealCaseUsersQuery: () => ({
      data: {
        users: [
          {
            id: 'assistant',
            name: 'Aðstoð Aðstoðardóttir',
            role: 'COURT_OF_APPEALS_ASSISTANT',
          },
          {
            id: 'anna',
            name: 'Anna Dómaradóttir',
            role: 'COURT_OF_APPEALS_JUDGE',
          },
          {
            id: 'bjorn',
            name: 'Björn Dómarason',
            role: 'COURT_OF_APPEALS_JUDGE',
          },
          {
            id: 'dora',
            name: 'Dóra Dómaradóttir',
            role: 'COURT_OF_APPEALS_JUDGE',
          },
          {
            id: 'einar',
            name: 'Einar Dómarason',
            role: 'COURT_OF_APPEALS_JUDGE',
          },
        ],
      },
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

const judge = (id: string, name: string) => ({ id, name })
const anna = judge('anna', 'Anna Dómaradóttir')
const bjorn = judge('bjorn', 'Björn Dómarason')
const dora = judge('dora', 'Dóra Dómaradóttir')

const bench = (judges: { id: string; name: string }[]) =>
  judges.map((user, displayOrder) => ({
    id: `row-${user.id}`,
    displayOrder,
    userId: user.id,
    user,
  }))

const theCase = {
  ...mockCase(CaseType.INDICTMENT),
  id: 'case-id',
  state: CaseState.COMPLETED,
  courtCaseNumber: 'S-123/2026',
  verdictAppealCase: {
    id: 'verdict-appeal',
    appealState: AppealCaseState.RECEIVED,
    appealType: AppealCaseType.VERDICT,
    appealCaseNumber: '555/2026',
    appealAssistant: null,
    appealJudges: [],
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
              setWorkingCase: mockSetWorkingCase,
              isLoadingWorkingCase: false,
              caseNotFound: false,
              isCaseUpToDate: true,
              refreshCase: jest.fn(),
              getCase: jest.fn(),
              isCreating: false,
            }}
          >
            <VerdictAppealRegistration />
          </FormContext.Provider>
        </UserContextWrapper>
      </ApolloProviderWrapper>
    </IntlProviderWrapper>,
  )

// One label per seat, so the labels count the seats.
const judgeSeats = () => screen.getAllByText(/^Veldu dóm/)
const removeButtons = () =>
  screen.queryAllByRole('button', { name: 'Fjarlægja dómara' })
const addButton = () => screen.getByRole('button', { name: 'Bæta við dómara' })
const confirmButton = () =>
  screen.getByRole('button', { name: 'Staðfesta val' })
const continueButton = () => screen.getByTestId('continueButton')

// A text button is rendered as a span with aria-disabled rather than a
// disabled button, so both are read.
const isDisabled = (element: HTMLElement) =>
  element.hasAttribute('disabled') ||
  element.getAttribute('aria-disabled') === 'true'

// Opens a select by the placeholder it shows while empty (the nth one with
// that placeholder) and picks the option with the given name.
const pick = async (placeholder: string, option: string, index = 0) => {
  await userEvent.click(screen.getAllByText(placeholder)[index])
  await userEvent.click(await screen.findByText(option))
}

describe('VerdictAppealRegistration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUpdateAppealCase.mockResolvedValue({ id: 'verdict-appeal' })
  })

  it('shows the saved number and bench, with three seats and nothing to confirm', () => {
    renderPage({
      ...theCase,
      verdictAppealCase: {
        ...theCase.verdictAppealCase,
        appealAssistant: { id: 'assistant', name: 'Aðstoð Aðstoðardóttir' },
        appealJudges: bench([anna, bjorn, dora]),
      },
    } as unknown as WorkingCase)

    expect(
      screen.getByRole('heading', { name: 'Skráning og úthlutun' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/Mál nr\./)).toHaveValue('555/2026')
    expect(screen.getByText('Aðstoð Aðstoðardóttir')).toBeInTheDocument()
    expect(judgeSeats()).toHaveLength(3)
    expect(screen.getByText('Veldu dómsformann')).toBeInTheDocument()
    expect(screen.getByText('Anna Dómaradóttir')).toBeInTheDocument()
    expect(screen.getByText('Björn Dómarason')).toBeInTheDocument()
    expect(screen.getByText('Dóra Dómaradóttir')).toBeInTheDocument()
    expect(removeButtons()).toHaveLength(0)
    expect(isDisabled(confirmButton())).toBe(true)
    expect(isDisabled(continueButton())).toBe(false)
  })

  it('holds the court until it has its case number, bench or no bench', async () => {
    renderPage({
      ...theCase,
      verdictAppealCase: {
        ...theCase.verdictAppealCase,
        appealCaseNumber: null,
      },
    } as unknown as WorkingCase)

    expect(isDisabled(continueButton())).toBe(true)

    await pick('Velja aðstoðarmann', 'Aðstoð Aðstoðardóttir')

    expect(isDisabled(confirmButton())).toBe(true)
  })

  it('moves on to the defender step without a bench', async () => {
    renderPage()

    await userEvent.click(continueButton())

    expect(mockPush).toHaveBeenCalledWith(
      `${COURT_OF_APPEAL_VERDICT_APPEAL_DEFENDER_ROUTE}/case-id?appealCaseId=verdict-appeal`,
    )
    expect(mockUpdateAppealCase).not.toHaveBeenCalled()
  })

  it('goes back to the overview', async () => {
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: 'Til baka' }))

    expect(mockPush).toHaveBeenCalledWith(
      `${COURT_OF_APPEAL_VERDICT_APPEAL_OVERVIEW_ROUTE}/case-id?appealCaseId=verdict-appeal`,
    )
  })

  it('adds seats up to five and lets every seat but the presiding one go', async () => {
    renderPage()

    await userEvent.click(addButton())

    expect(judgeSeats()).toHaveLength(4)
    expect(removeButtons()).toHaveLength(3)

    await userEvent.click(addButton())

    expect(judgeSeats()).toHaveLength(5)
    expect(isDisabled(addButton())).toBe(true)

    await userEvent.click(removeButtons()[0])
    await userEvent.click(removeButtons()[0])

    expect(judgeSeats()).toHaveLength(3)
    expect(removeButtons()).toHaveLength(0)
    expect(isDisabled(addButton())).toBe(false)
  })

  it('confirms the bench and says the judges have been told', async () => {
    renderPage()

    await pick('Velja aðstoðarmann', 'Aðstoð Aðstoðardóttir')
    await pick('Velja dómara', 'Anna Dómaradóttir')

    expect(isDisabled(confirmButton())).toBe(false)

    await userEvent.click(confirmButton())

    await waitFor(() =>
      expect(mockUpdateAppealCase).toHaveBeenCalledWith(
        'case-id',
        'verdict-appeal',
        { appealAssistantId: 'assistant', appealJudgeIds: ['anna'] },
      ),
    )
    expect(mockSetWorkingCase).toHaveBeenCalled()
    expect(
      await screen.findByRole('heading', { name: 'Tilkynningar sendar' }),
    ).toBeInTheDocument()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('does not offer a judge already on the bench for another seat', async () => {
    renderPage({
      ...theCase,
      verdictAppealCase: {
        ...theCase.verdictAppealCase,
        appealJudges: bench([anna]),
      },
    } as unknown as WorkingCase)

    // The first empty seat is the second one; the presiding seat holds Anna.
    await userEvent.click(screen.getAllByText('Velja dómara')[0])

    expect(await screen.findByText('Björn Dómarason')).toBeInTheDocument()
    expect(screen.getAllByText('Anna Dómaradóttir')).toHaveLength(1)
  })
})
