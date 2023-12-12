import { downloadFile } from './downloadFile'
import { PeriodHeaders } from './dataHeaders'
import { SelectedPeriod } from '../components/FinanceTransactionPeriods/FinanceTransactionPeriodsTypes'
import { GetChargeTypePeriodSubjectQuery } from '../screens/FinanceTransactionPeriods/FinanceTransactionPeriods.generated'
import { amountFormat } from '@island.is/service-portal/core'

export const exportPeriodBreakdownFile = async (
  data: GetChargeTypePeriodSubjectQuery,
  period: SelectedPeriod,
  fileName: string,
  type: 'xlsx' | 'csv',
) => {
  const name = `${fileName}_sundurlidun`
  const dataArray = data?.getChargeTypePeriodSubject?.records?.map((item) => [
    period.chargeType,
    period.subject,
    period.period,
    item.itemCode,
    item.createDate,
    item.category,
    amountFormat(item.amount) ?? item.amount ?? '',
    item.valueDate,
    item.performingOrganization,
    item.collectingOrganization,
    item.subCategory,
    item.actionCategory,
    item.reference,
    '',
  ])

  await downloadFile(name, PeriodHeaders, dataArray, type)
}
