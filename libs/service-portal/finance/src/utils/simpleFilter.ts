import { CustomerRecordsDetails } from '../screens/FinanceTransactions/FinanceTransactionsData.types'
import { DocumentsListItemTypes } from '../components/DocumentScreen/DocumentScreen.types'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'

export const transactionFilter = (
  data: CustomerRecordsDetails[],
  query: string,
) => {
  if (!query) return data
  const filteredArray = data.filter((item) => {
    if (
      item.accountReference.toLowerCase().includes(query.toLowerCase()) ||
      item.actionCategory?.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.chargeItemSubject.toLowerCase().includes(query.toLowerCase()) ||
      item.collectingOrganization.toLowerCase().includes(query.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(query.toLowerCase()) ||
      item.performingOrganization.toLowerCase().includes(query.toLowerCase()) ||
      item.subCategory.toLowerCase().includes(query.toLowerCase()) ||
      item.chargeType.toLowerCase().includes(query.toLowerCase()) ||
      item.period.toLowerCase().includes(query.toLowerCase()) ||
      item.amount.toString().includes(query.toLowerCase()) ||
      item.reference.toLowerCase().includes(query.toLowerCase()) ||
      (item.valueDate &&
        item.valueDate &&
        format(new Date(item.valueDate), dateFormat.is).includes(query)) ||
      (item.createDate &&
        item.createDate &&
        format(new Date(item.createDate), dateFormat.is).includes(query))
    ) {
      return true
    }
    return false
  })
  return filteredArray
}

export const billsFilter = (data: DocumentsListItemTypes[], query: string) => {
  if (!query) return data
  const filteredArray = data.filter((item) => {
    if (
      item.note?.toLowerCase().includes(query.toLowerCase()) ||
      item.sender.toLowerCase().includes(query.toLowerCase()) ||
      item.amount.toString().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase()) ||
      (item.date && format(new Date(item.date), dateFormat.is).includes(query))
    ) {
      return true
    }
    return false
  })
  return filteredArray
}
