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
      return store.rightsPortalCopaymentStatus
    },
    rightsPortalCopaymentPeriods: () => {
      return store.copaymentPeriods
    },
    rightsPortalCopaymentBills: () => {
      return store.copaymentPeriodBills
    },
    rightsPortalPaymentOverviewBills: () => {
      return store.paymentOverviewBills
    },
    rightsPortalPaymentOverviewStatus: () => {
      return store.paymentOverviewStatus
    },
    rightsPortalPaymentOverviewDocument: () => {
      return store.paymentOverviewDocument
    },
  },
}
