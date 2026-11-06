import type { SdfComponentData, SdfValidationError } from '../../lib/graphql'

export type SdfFormDispatch = (
  actionType: string,
  extraAnswers?: Record<string, unknown>,
  fieldIds?: string[],
  event?: string,
  refetchTemplateApiActions?: string[],
  refetchTargets?: string[],
) => void | Promise<void>

export interface FormRendererProps {
  components: SdfComponentData[]
  errors: SdfValidationError[]
  answers: Record<string, unknown>
  onAnswerChange: (fieldId: string, value: unknown) => void
  dispatch?: SdfFormDispatch
  /**
   * Optional live-computed values for `SdfDisplayField` components. The backend
   * recomputes these from the VALIDATE action in response to form input; the
   * overlay is applied without mutating persisted answers.
   */
  displayValues?: Record<string, string>
  pendingRefetchTargets?: string[]
}

export interface ComponentSwitchProps {
  component: SdfComponentData
  error?: string
  answers: Record<string, unknown>
  onAnswerChange: (fieldId: string, value: unknown) => void
  dispatch?: SdfFormDispatch
  displayValues?: Record<string, string>
  pendingRefetchTargets?: string[]
}

export interface FieldRendererProps {
  component: SdfComponentData
  currentValue: unknown
  error?: string
  answers: Record<string, unknown>
  onAnswerChange: (fieldId: string, value: unknown) => void
  handleChange: (value: unknown) => void
  dispatch?: SdfFormDispatch
  displayValues?: Record<string, string>
  pendingRefetchTargets: string[]
  isRefetchPending: boolean
}
