import {
  amountFormat,
  downloadFile,
  formatDate,
} from '@island.is/portals/my-pages/core'
import {
  aidHeaders,
  dentistHeaders,
  drugHeaders,
  healthCenterHeaders,
  medicineBillHeaders,
  medicineHeaders,
  medicineLineHeaders,
  nutritionHeaders,
  paymentOverviewHeaders,
  paymentParticipateOverviewHeaders,
  paymentParticipationHeaders,
} from './dataHeaders'
import {
  RightsPortalAidOrNutrition,
  RightsPortalCalculatorRequestInput,
  RightsPortalCopaymentBill,
  RightsPortalCopaymentPeriod,
  RightsPortalDentistBill,
  RightsPortalDrugBill,
  RightsPortalDrugBillLine,
  RightsPortalDrugCalculatorResponse,
  RightsPortalHealthCenterRecord,
  RightsPortalPaymentOverviewBill,
} from '@island.is/api/schema'
import { totalNumber } from '../format'
import { RightsPortalCalculatorSelectedDrug } from '../types'

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

export const exportDentistFile = async (
  data: Array<RightsPortalDentistBill>,
  type: FileTypes,
  footer?: { charge: number; covered: number },
) => {
  const name = `Tannlaeknar_sundurlidun`
  const dataArray = data.map((item) => [
    item.number ?? '',
    formatDate(item.date) ?? item.date ?? '',
    formatDate(item.refundDate) ?? item.refundDate ?? '',
    amountFormat(item.amount) ?? item.amount ?? '',
    amountFormat(item.coveredAmount) ?? item.coveredAmount ?? '',
  ])

  const total = [
    'Samtals',
    '',
    '',
    footer?.charge ? amountFormat(footer.charge) : '',
    footer?.covered ? amountFormat(footer.covered) : '',
  ]

  await downloadFile(name, dentistHeaders, [...dataArray, total], type)
}

export const exportMedicineBill = async (data: RightsPortalDrugBill[]) => {
  const name = `Lyfjareikningar`
  const dataArray = data.map((item) => [
    formatDate(item.date) ?? item.date ?? '',
    item.description ?? '',
    amountFormat(item.totalCopaymentAmount) ?? '',
    amountFormat(item.totalCustomerAmount) ?? '',
  ])

  await downloadFile(name, medicineBillHeaders, dataArray, 'xlsx')
}

export const exportPaymentParticipationOverview = async (
  data: RightsPortalCopaymentPeriod[],
) => {
  const name = `Greidsluthatttaka`
  const dataArray = data.map((item) => [
    item.status?.display ?? '',
    item.month ?? '',
    amountFormat(item.maximumPayment) ?? '',
    amountFormat(item.monthPayment) ?? '',
    amountFormat(item.overpaid) ?? '',
    amountFormat(item.repaid) ?? '',
  ])

  await downloadFile(name, paymentParticipateOverviewHeaders, dataArray, 'xlsx')
}

export const exportHealthCenterFile = async (
  data: Array<RightsPortalHealthCenterRecord>,
  type: FileTypes,
) => {
  const name = `Heilsugaesla_sundurlidun`
  const dataArray = data.map((item) => [
    item.dateFrom ? formatDate(item.dateFrom) : '',
    item.healthCenterName ?? '',
    item.dateFrom ? formatDate(item.dateFrom) : '',
    item.doctor ?? '',
  ])

  await downloadFile(name, healthCenterHeaders, dataArray, type)
}

export const exportDrugListFile = async (
  data: Array<RightsPortalCalculatorSelectedDrug>,
  type: FileTypes,
  calculatorResults: RightsPortalDrugCalculatorResponse,
) => {
  const name = `Lyfjareiknivel_sundurlidun`

  const dataArray = data.map((item) => [
    item.name ?? '',
    item.strength ?? '',
    item.units ?? '',
    item.lineNumber
      ? calculatorResults?.drugs?.at(item.lineNumber - 1)?.fullPrice ?? ''
      : '',
    item.lineNumber
      ? calculatorResults?.drugs?.at(item.lineNumber - 1)?.customerPrice ?? ''
      : '',
  ])

  const footer = [
    'Samtals',
    '',
    '',
    calculatorResults.totalPrice ?? '',
    calculatorResults.totalCustomerPrice ?? '',
  ]

  await downloadFile(name, drugHeaders, [...dataArray, footer], type)
}

export const exportMedicineFile = async (
  preData: string[],
  data: Array<RightsPortalDrugBillLine>,
  total: { part: string; excess: string; customer: string },
  type: FileTypes,
) => {
  const name = `Lyfjareikningur_sundurlidun`

  const dataArray = data.map((item) => [
    item.drugName ?? '',
    item.strength ?? '',
    item.quantity ?? '',
    item.units ?? '',
    amountFormat(item.salesPrice ?? 0),
    amountFormat(item.copaymentAmount ?? 0),
    amountFormat(item.excessAmount ?? 0),
    amountFormat(item.customerAmount ?? 0),
  ])

  const totalArray = [
    'Samtals',
    '',
    '',
    '',
    '',
    total.part,
    total.excess,
    total.customer,
  ]

  const fileArray = [
    preData,
    [''],
    medicineLineHeaders,
    ...dataArray,
    totalArray,
  ]

  await downloadFile(name, medicineHeaders, fileArray, type)
}
