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
    rightsPortalHealthCenterRegistrationHistory: () => {
      return store.getHealthCenterRegistrationHistory
    },
    rightsPortalInsuranceOverview: () => {
      return store.getInsuranceOverview
    },
    rightsPortalCopaymentStatus: () => {
      return store.getCopaymentStatus
    },
    rightsPortalDrugPeriods: () => {
      return store.getDrugPeriods
    },
  },
}
