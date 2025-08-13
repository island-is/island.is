import { Resolvers } from '../../types'
import { store } from './store'

export const resolvers: Resolvers = {
  Slice: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },

  Query: {
    getFinanceStatus: () => {
      return store.financeStatus
    },
    getDebtStatus: () => {
      return store.debtStatus
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
    getDocumentsList: () => {
      return store.documentsList
    },
    getFinanceDocument: () => {
      return store.financeDocuments
    },
    getCustomerTapControl: () => {
      return store.tapControl
    },
  },
}
