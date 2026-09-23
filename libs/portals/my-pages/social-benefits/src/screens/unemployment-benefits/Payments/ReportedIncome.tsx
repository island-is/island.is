import { useLocale } from '@island.is/localization'
import {
  amountFormat,
  formatNationalId,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import { ReportedIncomeRow, ReportedIncomeTable } from './ReportedIncomeTable'
import { useGetVmstApplicantIncomesQuery } from './ReportedIncome.generated'

const DASH = '-'
const LONG_DATE_FORMAT = 'd. MMMM yyyy'

const formatAmount = (value?: number | null) =>
  value != null ? amountFormat(value) : DASH

const formatPayer = (name?: string | null, ssn?: string | null) => {
  if (name && ssn) return `${name}, kt. ${formatNationalId(ssn)}`
  return name || (ssn ? formatNationalId(ssn) : DASH)
}

export const ReportedIncome = () => {
  const { formatMessage, formatDateFns } = useLocale()
  const { data, loading, error } = useGetVmstApplicantIncomesQuery()

  const formatLongDate = (value?: string | null) => {
    if (!value) return DASH
    try {
      return formatDateFns(value, LONG_DATE_FORMAT)
    } catch {
      return DASH
    }
  }

  if (!loading && error) {
    return <Problem error={error} noBorder={false} />
  }

  const incomes = data?.vmstApplicantIncomes
  const rows: ReportedIncomeRow[] = [
    ...(incomes?.irregularJobs ?? []).map((item, index) => ({
      id: item.id ?? `irregular-${index}`,
      type: formatMessage(um.reportedIncomeTypeIrregular),
      payer: formatPayer(item.employerName, item.employerSSN),
      date: formatLongDate(item.periodFrom),
      amount: formatAmount(item.estimatedIncome),
      sortDate: item.periodFrom,
    })),
    ...(incomes?.partTimeJobs ?? []).map((item, index) => ({
      id: item.id ?? `partTime-${index}`,
      type: formatMessage(um.reportedIncomeTypePartTime),
      payer: formatPayer(item.employerName, item.employerSSN),
      date: formatLongDate(item.periodFrom),
      amount: formatAmount(item.estimatedIncome),
      sortDate: item.periodFrom,
    })),
    ...(incomes?.pensionPayments ?? []).map((item, index) => ({
      id: item.id ?? `pension-${index}`,
      type: formatMessage(um.reportedIncomeTypePension),
      payer: DASH,
      date: formatLongDate(item.periodFrom),
      amount: formatAmount(item.estimatedIncome),
      sortDate: item.periodFrom,
    })),
    ...(incomes?.capitalIncomePayments ?? []).map((item, index) => ({
      id: item.id ?? `capital-${index}`,
      type: formatMessage(um.reportedIncomeTypeCapital),
      payer: DASH,
      date: formatLongDate(item.periodFrom),
      amount: formatAmount(item.estimatedIncome),
      sortDate: item.periodFrom,
    })),
    ...(incomes?.trPayments ?? []).map((item, index) => ({
      id: item.id ?? `tr-${index}`,
      type: formatMessage(um.reportedIncomeTypeTR),
      payer: formatMessage(um.reportedIncomeTRPayer),
      date: formatLongDate(item.periodFrom),
      amount: formatAmount(item.estimatedIncome),
      sortDate: item.periodFrom,
    })),
    ...(incomes?.contractorJobs ?? []).map((item, index) => ({
      id: item.id ?? `contractor-${index}`,
      type: formatMessage(um.reportedIncomeTypeContractor),
      payer: DASH,
      date: formatLongDate(item.startDate),
      amount: DASH,
      sortDate: item.startDate,
    })),
  ].sort((a, b) => (b.sortDate ?? '').localeCompare(a.sortDate ?? ''))

  return <ReportedIncomeTable rows={rows} loading={loading} />
}
