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

type PathAndValue = { path: string; value: string }

// Per-section i18n key for the network-error fallback body; the title, errors
// heading, and per-row error line format are shared across every income type.
export type IncomeValidationMessages = {
  fallbackErrorMessage: keyof typeof errorMessages
}

// Structured alert content so the caller can render a real bullet list for the
// grouped row-level errors and a plain message for the network-error fallback.
export type IncomeValidationAlert =
  | { kind: 'lines'; title: string; lines: string[] }
  | { kind: 'message'; title: string; message: string }

// Runs the shared income validation query and returns the row-level updates
// (disabled flags) plus the section-level alert content the component renders
// locally.
//
// Disabled paths are indexed against `rawRows` (the full answers array,
// including `isRemoved` items) so they land on the correct positions inside
// react-hook-form. Line numbers in the grouped error lines reference the
// user-visible subset only.
export const validateIncomes = async <TRow extends IncomeValidationRow>(args: {
  apolloClient: ApolloClient<object>
  fieldId: string
  rawRows: TRow[]
  input: IncomeValidationInput
  formatMessage: FormatMessage
  locale: Locale
  messages: IncomeValidationMessages
}): Promise<{
  isValid: boolean
  pathItems: PathAndValue[]
  alert: IncomeValidationAlert | null
}> => {
  const {
    apolloClient,
    fieldId,
    rawRows,
    input,
    formatMessage,
    locale,
    messages,
  } = args

  const visibleRows = rawRows.filter((row) => !row.isRemoved)

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

    const pathItems: PathAndValue[] = rawRows.flatMap((row, index) =>
      row.isRemoved
        ? []
        : [
            {
              path: `${fieldId}[${index}].disabled`,
              value:
                row.validationId && invalidIds.has(row.validationId)
                  ? 'true'
                  : 'false',
            },
          ],
    )

    const lineByValidationId = new Map(
      visibleRows.map((row, index) => [row.validationId, index + 1]),
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

    const errorLines = Array.from(linesByReason.entries())
      .sort(([, a], [, b]) => Math.min(...a) - Math.min(...b))
      .map(([reason, lines]) => {
        const sortedLines = [...lines].sort((a, b) => a - b)
        return formatMessage(errorMessages.incomeValidationErrorLine, {
          count: sortedLines.length,
          lines: sortedLines.join(', '),
          reason,
        })
      })

    const isValid = result?.isValid ?? false

    return {
      isValid,
      pathItems,
      alert:
        isValid || !errorLines.length
          ? null
          : {
              kind: 'lines',
              title: formatMessage(errorMessages.incomeValidationErrorsHeading),
              lines: errorLines,
            },
    }
  } catch {
    return {
      isValid: false,
      pathItems: [],
      alert: {
        kind: 'message',
        title: formatMessage(errorMessages.incomeValidationErrorTitle),
        message: formatMessage(errorMessages[messages.fallbackErrorMessage]),
      },
    }
  }
}
