import { downloadCSV } from './downloadFile'
import flatten from 'lodash/flatten'
import {
  FinanceStatusDetailsType,
  FinanceStatusDetailsChangeItem,
} from '../screens/FinanceStatus/FinanceStatusData.types'
import { gjoldSundurlidunHeaders } from './dataHeaders'

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

  const headers = [...gjoldSundurlidunHeaders, 'Gjaldflokkur']
  await downloadCSV(name, headers, dataArray)
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
