import faker from 'faker'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { toast } from '@island.is/island-ui/core'
import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CaseIndictmentRulingDecision,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { mockCase } from '@island.is/judicial-system-web/src/utils/mocks'
import {
  ApolloProviderWrapper,
  FormContextWrapper,
  IntlProviderWrapper,
} from '@island.is/judicial-system-web/src/utils/testHelpers'

import VerdictTimelineCard from './VerdictTimelineCard'

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
      <div>
        <button
          data-testid={`set-valid-${name}`}
          onClick={() => onChange(new Date('2026-01-01T00:00:00.000Z'), true)}
          type="button"
        >
          set valid date
        </button>
        <button
          data-testid={`set-invalid-${name}`}
          onClick={() => onChange(new Date('2026-01-01T00:00:00.000Z'), false)}
          type="button"
        >
          set invalid date
        </button>
      </div>
    ),
  }),
)

const mockVerdictAppealDecisionChoice = jest.fn(
  ({ disabled }: { disabled: boolean }) => (
    <div data-testid="verdict-appeal-choice">{`disabled:${disabled}`}</div>
  ),
)

jest.mock(
  '@island.is/judicial-system-web/src/components/VerdictAppealDecisionChoice/VerdictAppealDecisionChoice',
  () => ({
    __esModule: true,
    default: (props: { disabled: boolean }) =>
      mockVerdictAppealDecisionChoice(props),
  }),
)

const mockUpdateDefendant = jest.fn()
const mockSetAndSendDefendantToServer = jest.fn()

jest.mock('../../../utils/hooks/useDefendants', () => ({
  __esModule: true,
  default: () => ({
    updateDefendant: mockUpdateDefendant,
    setAndSendDefendantToServer: mockSetAndSendDefendantToServer,
    isUpdatingDefendant: false,
  }),
}))

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
      query: {
        id: 'test_id',
      },
    }
  },
}))

window.scrollTo = jest.fn()

