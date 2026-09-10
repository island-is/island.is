import { ApolloClient } from '@apollo/client'
import type { FormatMessage } from '@island.is/localization'
import { VALIDATE_PART_TIME_JOBS_QUERY } from '../graphql/queries'
import { errorMessages } from '../lib/messages'

type PartTimeJobRow = {
  validationId?: string
  company?: { nationalId?: string }
  jobStart?: string
  jobEnd?: string
  workPercentage?: string
  estimatedIncome?: string
}

type PartTimeJobValidationResult = {
  isValid: boolean
  title?: string | null
  message?: string | null
  invalidValidationIds?: string[] | null
}

export type PathAndValue = { path: string; value: string }

export const validatePartTimeJobs = async (
  apolloClient: ApolloClient<object>,
  rows: PartTimeJobRow[],
  formatMessage: FormatMessage,
): Promise<{ pathItems: PathAndValue[]; isValid: boolean }> => {
  const input = rows.map((row) => ({
    validationId: row.validationId,
    employerSSN: row.company?.nationalId,
    periodFrom: row.jobStart,
    periodTo: row.jobEnd || null,
    ratio: row.workPercentage ? Number(row.workPercentage) : undefined,
    estimatedIncome: row.estimatedIncome
      ? Number(row.estimatedIncome)
      : undefined,
  }))

  try {
    const { data } = await apolloClient.query<
      { vmstApplicationsValidatePartTimeJobs: PartTimeJobValidationResult },
      { input: typeof input }
    >({
      query: VALIDATE_PART_TIME_JOBS_QUERY,
      variables: { input },
      fetchPolicy: 'no-cache',
    })

    const result = data.vmstApplicationsValidatePartTimeJobs
    const invalidIds = new Set(result?.invalidValidationIds ?? [])

    const pathItems: PathAndValue[] = rows.map((row, index) => ({
      path: `registerPartTime[${index}].disabled`,
      value:
        row.validationId && invalidIds.has(row.validationId) ? 'true' : 'false',
    }))

    pathItems.push(
      {
        path: 'partTimeValidationErrorTitle',
        value: result?.isValid ? '' : result?.title ?? '',
      },
      {
        path: 'partTimeValidationErrorMessage',
        value: result?.isValid ? '' : result?.message ?? '',
      },
    )

    return { pathItems, isValid: result?.isValid ?? false }
  } catch (e) {
    return {
      pathItems: [
        {
          path: 'partTimeValidationErrorTitle',
          value: formatMessage(errorMessages.partTimeValidationErrorTitle),
        },
        {
          path: 'partTimeValidationErrorMessage',
          value: formatMessage(errorMessages.partTimeValidationErrorMessage),
        },
      ],
      isValid: false,
    }
  }
}
