import { useLocale } from '@island.is/localization'
import { VmstApplicantIncomeRowType } from '@island.is/api/schema'
import { amountFormat } from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import { ReportedIncomeRow, ReportedIncomeTable } from './ReportedIncomeTable'
import {
  useGetVmstApplicantIncomeRowsQuery,
  GetVmstApplicantIncomeRowsQuery,
} from './ReportedIncome.generated'

type IncomeRow =
  GetVmstApplicantIncomeRowsQuery['vmstApplicantIncomeRows'][number]

const DASH = '-'
const DATE_FORMAT = 'd.MM.yyyy'

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

export const ReportedIncome = () => {
  const { formatMessage, formatDateFns } = useLocale()
  const { data, loading, error } = useGetVmstApplicantIncomeRowsQuery()

  const formatDate = (value?: string | null) => {
    if (!value) return DASH
    try {
      return formatDateFns(value, DATE_FORMAT)
    } catch {
      return DASH
    }
  }

  const getPayer = (item: IncomeRow): string => {
    if (item.__typename === 'VmstApplicantTRPayment') {
      return formatMessage(um.reportedIncomeTRPayer)
    }
    if ('employerName' in item) {
      return item.employerName ?? DASH
    }
    return DASH
  }

  const rows: ReportedIncomeRow[] = (data?.vmstApplicantIncomeRows ?? []).map(
    (item, index) => ({
      id: item.id || `${item.type}-${index}`,
      type: formatMessage(TYPE_LABELS[item.type]),
      payer: getPayer(item),
      date: formatDate(item.period.from),
      dateTo: formatDate(item.period.to),
      amount: formatAmount(item.estimatedIncome),
    }),
  )

  return <ReportedIncomeTable rows={rows} loading={loading} error={error} />
}
