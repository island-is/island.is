import { downloadCSV } from './downloadFile'
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
