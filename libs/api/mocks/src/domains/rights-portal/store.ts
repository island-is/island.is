import { createStore } from '@island.is/shared/mocking'

import * as data from './static'
import {
  RightsPortalCopaymentBillResponse,
  RightsPortalCopaymentPeriodResponse,
  RightsPortalCopaymentStatusResponse,
  RightsPortalPaymentOverviewBillResponse,
  RightsPortalPaymentOverviewDocumentResponse,
  RightsPortalPaymentOverviewStatusResponse,
} from '../../types'

export const store = createStore(() => {
  const paymentOverviewStatus: RightsPortalPaymentOverviewStatusResponse =
    data.getPaymentOverviewStatus
  const paymentOverviewBills: RightsPortalPaymentOverviewBillResponse =
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
    paymentOverviewStatus,
    paymentOverviewBills,
    paymentOverviewDocument,
    rightsPortalCopaymentStatus,
    copaymentPeriods,
    copaymentPeriodBills,
  }
})
