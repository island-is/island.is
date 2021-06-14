import { downloadCSV } from './downloadFile'
import flatten from 'lodash/flatten'
import {
  FinanceStatusDetailsType,
  FinanceStatusDetailsChangeItem,
} from '../screens/FinanceStatus/FinanceStatusData.types'

const gjoldSundurlidunHeaders = [
  'Gjaldgrunnur',
  'Ár og tímabil',
  'Gjalddagi',
  'Eindagi',
  'Höfuðstóll',
  'Vextir',
  'Kostnaður',
  'Greiðslur',
  'Staða',
  'Gjaldflokkur',
]

export const exportGjoldSundurlidunCSV = async (
  data: FinanceStatusDetailsType,
  fileName: string,
) => {
  const name = `${fileName}_sundurlidun`
  const dataArray = data.chargeItemSubjects.map(
    (item: FinanceStatusDetailsChangeItem) => [
      item.chargeItemSubject,
      item.timePeriod,
      item.dueDate,
      item.finalDueDate,
      item.principal,
      item.interest,
      item.cost,
      item.paid,
      item.totals,
      fileName,
    ],
  )

  await downloadCSV(name, gjoldSundurlidunHeaders, dataArray)
}

export const exportGjoldSundurlidunXSLX = (data: FinanceStatusDetailsType) => {
  const dataArray = data.chargeItemSubjects.map(
    (item: FinanceStatusDetailsChangeItem) => [
      item.chargeItemSubject,
      item.timePeriod,
      item.dueDate,
      item.finalDueDate,
      item.principal.toString(),
      item.interest.toString(),
      item.cost.toString(),
      item.paid.toString(),
      item.totals.toString(),
    ],
  )

  return flatten(dataArray)
}
