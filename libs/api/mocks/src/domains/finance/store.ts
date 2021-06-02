import { createStore } from '@island.is/shared/mocking'
import { CustomerChargeType, CustomerRecords } from '../../types'
import {
  getFinanceStatusData,
  getFinanceStatusDetailsData,
  getCustomerChargeTypeData,
  getCustomerRecordsData,
  getExcelDocumentData,
} from './static'

export const store = createStore(() => {
  const financeStatus = getFinanceStatusData
  const financeStatusDetails = getFinanceStatusDetailsData
  const customerChargeType: CustomerChargeType = getCustomerChargeTypeData
  const customerRecords: CustomerRecords = getCustomerRecordsData
  const excelDocument = getExcelDocumentData

  return {
    financeStatus,
    financeStatusDetails,
    customerChargeType,
    customerRecords,
    excelDocument,
  }
})
