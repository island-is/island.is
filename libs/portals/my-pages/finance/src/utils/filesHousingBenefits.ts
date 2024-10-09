import { downloadFile, formatDate } from '@island.is/portals/my-pages/core'
import { HousingPaymentsHeaders } from './dataHeaders'
import { amountFormat } from '@island.is/portals/my-pages/core'
import { HousingBenefitsPayment } from '@island.is/api/schema'

export const exportHousingBenefitFiles = async (
  payments: HousingBenefitsPayment[],
  type: 'xlsx' | 'csv',
) => {
  const paymentsArray = payments.map((item) => [
    item.dateTransfer ? formatDate(item.dateTransfer) : '',
    item.month ?? '',
    amountFormat(item.paymentBeforeDebt),
    amountFormat(item.paidOfDebt),
    amountFormat(item.paymentActual),
    amountFormat(item.remainDebt),
    item.noDays ?? '',
    item.nr ?? '',
    amountFormat(item.totalIncome),
    item.name ?? '',
    item.benefit ?? '',
    item.bankAccountMerged ?? '',
    amountFormat(item.reductionIncome),
    item.dateTransfer ? formatDate(item.dateTransfer) : '',
    amountFormat(item.reductionHousingCost),
    item.calculationType ?? '',
    amountFormat(item.reductionAssets),
  ])

  await downloadFile(
    `husnaedisbaetur_sundurlidun`,
    HousingPaymentsHeaders,
    paymentsArray,
    type,
  )
}
