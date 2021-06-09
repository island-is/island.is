import { createStore } from '@island.is/shared/mocking'
import {
  CustomerChargeType,
  CustomerRecords,
  BillReceiptModel,
} from '../../types'
import {
  getFinanceStatusData,
  getFinanceStatusDetailsData,
  getCustomerChargeTypeData,
  getCustomerRecordsData,
  getBillReceiptsData,
  getFinanceDocumentData,
  getExcelDocumentData,
} from './static'

export const store = createStore(() => {
  const financeStatus = getFinanceStatusData
  const financeStatusDetails = getFinanceStatusDetailsData
  const customerChargeType: CustomerChargeType = getCustomerChargeTypeData
  const customerRecords: CustomerRecords = getCustomerRecordsData
  const billReceipts: BillReceiptModel = getBillReceiptsData
  const financeDocuments = getFinanceDocumentData // TODO: Add factories
  const excelDocument = getExcelDocumentData // TODO: Add factories

  return {
    financeStatus,
    financeStatusDetails,
    customerChargeType,
    customerRecords,
    billReceipts,
    financeDocuments,
    excelDocument,
  }
})
