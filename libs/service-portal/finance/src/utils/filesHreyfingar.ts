import { downloadFile } from './downloadFile'
import { CustomerRecordsDetails } from '../screens/FinanceTransactions/FinanceTransactionsData.types'
import { hreyfingarHeaders } from './dataHeaders'
const name = 'Hreyfingar'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const exportHreyfingarFile = async (
  data: CustomerRecordsDetails[],
  type: 'csv' | 'xlsx',
) => {
  const dataArrays = getDataArray(data)
  await downloadFile(name, hreyfingarHeaders, dataArrays, type)
}
