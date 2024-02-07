import { createStore } from '@island.is/shared/mocking'
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
  const customerChargeType = getCustomerChargeTypeData
  const customerRecords = getCustomerRecordsData
  const documentsList = getDocumentsListData
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
