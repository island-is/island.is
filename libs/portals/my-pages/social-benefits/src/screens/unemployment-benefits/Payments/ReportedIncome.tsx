import { useLocale } from '@island.is/localization'
import { VmstApplicantIncomeRowType } from '@island.is/api/schema'
import {
  amountFormat,
  formatNationalId,
} from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import { ReportedIncomeRow, ReportedIncomeTable } from './ReportedIncomeTable'
import { useGetVmstApplicantIncomeRowsQuery } from './ReportedIncome.generated'

const DASH = '-'
const LONG_DATE_FORMAT = 'd. MMMM yyyy'

const TYPE_LABELS: Record<
  VmstApplicantIncomeRowType,
  typeof um[keyof typeof um]
> = {
  [VmstApplicantIncomeRowType.IrregularJob]: um.reportedIncomeTypeIrregular,
  [VmstApplicantIncomeRowType.PartTimeJob]: um.reportedIncomeTypePartTime,
  [VmstApplicantIncomeRowType.PensionPayment]: um.reportedIncomeTypePension,
  [VmstApplicantIncomeRowType.CapitalIncomePayment]:
    um.reportedIncomeTypeCapital,
  [VmstApplicantIncomeRowType.TRPayment]: um.reportedIncomeTypeTR,
  [VmstApplicantIncomeRowType.ContractorJob]: um.reportedIncomeTypeContractor,
}

const formatAmount = (value?: number | null) =>
  value != null ? amountFormat(value) : DASH

const formatPayer = (name?: string | null, ssn?: string | null) => {
  if (name && ssn) return `${name}, kt. ${formatNationalId(ssn)}`
  return name || (ssn ? formatNationalId(ssn) : DASH)
}

export const ReportedIncome = () => {
  const { formatMessage, formatDateFns } = useLocale()
  const { data, loading, error } = useGetVmstApplicantIncomeRowsQuery()

  const formatLongDate = (value?: string | null) => {
    if (!value) return DASH
    try {
      return formatDateFns(value, LONG_DATE_FORMAT)
    } catch {
      return DASH
    }
  }

  const rows: ReportedIncomeRow[] = (data?.vmstApplicantIncomeRows ?? []).map(
    (item, index) => {
      const payer =
        item.__typename === 'VmstApplicantIrregularJob' ||
        item.__typename === 'VmstApplicantPartTimeJob'
          ? formatPayer(item.employer.name, item.employer.ssn)
          : item.__typename === 'VmstApplicantTRPayment'
          ? formatMessage(um.reportedIncomeTRPayer)
          : DASH

      return {
        id: item.id || `${item.type}-${index}`,
        type: formatMessage(TYPE_LABELS[item.type]),
        payer,
        date: formatLongDate(item.period.from),
        dateTo: formatLongDate(item.period.to),
        amount: formatAmount(item.estimatedIncome),
      }
    },
  )

  return <ReportedIncomeTable rows={rows} loading={loading} error={error} />
}
