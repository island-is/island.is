import { createStore } from '@island.is/shared/mocking'

import * as data from './static'
import {
  RightsPortalCopaymentBillResponse,
  RightsPortalCopaymentPeriodResponse,
  RightsPortalPaymentOverviewDocumentResponse,
  RightsPortalPaymentOverviewResponse,
  RightsPortalCopaymentStatus,
  RightsPortalPaymentOverviewServiceTypeResponse,
  RightsPortalHealthCenterRegistrationHistory,
  RightsPortalInsuranceOverview,
  RightsPortalDrugPeriod,
} from '../../types'

export const store = createStore(() => {
  const getPaymentOverviewServiceTypes: RightsPortalPaymentOverviewServiceTypeResponse =
    data.getPaymentOverviewServiceTypes
  const getPaymentOverview: RightsPortalPaymentOverviewResponse =
    data.getPaymentOverview
  const getPaymentOverviewDocument: RightsPortalPaymentOverviewDocumentResponse =
    data.getPaymentOverviewDocument
  const getCopaymentStatus: RightsPortalCopaymentStatus =
    data.getCopaymentStatus
  const getCopaymentPeriods: RightsPortalCopaymentPeriodResponse =
    data.getCopaymentPeriods
  const getCopaymentBills: RightsPortalCopaymentBillResponse =
    data.getCopaymentBills
  const getHealthCenterRegistrationHistory: RightsPortalHealthCenterRegistrationHistory =
    data.getHealthCenterRegistrationHistory
  const getInsuranceOverview: RightsPortalInsuranceOverview =
    data.getInsuranceOverview
  const getDrugPeriods: Array<RightsPortalDrugPeriod> = data.drugPeriods

  return {
    getPaymentOverviewServiceTypes,
    getPaymentOverview,
    getPaymentOverviewDocument,
    getCopaymentStatus,
    getCopaymentPeriods,
    getCopaymentBills,
    getHealthCenterRegistrationHistory,
    getInsuranceOverview,
    getDrugPeriods,
  }
})
