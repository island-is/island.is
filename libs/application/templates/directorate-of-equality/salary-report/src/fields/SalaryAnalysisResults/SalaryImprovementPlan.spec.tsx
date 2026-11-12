import { FC, PropsWithChildren } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { render, screen, waitFor } from '@testing-library/react'
import type {
  Application,
  CustomField,
  FieldBaseProps,
} from '@island.is/application/types'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'
import { ApiActions, draftActionId, States } from '../../utils/constants'
import { SalaryImprovementPlan } from './SalaryImprovementPlan'

// Must be `mock`-prefixed to be usable inside a hoisted jest.mock factory.
const mockMutate = jest.fn()

// Only useMutation is replaced: @island.is/application/graphql builds an
// HttpLink at module load, so the rest of the module has to stay real.
jest.mock('@apollo/client', () => ({
  ...jest.requireActual('@apollo/client'),
  useMutation: () => [mockMutate, { loading: false }],
}))

jest.mock('@island.is/localization', () => ({
  useLocale: () => ({ lang: 'is', formatMessage: (m: unknown) => String(m) }),
}))

// The panel is the editor; what matters here is which outliers it is handed.
jest.mock('./OutlierGroupPanel', () => ({
  OutlierGroupPanel: ({
    outliers,
  }: {
    outliers: { employeeOrdinal: number }[]
  }) => (
    <ul>
      {outliers.map((o) => (
        <li key={o.employeeOrdinal}>outlier {o.employeeOrdinal}</li>
      ))}
    </ul>
  ),
}))

const analysis = (ordinals: number[]): SalaryAnalysisResponseDto =>
  ({
    outliers: ordinals.map((employeeOrdinal) => ({ employeeOrdinal })),
  } as unknown as SalaryAnalysisResponseDto)

const providersOf = (call: unknown[]): string[] =>
  (
    call[0] as {
      variables: { input: { dataProviders: { actionId: string }[] } }
    }
  ).variables.input.dataProviders.map((p) => p.actionId)

const analyzeActionId = draftActionId(ApiActions.analyzeSalaryReport)

// Answers each mutation by what it asks for: the screen's draft reads, or a
// fresh analysis that now lists employees 7 and 8.
const respond = (call: unknown) => {
  const providers = providersOf([call])
  const externalData = providers.includes(analyzeActionId)
    ? { salaryAnalysisResult: { status: 'success', data: analysis([7, 8]) } }
    : {
        draftOutlierGroups: { status: 'success', data: { groups: [] } },
        draftEmployees: { status: 'success', data: { employees: [] } },
      }
  return Promise.resolve({
    data: { updateApplicationExternalData: { externalData } },
  })
}

// The page-load copy: an analysis that listed employee 1.
const application = (state: string) =>
  ({
    id: 'app-1',
    state,
    answers: {},
    externalData: {
      salaryAnalysisResult: { status: 'success', data: analysis([1]) },
      draftOutlierGroups: { status: 'success', data: { groups: [] } },
      draftEmployees: { status: 'success', data: { employees: [] } },
    },
  } as unknown as Application)

const AmbientForm: FC<PropsWithChildren> = ({ children }) => {
  const methods = useForm()
  return <FormProvider {...methods}>{children}</FormProvider>
}

const renderPlan = (state: string, answerQuestions = jest.fn()) => {
  render(
    <AmbientForm>
      <SalaryImprovementPlan
        {...({
          application: application(state),
          field: { props: {} } as unknown as CustomField,
          answerQuestions,
          setBeforeSubmitCallback: jest.fn(),
          setSubmitButtonDisabled: jest.fn(),
        } as unknown as FieldBaseProps)}
      />
    </AmbientForm>,
  )
  return answerQuestions
}

describe('SalaryImprovementPlan', () => {
  beforeEach(() => {
    mockMutate.mockReset()
    mockMutate.mockImplementation(respond)
  })

  it('in DRAFT, lists the outliers of a fresh analysis, not the page-load one', async () => {
    const answerQuestions = renderPlan(States.DRAFT)

    expect(await screen.findByText('outlier 7')).toBeInTheDocument()
    expect(screen.getByText('outlier 8')).toBeInTheDocument()
    expect(screen.queryByText('outlier 1')).not.toBeInTheDocument()
    expect(mockMutate.mock.calls.map(providersOf)).toContainEqual([
      analyzeActionId,
    ])
    expect(answerQuestions).toHaveBeenCalledWith(
      expect.objectContaining({
        salaryAnalysis: expect.objectContaining({
          hasMinimumSetOutliers: true,
          outlierPlanReviewed: false,
        }),
      }),
    )
  })

  it('in POSTPONED, keeps the stored analysis the report was submitted with', async () => {
    renderPlan(States.POSTPONED)

    expect(await screen.findByText('outlier 1')).toBeInTheDocument()
    await waitFor(() =>
      expect(mockMutate.mock.calls.map(providersOf).flat()).not.toContain(
        analyzeActionId,
      ),
    )
  })
})
