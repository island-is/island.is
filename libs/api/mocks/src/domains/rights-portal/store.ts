import { createStore } from '@island.is/shared/mocking'

import * as data from './static'
import {
  RightsPortalCopaymentBillResponse,
  RightsPortalCopaymentPeriodResponse,
  RightsPortalCopaymentStatusResponse,
  RightsPortalPaymentOverviewDocumentResponse,
  RightsPortalPaymentOverviewResponse,
  RightsPortalPaymentOverviewServiceTypeResponse,
} from '../../types'

export const store = createStore(() => {
  const paymentOverviewServiceType: RightsPortalPaymentOverviewServiceTypeResponse =
    data.getPaymentOverviewStatus
  const getPaymentOverview: RightsPortalPaymentOverviewResponse =
    data.getPaymentOverviewBills
  const paymentOverviewDocument: RightsPortalPaymentOverviewDocumentResponse =
    data.getPaymentOverviewDocument
  const rightsPortalCopaymentStatus: RightsPortalCopaymentStatusResponse =
    data.getCopaymentStatus
  const copaymentPeriods: RightsPortalCopaymentPeriodResponse =
    data.getCopaymentPeriods
  const copaymentPeriodBills: RightsPortalCopaymentBillResponse =
    data.getCopaymentPeriodBills

  return {
    paymentOverviewServiceType,
    getPaymentOverview,
    paymentOverviewDocument,
    rightsPortalCopaymentStatus,
    copaymentPeriods,
    copaymentPeriodBills,
  }
})
