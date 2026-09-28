import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Feature } from '@island.is/judicial-system/types'
import { FeatureContext } from '@island.is/judicial-system-web/src/components'
import type { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseIndictmentRulingDecision,
  CaseState,
  CaseType,
  ServiceRequirement,
  UserRole,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  FormContextWrapper,
  IntlProviderWrapper,
  UserContextWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import RegisterVerdictAppeal from './RegisterVerdictAppeal'

const mockReplace = jest.fn()
const mockPush = jest.fn()
let mockDefendantId: string | undefined = 'defendant_id'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      query: { id: 'test_id', defendantId: mockDefendantId },
      replace: mockReplace,
      push: mockPush,
    }
  },
}))

// The date picker is replaced with buttons that pick a fixed date.
jest.mock(
  '@island.is/judicial-system-web/src/components/DateTime/DateTime',
  () => ({
    __esModule: true,
    default: ({
      name,
      onChange,
    }: {
      name: string
      onChange: (date: Date, valid: boolean) => void
    }) => (
      <button
        data-testid={`set-valid-${name}`}
        onClick={() => onChange(new Date('2026-08-16T00:00:00.000Z'), true)}
        type="button"
      >
        set valid date
      </button>
    ),
  }),
)

window.scrollTo = jest.fn()

const overviewUrl = '/rikissaksoknari/akaera/yfirlit/test_id'

const completedCase = ({
  appealDate,
  verdictAppealDeadline = '2026-08-29T23:59:59.999Z',
}: { appealDate?: string; verdictAppealDeadline?: string } = {}): Case => ({
  ...mockCase(CaseType.INDICTMENT),
  state: CaseState.COMPLETED,
  indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
  courtCaseNumber: 'S-123/2026',
  rulingDate: '2026-05-16T10:00:00.000Z',
  defendants: [
    {
      id: 'defendant_id',
      name: 'Jón Sigurður Jónsson',
      verdictAppealDeadline,
      verdict: {
        id: 'verdict_id',
        serviceRequirement: ServiceRequirement.REQUIRED,
        serviceDate: '2026-08-01T10:00:00.000Z',
        appealDate,
      },
    },
  ],
})

const renderPage = (
  theCase: Case,
  {
    features = [Feature.INDICTMENT_APPEAL],
    isLoading = false,
    userRole = UserRole.PUBLIC_PROSECUTOR_STAFF,
  } = {},
) =>
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <FeatureContext.Provider value={{ features, isLoading }}>
        <UserContextWrapper userRole={userRole}>
          <IntlProviderWrapper>
            <FormContextWrapper theCase={theCase}>
              <RegisterVerdictAppeal />
              {/* Modals portal into this container, normally supplied by PageLayout */}
              <div id="modal" />
            </FormContextWrapper>
          </IntlProviderWrapper>
        </UserContextWrapper>
      </FeatureContext.Provider>
    </MockedProvider>,
  )

describe('RegisterVerdictAppeal', () => {
  beforeEach(() => {
    mockReplace.mockReset()
    mockPush.mockReset()
    mockDefendantId = 'defendant_id'
  })

  it('should render the page for a verdict the office may register an appeal of', async () => {
    renderPage(completedCase())

    expect(
      await screen.findByRole('heading', { name: 'Áfrýjun til Landsréttar' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Mál nr. S-123/2026')).toBeInTheDocument()
    expect(
      screen.getByText(/Dómsuppkvaðning 16\. maí 2026/),
    ).toBeInTheDocument()
    expect(screen.getByText('Áfrýjunaryfirlýsing')).toBeInTheDocument()
    expect(screen.getByText('Gögn')).toBeInTheDocument()
    expect(screen.getByText('Dagsetning áfrýjunar')).toBeInTheDocument()
    expect(screen.getByText('Verjandi sem áfrýjar')).toBeInTheDocument()
    expect(mockReplace).not.toHaveBeenCalled()
  })

  // Both the declaration and the date are required; the date alone is not enough.
  it('should not allow registering until a declaration has been added', async () => {
    renderPage(completedCase())

    await userEvent.click(await screen.findByTestId('set-valid-appealDate'))

    expect(screen.getByRole('button', { name: 'Skrá áfrýjun' })).toBeDisabled()
  })

  it('should send the user back to the overview while the feature is hidden', async () => {
    renderPage(completedCase(), { features: [] })

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith(overviewUrl))
    expect(
      screen.queryByRole('heading', { name: 'Áfrýjun til Landsréttar' }),
    ).not.toBeInTheDocument()
  })

  it('should wait, not redirect, while the features are still loading', async () => {
    renderPage(completedCase(), { features: [], isLoading: true })

    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Áfrýjun til Landsréttar' }),
      ).not.toBeInTheDocument(),
    )
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('should send the user back when the verdict has already been appealed', async () => {
    renderPage(completedCase({ appealDate: '2026-08-10T00:00:00.000Z' }))

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith(overviewUrl))
  })

  it('should send the user back when the defendant is not on the case', async () => {
    mockDefendantId = 'someone_else'

    renderPage(completedCase())

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith(overviewUrl))
  })

  // Only the public prosecution office registers appeals that arrive by letter.
  it('should send a prosecutor back', async () => {
    renderPage(completedCase(), { userRole: UserRole.PROSECUTOR })

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith(overviewUrl))
  })
})
