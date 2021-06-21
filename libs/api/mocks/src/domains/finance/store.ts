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
  getExcelDocumentData,
  getCustomerTapControlData,
} from './static'
import { application } from './factories'

export const store = createStore(() => {
  const financeStatus = getFinanceStatusData
  const financeStatusDetails = getFinanceStatusDetailsData
  const customerChargeType: CustomerChargeType = getCustomerChargeTypeData
  const customerRecords: CustomerRecords = getCustomerRecordsData
  const billReceipts: BillReceiptModel = getBillReceiptsData
  const tapControl = getCustomerTapControlData
  const excelDocument = getExcelDocumentData
  const financeDocuments = {
    docment: application,
  }

  return {
    financeStatus,
    financeStatusDetails,
    customerChargeType,
    customerRecords,
    billReceipts,
    financeDocuments,
    excelDocument,
    tapControl,
  }
})
