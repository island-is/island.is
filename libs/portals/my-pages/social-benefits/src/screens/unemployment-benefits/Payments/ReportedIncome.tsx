import { useLocale } from '@island.is/localization'
import { amountFormat, formatDate } from '@island.is/portals/my-pages/core'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'
import { ReportedIncomeRow, ReportedIncomeTable } from './ReportedIncomeTable'
import { useGetVmstApplicantIncomesQuery } from './ReportedIncome.generated'

const DASH = '-'

const formatAmount = (value?: number | null) =>
  value != null ? amountFormat(value) : DASH

const formatPeriod = (from?: string | null, to?: string | null) => {
  const fromLabel = from ? formatDate(from) : ''
  const toLabel = to ? formatDate(to) : ''
  if (fromLabel && toLabel) return `${fromLabel} – ${toLabel}`
  return fromLabel || toLabel || DASH
}

const formatPayer = (name?: string | null, ssn?: string | null) => {
  if (name && ssn) return `${name}, kt. ${ssn}`
  return name || ssn || DASH
}

export const ReportedIncome = () => {
  const { formatMessage } = useLocale()
  const { data, loading } = useGetVmstApplicantIncomesQuery()

  const incomes = data?.vmstApplicantIncomes
  const rows: ReportedIncomeRow[] = [
    ...(incomes?.irregularJobs ?? []).map((item, index) => ({
      id: item.id ?? `irregular-${index}`,
      type: formatMessage(um.reportedIncomeTypeIrregular),
      payer: formatPayer(item.employerName, item.employerSSN),
      date: formatPeriod(item.periodFrom, item.periodTo),
      amount: formatAmount(item.estimatedIncome),
      sortDate: item.periodFrom,
    })),
    ...(incomes?.partTimeJobs ?? []).map((item, index) => ({
      id: item.id ?? `partTime-${index}`,
      type: formatMessage(um.reportedIncomeTypePartTime),
      payer: formatPayer(item.employerName, item.employerSSN),
      date: formatPeriod(item.periodFrom, item.periodTo),
      amount: formatAmount(item.estimatedIncome),
      sortDate: item.periodFrom,
    })),
    ...(incomes?.pensionPayments ?? []).map((item, index) => ({
      id: item.id ?? `pension-${index}`,
      type: formatMessage(um.reportedIncomeTypePension),
      payer: DASH,
      date: formatPeriod(item.periodFrom, item.periodTo),
      amount: formatAmount(item.estimatedIncome),
      sortDate: item.periodFrom,
    })),
    ...(incomes?.capitalIncomePayments ?? []).map((item, index) => ({
      id: item.id ?? `capital-${index}`,
      type: formatMessage(um.reportedIncomeTypeCapital),
      payer: DASH,
      date: formatPeriod(item.periodFrom, item.periodTo),
      amount: formatAmount(item.estimatedIncome),
      sortDate: item.periodFrom,
    })),
    ...(incomes?.trPayments ?? []).map((item, index) => ({
      id: item.id ?? `tr-${index}`,
      type: formatMessage(um.reportedIncomeTypeTR),
      payer: formatMessage(um.reportedIncomeTRPayer),
      date: formatPeriod(item.periodFrom, item.periodTo),
      amount: formatAmount(item.estimatedIncome),
      sortDate: item.periodFrom,
    })),
    ...(incomes?.contractorJobs ?? []).map((item, index) => ({
      id: item.id ?? `contractor-${index}`,
      type: formatMessage(um.reportedIncomeTypeContractor),
      payer: DASH,
      date: formatPeriod(item.startDate, item.endDate),
      amount: DASH,
      sortDate: item.startDate,
    })),
  ].sort((a, b) => (b.sortDate ?? '').localeCompare(a.sortDate ?? ''))

  return <ReportedIncomeTable rows={rows} loading={loading} />
}
