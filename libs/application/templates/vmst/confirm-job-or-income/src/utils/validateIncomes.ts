import { ApolloClient } from '@apollo/client'
import type { FormatMessage } from '@island.is/localization'
import type { Locale } from '@island.is/shared/types'
import { VALIDATE_INCOMES_QUERY } from '../graphql/queries'
import { errorMessages } from '../lib/messages'
import { ReconcileDelete } from './reconcile'

export type IncomeValidationRow = {
  validationId?: string
} & Record<string, unknown>

// Payload shape supported by the generic vmstApplicationsValidateIncomes query;
// mirrors the BE IncomeValidationInput. Each array carries a mix of create rows
// and delete markers ({ id, deleted: true }); the BE service branches on `deleted`.
export type IncomeValidationInput = {
  irregularJobs?: Array<IrregularJobValidationInput | ReconcileDelete>
  contractorJobs?: Array<ContractorJobValidationInput | ReconcileDelete>
  capitalIncomePayments?: Array<
    CapitalIncomePaymentValidationInput | ReconcileDelete
  >
  trPayments?: Array<TRPaymentValidationInput | ReconcileDelete>
  pensionPayments?: Array<PensionPaymentValidationInput | ReconcileDelete>
  partTimeJobs?: Array<PartTimeJobValidationInput | ReconcileDelete>
}

export type IrregularJobValidationInput = {
  validationId: string
  employerSSN?: string
  periodFrom: string
  periodTo?: string
  estimatedIncome: number
  workShiftPeriodIds?: string[]
}

export type ContractorJobValidationInput = {
  validationId: string
  periodFrom: string
  periodTo?: string
}

export type CapitalIncomePaymentValidationInput = {
  validationId: string
  incomeTypeId: string
  estimatedIncome: number
  periodFrom: string
  periodTo?: string | null
}

export type TRPaymentValidationInput = {
  validationId: string
  incomeTypeId: string
  estimatedIncome: number
  periodFrom: string
  periodTo?: string | null
}

export type PensionPaymentValidationInput = {
  validationId: string
  incomeTypeId: string
  pensionFundId?: string
  estimatedIncome: number
  periodFrom: string
  periodTo?: string | null
}

export type PartTimeJobValidationInput = {
  validationId: string
  employerSSN?: string
  periodFrom: string
  periodTo?: string
  ratio?: number
  estimatedIncome?: number
}

type IncomeValidationResult = {
  isValid: boolean
  invalidValidationIds?: string[] | null
  errors?: Array<{
    validationId: string
    reason?: string | null
    reasonEN?: string | null
  }> | null
}

export type PathAndValue = { path: string; value: string }

// Per-section i18n key for the network-error fallback body; the title, errors
// heading, and per-row error line format are shared across every income type.
export type IncomeValidationMessages = {
  fallbackErrorMessage: keyof typeof errorMessages
}

// Runs the shared income validation query and returns the row-level updates
// (disabled flags) plus the section-level alert strings the component renders
// locally.
export const validateIncomes = async <TRow extends IncomeValidationRow>(args: {
  apolloClient: ApolloClient<object>
  fieldId: string
  rows: TRow[]
  input: IncomeValidationInput
  formatMessage: FormatMessage
  locale: Locale
  messages: IncomeValidationMessages
}): Promise<{
  isValid: boolean
  pathItems: PathAndValue[]
  alertTitle: string
  alertMessage: string
}> => {
  const {
    apolloClient,
    fieldId,
    rows,
    input,
    formatMessage,
    locale,
    messages,
  } = args

  try {
    const { data } = await apolloClient.query<
      { vmstApplicationsValidateIncomes: IncomeValidationResult },
      { input: IncomeValidationInput }
    >({
      query: VALIDATE_INCOMES_QUERY,
      variables: { input },
      fetchPolicy: 'no-cache',
    })

    const result = data.vmstApplicationsValidateIncomes
    const invalidIds = new Set(result?.invalidValidationIds ?? [])

    const pathItems: PathAndValue[] = rows.map((row, index) => ({
      path: `${fieldId}[${index}].disabled`,
      value:
        row.validationId && invalidIds.has(row.validationId) ? 'true' : 'false',
    }))

    const lineByValidationId = new Map(
      rows.map((row, index) => [row.validationId, index + 1]),
    )
    const linesByReason = new Map<string, number[]>()
    for (const error of result?.errors ?? []) {
      const reason = locale === 'en' ? error.reasonEN : error.reason
      const line = lineByValidationId.get(error.validationId)
      if (!reason || !line) continue

      const lines = linesByReason.get(reason) ?? []
      lines.push(line)
      linesByReason.set(reason, lines)
    }

    const errorList = Array.from(linesByReason.entries())
      .sort(([, a], [, b]) => Math.min(...a) - Math.min(...b))
      .map(([reason, lines]) => {
        const sortedLines = [...lines].sort((a, b) => a - b)
        return `- ${formatMessage(errorMessages.incomeValidationErrorLine, {
          count: sortedLines.length,
          lines: sortedLines.join(', '),
          reason,
        })}`
      })
      .join('\n')

    const isValid = result?.isValid ?? false

    return {
      isValid,
      pathItems,
      alertTitle:
        isValid || !errorList
          ? ''
          : formatMessage(errorMessages.incomeValidationErrorsHeading),
      alertMessage: isValid ? '' : errorList,
    }
  } catch {
    return {
      isValid: false,
      pathItems: [],
      alertTitle: formatMessage(errorMessages.incomeValidationErrorTitle),
      alertMessage: formatMessage(errorMessages[messages.fallbackErrorMessage]),
    }
  }
}
