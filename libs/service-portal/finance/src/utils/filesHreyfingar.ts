import { downloadCSV } from './downloadFile'
import flatten from 'lodash/flatten'
import { CustomerRecordsDetails } from '../screens/FinanceTransactions/FinanceTransactionsData.types'
import { hreyfingarHeaders } from './dataHeaders'

const getDataArray = (data: Array<any>) =>
  data.map((record: CustomerRecordsDetails) => [
    record.createDate,
    record.valueDate,
    record.performingOrganization,
    record.collectingOrganization,
    record.chargeType,
    record.itemCode,
    record.chargeItemSubject,
    record.period,
    record.amount,
    record.category,
    record.subCategory,
    record.actionCategory || '',
    record.reference,
  ])

export const exportHreyfingarCSV = async (data: CustomerRecordsDetails[]) => {
  const name = 'Hreyfingar'
  const dataArrays = getDataArray(data)

  await downloadCSV(name, hreyfingarHeaders, dataArrays)
}

export const exportHreyfingarXSLX = (data: CustomerRecordsDetails[]) => {
  const dataArrays = getDataArray(data)

  return flatten(dataArrays)
}