describe('VerdictTimelineCard', () => {
  const name = faker.name.firstName()
  const rulingDate = new Date().toISOString()
  const toastErrorSpy = jest.spyOn(toast, 'error').mockImplementation(jest.fn())

  const mockDefendant: Defendant = {
    name,
    id: faker.datatype.uuid(),
  }

  const renderComponent = (
    defendant: Defendant,
    indictmentRulingDecision = CaseIndictmentRulingDecision.RULING,
    canDefendantAppealVerdict = true,
  ) => {
    return render(
      <IntlProviderWrapper>
        <ApolloProviderWrapper>
          <FormContextWrapper
            theCase={{
              ...mockCase(CaseType.INDICTMENT),
              indictmentRulingDecision,
              defendants: [defendant],
              rulingDate,
            }}
          >
            <VerdictTimelineCard
              defendant={defendant}
              canDefendantAppealVerdict={canDefendantAppealVerdict}
            />
            {/* Modals portal into this container, normally supplied by PageLayout */}
            <div id="modal" />
          </FormContextWrapper>
        </ApolloProviderWrapper>
      </IntlProviderWrapper>,
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly when ruling decision is FINE', async () => {
    renderComponent(mockDefendant, CaseIndictmentRulingDecision.FINE, false)

    expect(await screen.findByText(name)).toBeInTheDocument()
    expect(await screen.findByText('Viðurlagaákvörðun')).toBeInTheDocument()
    expect(
      screen.queryByTestId('set-valid-defendantAppealDate'),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('set-valid-defendantServiceDate'),
    ).not.toBeInTheDocument()
  })

  it('renders correctly when ruling decision is RULING', async () => {
    renderComponent(mockDefendant)

    expect(await screen.findByText(name)).toBeInTheDocument()
    expect(await screen.findByText('Birting dóms')).toBeInTheDocument()
  })

  it('shows appeal and service date pickers when conditions are met', async () => {
    const defendant = {
      ...mockDefendant,
      verdict: {
        serviceRequirement: 'REQUIRED',
      },
    } as Defendant

    renderComponent(defendant)

    expect(
      await screen.findByTestId('set-valid-defendantAppealDate'),
    ).toBeInTheDocument()
    expect(
      await screen.findByTestId('set-valid-defendantServiceDate'),
    ).toBeInTheDocument()
  })

  it('hides date pickers when defendant is sent to prison admin', async () => {
    const defendant = {
      ...mockDefendant,
      isSentToPrisonAdmin: true,
      verdict: {
        serviceRequirement: 'REQUIRED',
      },
    } as Defendant

    renderComponent(defendant)

    expect(await screen.findByText(name)).toBeInTheDocument()
    expect(
      screen.queryByTestId('set-valid-defendantAppealDate'),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('set-valid-defendantServiceDate'),
    ).not.toBeInTheDocument()
  })

  it('hides date pickers when defendant case is closed without enforcement', async () => {
    const defendant = {
      ...mockDefendant,
      isClosedWithoutEnforcement: true,
      verdict: {
        serviceRequirement: 'REQUIRED',
      },
    } as Defendant

    renderComponent(defendant)

    expect(await screen.findByText(name)).toBeInTheDocument()
    expect(
      screen.queryByTestId('set-valid-defendantAppealDate'),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('set-valid-defendantServiceDate'),
    ).not.toBeInTheDocument()
  })

  it('opens a confirmation modal from the close without enforcement menu item', async () => {
    renderComponent(mockDefendant)

    await userEvent.click(
      await screen.findByRole('button', { name: `Valmynd fyrir ${name}` }),
    )
    await userEvent.click(await screen.findByText('Ljúka máli án fullnustu'))

    expect(
      await screen.findByText(
        (content) =>
          content.includes('verður lokið án fullnustu gagnvart ákærða') &&
          content.includes('ekki er hægt að afturkalla'),
      ),
    ).toBeInTheDocument()
  })

  it('closes the modal after a successful close without enforcement update', async () => {
    mockUpdateDefendant.mockResolvedValueOnce(true)

    renderComponent(mockDefendant)

    await userEvent.click(
      await screen.findByRole('button', { name: `Valmynd fyrir ${name}` }),
    )
    await userEvent.click(await screen.findByText('Ljúka máli án fullnustu'))
    await userEvent.click(screen.getByRole('button', { name: 'Ljúka máli' }))

    expect(mockUpdateDefendant).toHaveBeenCalledWith({
      caseId: 'test_id',
      defendantId: mockDefendant.id,
      isClosedWithoutEnforcement: true,
    })
    await waitFor(() =>
      expect(
        screen.queryByText((content) =>
          content.includes('verður lokið án fullnustu gagnvart ákærða'),
        ),
      ).not.toBeInTheDocument(),
    )
  })

  it('keeps the modal open when the close without enforcement update fails', async () => {
    mockUpdateDefendant.mockResolvedValueOnce(false)

    renderComponent(mockDefendant)

    await userEvent.click(
      await screen.findByRole('button', { name: `Valmynd fyrir ${name}` }),
    )
    await userEvent.click(await screen.findByText('Ljúka máli án fullnustu'))
    await userEvent.click(screen.getByRole('button', { name: 'Ljúka máli' }))

    expect(mockUpdateDefendant).toHaveBeenCalledTimes(1)
    expect(
      await screen.findByText((content) =>
        content.includes('verður lokið án fullnustu gagnvart ákærða'),
      ),
    ).toBeInTheDocument()
  })

  it('hides the close without enforcement menu item when defendant is sent to prison admin', async () => {
    const defendant = {
      ...mockDefendant,
      isSentToPrisonAdmin: true,
    } as Defendant

    renderComponent(defendant)

    await userEvent.click(
      await screen.findByRole('button', { name: `Valmynd fyrir ${name}` }),
    )

    expect(
      screen.queryByText('Ljúka máli án fullnustu'),
    ).not.toBeInTheDocument()
  })

  it('hides the close without enforcement menu item when defendant is already closed', async () => {
    const defendant = {
      ...mockDefendant,
      isClosedWithoutEnforcement: true,
    } as Defendant

    renderComponent(defendant)

    await userEvent.click(
      await screen.findByRole('button', { name: `Valmynd fyrir ${name}` }),
    )

    expect(
      screen.queryByText('Ljúka máli án fullnustu'),
    ).not.toBeInTheDocument()
  })

  // The public prosecution office has to be able to register an appeal that it
  // only hears about after the deadline has run out - see the confirmation
  // below for the case where the appeal itself was late.
  it('shows the appeal date picker after the appeal deadline has expired', async () => {
    const defendant = {
      ...mockDefendant,
      isVerdictAppealDeadlineExpired: true,
      verdictAppealDeadline: '2026-02-01T23:59:59.999Z',
      verdict: {
        serviceRequirement: 'REQUIRED',
      },
    } as Defendant

    renderComponent(defendant)

    expect(
      await screen.findByTestId('set-valid-defendantAppealDate'),
    ).toBeInTheDocument()
  })

  it('registers an appeal date on the last day of the deadline without confirming', async () => {
    // The picker emits 2026-01-01, the last day of this deadline
    const defendant = {
      ...mockDefendant,
      isVerdictAppealDeadlineExpired: true,
      verdictAppealDeadline: '2026-01-01T23:59:59.999Z',
      verdict: {
        serviceRequirement: 'REQUIRED',
      },
    } as Defendant

    renderComponent(defendant)

    await userEvent.click(
      await screen.findByTestId('set-valid-defendantAppealDate'),
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Skrá áfrýjun ákærða' }),
    )

    expect(
      screen.queryByText('Áfrýjun eftir að fresti lauk'),
    ).not.toBeInTheDocument()
  })

  it('confirms before registering an appeal date that falls after the deadline', async () => {
    // The picker emits 2026-01-01, the day after this deadline ran out
    const defendant = {
      ...mockDefendant,
      isVerdictAppealDeadlineExpired: true,
      verdictAppealDeadline: '2025-12-31T23:59:59.999Z',
      verdict: {
        serviceRequirement: 'REQUIRED',
      },
    } as Defendant

    renderComponent(defendant)

    await userEvent.click(
      await screen.findByTestId('set-valid-defendantAppealDate'),
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'Skrá áfrýjun ákærða' }),
    )

    expect(
      await screen.findByText('Áfrýjun eftir að fresti lauk'),
    ).toBeInTheDocument()
  })

  it('renders verdict appeal decision choice only when verdict exists and appeal is allowed', async () => {
    const defendantWithoutVerdict = {
      ...mockDefendant,
      verdict: undefined,
    } as Defendant

    renderComponent(defendantWithoutVerdict, undefined, true)

    expect(await screen.findByText(name)).toBeInTheDocument()
    expect(
      screen.queryByTestId('verdict-appeal-choice'),
    ).not.toBeInTheDocument()

    const defendantWithVerdict = {
      ...mockDefendant,
      verdict: {
        serviceRequirement: 'NOT_REQUIRED',
      },
    } as Defendant

    renderComponent(defendantWithVerdict, undefined, true)

    expect(
      await screen.findByTestId('verdict-appeal-choice'),
    ).toBeInTheDocument()
  })

  it('passes disabled true to verdict appeal decision choice when sent to prison admin', async () => {
    const defendant = {
      ...mockDefendant,
      isSentToPrisonAdmin: true,
      verdict: {
        serviceRequirement: 'NOT_REQUIRED',
      },
    } as Defendant

    renderComponent(defendant)

    expect(
      await screen.findByTestId('verdict-appeal-choice'),
    ).toHaveTextContent('disabled:true')
  })

  it('passes disabled true to verdict appeal decision choice when closed without enforcement', async () => {
    const defendant = {
      ...mockDefendant,
      isClosedWithoutEnforcement: true,
      verdict: {
        serviceRequirement: 'NOT_REQUIRED',
      },
    } as Defendant

    renderComponent(defendant)

    expect(
      await screen.findByTestId('verdict-appeal-choice'),
    ).toHaveTextContent('disabled:true')
  })

  it('shows error when invalid service date is selected', async () => {
    const defendant = {
      ...mockDefendant,
      verdict: {
        serviceRequirement: 'REQUIRED',
      },
    } as Defendant

    renderComponent(defendant)

    await userEvent.click(
      await screen.findByTestId('set-invalid-defendantServiceDate'),
    )

    expect(toastErrorSpy).toHaveBeenCalledTimes(1)
  })

  it('enables service date submit button after valid date selection', async () => {
    const defendant = {
      ...mockDefendant,
      verdict: {
        serviceRequirement: 'REQUIRED',
      },
    } as Defendant

    renderComponent(defendant)

    const submitButton = await screen.findByTestId(
      'button-defendant-service-date',
    )
    expect(submitButton).toBeDisabled()

    await userEvent.click(screen.getByTestId('set-valid-defendantServiceDate'))

    expect(submitButton).toBeEnabled()
  })
})
