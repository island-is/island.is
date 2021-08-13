import { CustomerRecordsDetails } from '../screens/FinanceTransactions/FinanceTransactionsData.types'

export const simpleFilter = (data: CustomerRecordsDetails[], query: string) => {
  const filteredArray = data.filter((item) => {
    if (!query) return true
    if (
      item.accountReference.toLowerCase().includes(query.toLowerCase()) ||
      item?.actionCategory?.toLowerCase().includes(query.toLowerCase()) ||
      item?.category?.toLowerCase().includes(query.toLowerCase()) ||
      item?.chargeItemSubject?.toLowerCase().includes(query.toLowerCase()) ||
      item?.collectingOrganization
        ?.toLowerCase()
        .includes(query.toLowerCase()) ||
      item?.itemCode?.toLowerCase().includes(query.toLowerCase()) ||
      item?.performingOrganization
        ?.toLowerCase()
        .includes(query.toLowerCase()) ||
      item?.subCategory?.toLowerCase().includes(query.toLowerCase()) ||
      item?.reference?.toLowerCase().includes(query.toLowerCase())
    ) {
      return true
    }
  })
  return filteredArray
}
