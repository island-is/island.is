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

  return {
    financeStatus,
    financeStatusDetails,
    customerChargeType,
    customerRecords,
    documentsList,
    financeDocuments,
    tapControl,
  }
})
