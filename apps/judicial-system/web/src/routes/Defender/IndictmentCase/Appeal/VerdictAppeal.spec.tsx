import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react'

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

import VerdictAppeal from './VerdictAppeal'

const mockReplace = jest.fn()
const mockPush = jest.fn()
let mockDefendantId: string | undefined = 'own_client_id'

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

window.scrollTo = jest.fn()

const defenderNationalId = '1111111111'

const appealableCase = (ownClientAppealDate?: string): Case => ({
  ...mockCase(CaseType.INDICTMENT),
  state: CaseState.COMPLETED,
  indictmentRulingDecision: CaseIndictmentRulingDecision.RULING,
  courtCaseNumber: 'S-123/2026',
  rulingDate: '2026-05-27T10:00:00.000Z',
  defendants: [
    {
      id: 'own_client_id',
      name: 'Eigin sakborningur',
      isDefenderChoiceConfirmed: true,
      defenderNationalId,
      isVerdictAppealDeadlineExpired: false,
      verdict: {
        id: 'own_client_verdict_id',
        serviceRequirement: ServiceRequirement.REQUIRED,
        serviceDate: '2026-06-01T13:31:00.000Z',
        appealDate: ownClientAppealDate,
      },
    },
    {
      id: 'other_client_id',
      name: 'Annar sakborningur',
      isDefenderChoiceConfirmed: true,
      defenderNationalId: '2222222222',
      isVerdictAppealDeadlineExpired: false,
      verdict: {
        id: 'other_client_verdict_id',
        serviceRequirement: ServiceRequirement.REQUIRED,
        serviceDate: '2026-06-01T13:31:00.000Z',
      },
    },
  ],
})

const renderPage = (
  theCase: Case,
  { features = [Feature.INDICTMENT_APPEAL], isLoading = false } = {},
) =>
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <FeatureContext.Provider value={{ features, isLoading }}>
        <UserContextWrapper
          userRole={UserRole.DEFENDER}
          nationalId={defenderNationalId}
        >
          <IntlProviderWrapper>
            <FormContextWrapper theCase={theCase}>
              <VerdictAppeal />
            </FormContextWrapper>
          </IntlProviderWrapper>
        </UserContextWrapper>
      </FeatureContext.Provider>
    </MockedProvider>,
  )

describe('VerdictAppeal', () => {
  beforeEach(() => {
    mockReplace.mockReset()
    mockPush.mockReset()
    mockDefendantId = 'own_client_id'
  })

  it('should render the page for an appealable verdict of an own defendant', async () => {
    renderPage(appealableCase())

    expect(
      await screen.findByRole('heading', { name: 'Áfrýjun til Landsréttar' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Mál nr. S-123/2026')).toBeInTheDocument()
    expect(screen.getByText(/Máli lokið 27\. maí 2026/)).toBeInTheDocument()
    expect(screen.getByText('Áfrýjunaryfirlýsing')).toBeInTheDocument()
    expect(screen.getByText('Gögn')).toBeInTheDocument()
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('should not allow appealing until a declaration has been added', async () => {
    renderPage(appealableCase())

    expect(
      await screen.findByRole('button', { name: 'Áfrýja dómi' }),
    ).toBeDisabled()
  })

  it('should send the user back to the overview while the feature is hidden', async () => {
    renderPage(appealableCase(), { features: [] })

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith('/verjandi/akaera/test_id'),
    )
    expect(
      screen.queryByRole('heading', { name: 'Áfrýjun til Landsréttar' }),
    ).not.toBeInTheDocument()
  })

  it('should wait, not redirect, while the features are still loading', async () => {
    renderPage(appealableCase(), { features: [], isLoading: true })

    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Áfrýjun til Landsréttar' }),
      ).not.toBeInTheDocument(),
    )
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('should send the user back when the defendant is not one they represent', async () => {
    mockDefendantId = 'other_client_id'

    renderPage(appealableCase())

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith('/verjandi/akaera/test_id'),
    )
  })

  it('should send the user back when the verdict has already been appealed', async () => {
    renderPage(appealableCase('2026-06-04T13:34:00.000Z'))

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith('/verjandi/akaera/test_id'),
    )
  })
})
