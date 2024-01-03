import { downloadFile } from '@island.is/service-portal/core'
import { PeriodHeaders } from './dataHeaders'
import { SelectedPeriod } from '../components/FinanceTransactionPeriods/FinanceTransactionPeriodsTypes'
import { amountFormat } from '@island.is/service-portal/core'

export const exportPeriodBreakdownFile = async (
  periods: SelectedPeriod[],
  fileName: string,
  type: 'xlsx' | 'csv',
) => {
  const name = `${fileName}_sundurlidun`
  const periodArray = periods?.map((per) =>
    per.details?.map((item) => [
      per.chargeType,
      per.subject,
      per.period,
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
    ]),
  )

  const returnArray = periodArray.flatMap((subArray) =>
    subArray && subArray.length ? [...subArray, []] : [],
  )

  await downloadFile(name, PeriodHeaders, returnArray, type)
}
