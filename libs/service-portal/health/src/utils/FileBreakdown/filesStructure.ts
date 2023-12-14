import { amountFormat, downloadFile } from '@island.is/service-portal/core'
import {
  paymentOverviewHeaders,
  paymentParticipationHeaders,
} from './dataHeaders'
import {
  RightsPortalCopaymentBill,
  RightsPortalPaymentOverviewBill,
} from '@island.is/api/schema'
import { totalNumber } from '../format'

export const exportPaymentParticipationFile = async (
  data: Array<RightsPortalCopaymentBill>,
  type: 'xlsx' | 'csv',
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
  type: 'xlsx' | 'csv',
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
