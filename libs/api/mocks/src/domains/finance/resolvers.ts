import { Resolvers } from '../../types'
import { store } from './store'

export const resolvers: Resolvers = {
  Slice: {
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },

  Query: {
    getFinanceStatus: () => {
      return store.financeStatus
    },
    getFinanceStatusDetails: () => {
      return store.financeStatusDetails
    },
    getCustomerChargeType: () => {
      return store.customerChargeType
    },
    getCustomerRecords: () => {
      return store.customerRecords
    },
    getBillReceipts: () => {
      return store.billReceipts
    },
    getFinanceDocument: () => {
      return store.financeDocuments
    },
    getExcelDocument: () => {
      return store.excelDocument
    },
    getCustomerTapControl: () => {
      return store.tapControl
    },
  },
}
