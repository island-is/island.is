import { downloadFile } from '@island.is/portals/my-pages/core'
import { hreyfingarHeaders } from './dataHeaders'
import { CustomerRecordsDetails } from '../lib/types'
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
