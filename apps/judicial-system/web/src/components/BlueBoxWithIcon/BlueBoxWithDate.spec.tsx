import faker from 'faker'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { toast } from '@island.is/island-ui/core'

import {
  CaseIndictmentRulingDecision,
  CaseType,
  Defendant,
} from '../../graphql/schema'
import { mockCase } from '../../utils/mocks'
import {
  ApolloProviderWrapper,
  FormContextWrapper,
  IntlProviderWrapper,
} from '../../utils/testHelpers'
import BlueBoxWithDate from './BlueBoxWithDate'

jest.mock('../DateTime/DateTime', () => ({
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
}))

const mockVerdictAppealDecisionChoice = jest.fn(
  ({ disabled }: { disabled: boolean }) => (
    <div data-testid="verdict-appeal-choice">{`disabled:${disabled}`}</div>
  ),
)

jest.mock('../VerdictAppealDecisionChoice/VerdictAppealDecisionChoice', () => ({
  __esModule: true,
  default: (props: { disabled: boolean }) =>
    mockVerdictAppealDecisionChoice(props),
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

describe('BlueBoxWithDate', () => {
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
            <BlueBoxWithDate
              defendant={defendant}
              canDefendantAppealVerdict={canDefendantAppealVerdict}
            />
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

  it('hides date pickers when defendant is sent to prison admin', () => {
    const defendant = {
      ...mockDefendant,
      isSentToPrisonAdmin: true,
      verdict: {
        serviceRequirement: 'REQUIRED',
      },
    } as Defendant

    renderComponent(defendant)

    expect(
      screen.queryByTestId('set-valid-defendantAppealDate'),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByTestId('set-valid-defendantServiceDate'),
    ).not.toBeInTheDocument()
  })

  it('renders verdict appeal decision choice only when verdict exists and appeal is allowed', () => {
    const defendantWithoutVerdict = {
      ...mockDefendant,
      verdict: undefined,
    } as Defendant

    renderComponent(defendantWithoutVerdict, undefined, true)

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

    expect(screen.getByTestId('verdict-appeal-choice')).toBeInTheDocument()
  })

  it('passes disabled true to verdict appeal decision choice when sent to prison admin', () => {
    const defendant = {
      ...mockDefendant,
      isSentToPrisonAdmin: true,
      verdict: {
        serviceRequirement: 'NOT_REQUIRED',
      },
    } as Defendant

    renderComponent(defendant)

    expect(screen.getByTestId('verdict-appeal-choice')).toHaveTextContent(
      'disabled:true',
    )
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
      screen.getByTestId('set-invalid-defendantServiceDate'),
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

    const submitButton = screen.getByTestId('button-defendant-service-date')
    expect(submitButton).toBeDisabled()

    await userEvent.click(screen.getByTestId('set-valid-defendantServiceDate'))

    expect(submitButton).toBeEnabled()
  })
})
