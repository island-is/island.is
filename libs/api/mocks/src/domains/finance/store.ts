import { createStore } from '@island.is/shared/mocking'
import {
  CustomerChargeType,
  CustomerRecords,
  DocumentsListModel,
} from '../../types'
import {
  getFinanceStatusData,
  getFinanceStatusDetailsData,
  getCustomerChargeTypeData,
  getCustomerRecordsData,
  getDocumentsListData,
  getFinanceDocumentData,
  getExcelDocumentData,
  getCustomerTapControlData,
} from './static'

export const store = createStore(() => {
  const financeStatus = getFinanceStatusData
  const financeStatusDetails = getFinanceStatusDetailsData
  const customerChargeType: CustomerChargeType = getCustomerChargeTypeData
  const customerRecords: CustomerRecords = getCustomerRecordsData
  const documentsList: DocumentsListModel = getDocumentsListData
  const tapControl = getCustomerTapControlData
  const financeDocuments = getFinanceDocumentData
  const excelDocument = getExcelDocumentData

  return {
    financeStatus,
    financeStatusDetails,
    customerChargeType,
    customerRecords,
    documentsList,
    financeDocuments,
    excelDocument,
    tapControl,
  }
})
