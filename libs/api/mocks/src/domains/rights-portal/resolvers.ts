import { Resolvers } from '../../types'
import { store } from './store'

export const resolvers: Resolvers = {
  Slice: {
    __resolveType: (parent) => {
      return parent.__typename as never
    },
  },

  Query: {
    rightsPortalCopaymentStatus: () => {
      return store.getCopaymentStatus
    },
    rightsPortalCopaymentPeriods: () => {
      return store.getCopaymentPeriods
    },
    rightsPortalCopaymentBills: () => {
      return store.getCopaymentBills
    },
    rightsPortalPaymentOverview: () => {
      return store.getPaymentOverview
    },
    rightsPortalPaymentOverviewServiceTypes: () => {
      return store.getPaymentOverviewServiceTypes
    },
    rightsPortalPaymentOverviewDocument: () => {
      return store.getPaymentOverviewDocument
    },
  },
}
