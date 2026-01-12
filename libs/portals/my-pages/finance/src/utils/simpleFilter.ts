import { DocumentsListItemTypes } from '../components/DocumentScreen/DocumentScreen.types'
import format from 'date-fns/format'
import { dateFormat } from '@island.is/shared/constants'
import { GetChargeTypesDetailsByYearQuery } from '../screens/FinanceTransactionPeriods/FinanceTransactionPeriods.generated'
import { CustomerRecordsDetails } from '../lib/types'

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

export const transactionPeriodFilter = (
  data: GetChargeTypesDetailsByYearQuery['getChargeTypesDetailsByYear']['chargeType'],
  query: string,
  select: string[],
) => {
  if (!query && !select.length) return data

  const q = query.toLowerCase()
  const filteredArray = data.filter((item) => {
    const foundInQuery = query
      ? item.name.toLowerCase().includes(q) ||
        item.chargeItemSubjects.toLowerCase().includes(q) ||
        item.chargeItemSubjectDescription.includes(q) ||
        format(new Date(item.lastMovementDate), dateFormat.is).includes(q)
      : true

    const foundInSelect = select.length ? select.includes(item.name) : true

    if (foundInQuery && foundInSelect) {
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
