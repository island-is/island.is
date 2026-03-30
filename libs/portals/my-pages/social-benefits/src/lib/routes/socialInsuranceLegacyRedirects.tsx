import { PortalRoute } from '@island.is/portals/core'
import { ApiScope } from '@island.is/auth/scopes'
import { Navigate } from 'react-router-dom'
import { BffUser } from '@island.is/shared/types'
import { m } from '../messages'
import {
  SocialInsuranceMaintenancePaths,
  SocialInsuranceMaintenanceLegacyPaths,
} from '../paths'

export const socialInsuranceLegacyRedirects = (
  userInfo: BffUser,
): PortalRoute[] => [
  {
    name: m.paymentPlan,
    path: SocialInsuranceMaintenanceLegacyPaths.SocialInsuranceMaintenancePaymentPlan,
    enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
    key: 'SocialInsurance',
    element: (
      <Navigate
        to={SocialInsuranceMaintenancePaths.SocialInsurancePaymentPlan}
        replace
      />
    ),
  },
  {
    name: m.incomePlan,
    path: SocialInsuranceMaintenanceLegacyPaths.SocialInsuranceMaintenanceIncomePlan,
    enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
    key: 'SocialInsuranceIncomePlan',
    element: (
      <Navigate
        to={SocialInsuranceMaintenancePaths.SocialInsuranceIncomePlan}
        replace
      />
    ),
  },
  {
    name: m.incomePlanDetail,
    path: SocialInsuranceMaintenanceLegacyPaths.SocialInsuranceMaintenanceIncomePlanDetail,
    enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
    key: 'SocialInsuranceIncomePlan',
    element: (
      <Navigate
        to={SocialInsuranceMaintenancePaths.SocialInsuranceIncomePlanDetail}
        replace
      />
    ),
  },
  {
    name: m.paymentsReasoning,
    path: SocialInsuranceMaintenanceLegacyPaths.SocialInsuranceMaintenancePaymentsReasoning,
    enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
    key: 'SocialInsurance',
    element: (
      <Navigate
        to={SocialInsuranceMaintenancePaths.SocialInsurancePaymentsReasoning}
        replace
      />
    ),
  },
]
