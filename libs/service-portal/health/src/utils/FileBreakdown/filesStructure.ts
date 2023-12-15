import {
  amountFormat,
  downloadFile,
  formatDate,
} from '@island.is/service-portal/core'
import {
  aidHeaders,
  nutritionHeaders,
  paymentOverviewHeaders,
  paymentParticipationHeaders,
} from './dataHeaders'
import {
  RightsPortalAidOrNutrition,
  RightsPortalCopaymentBill,
  RightsPortalPaymentOverviewBill,
} from '@island.is/api/schema'
import { totalNumber } from '../format'

type FileTypes = 'xlsx' | 'csv'

export const exportPaymentParticipationFile = async (
  data: Array<RightsPortalCopaymentBill>,
  type: FileTypes,
) => {
  const name = `Greidsluthatttaka_sundurlidun`
  const dataArray = data.map((item) => [
    item.serviceType,
    item.date,
    amountFormat(item.totalAmount ?? 0),
    amountFormat(item.insuranceAmount ?? 0),
    amountFormat(item.ownAmount ?? 0),
    amountFormat(item.overpaid ?? 0),
  ])

  const footer = [
    'Samtals',
    '',
    totalNumber(data, 'totalAmount'),
    totalNumber(data, 'insuranceAmount'),
    totalNumber(data, 'ownAmount'),
    totalNumber(data, 'overpaid'),
  ]

  await downloadFile(
    name,
    paymentParticipationHeaders,
    [...dataArray, footer],
    type,
  )
}

export const exportPaymentOverviewFile = async (
  data: Array<RightsPortalPaymentOverviewBill>,
  type: FileTypes,
) => {
  const name = `Greidsluyfirlit_sundurlidun`
  const dataArray = data.map((item) => [
    item.date,
    item.serviceType?.name ?? '',
    amountFormat(item.totalAmount ?? 0),
    amountFormat(item.insuranceAmount ?? 0),
  ])

  await downloadFile(name, paymentOverviewHeaders, dataArray, type)
}

export const exportAidTable = async (
  data: Array<RightsPortalAidOrNutrition>,
  type: FileTypes,
) => {
  const name = `Hjalpartaeki_sundurlidun`
  const dataArray = data.map((item) => [
    item.name ?? '',
    item.maxUnitRefund ?? '',
    item.refund.type === 'amount'
      ? item.refund.value
        ? amountFormat(item.refund.value)
        : ''
      : item.refund.value
      ? `${item.refund.value}%`
      : '',
    item.available ?? '',
    item.nextAllowedMonth ?? '',
    item.location ?? '',
    formatDate(item.validUntil) ?? item.validUntil ?? '',
    item.allowed12MonthPeriod ?? '',
    item.explanation ?? '',
  ])

  await downloadFile(name, aidHeaders, dataArray, type)
}

export const exportNutritionFile = async (
  data: Array<RightsPortalAidOrNutrition>,
  type: FileTypes,
) => {
  const name = `Naering_sundurlidun`
  const dataArray = data.map((item) => [
    item.name ?? '',
    item.maxUnitRefund ?? '',
    item.refund.type === 'amount'
      ? item.refund.value
        ? amountFormat(item.refund.value)
        : ''
      : item.refund.value
      ? `${item.refund.value}%`
      : '',
    item.available ?? '',
    item.nextAllowedMonth ?? '',

    formatDate(item.validUntil) ?? item.validUntil ?? '',
    item.explanation ?? '',
  ])

  await downloadFile(name, nutritionHeaders, dataArray, type)
}
