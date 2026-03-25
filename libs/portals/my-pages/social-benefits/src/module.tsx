import { PortalModule } from '@island.is/portals/core'
import { m } from './lib/messages'
import {
  SocialBenefitsPaths,
  SocialInsuranceMaintenancePaths,
  SocialInsuranceMaintenanceLegacyPaths,
} from './lib/paths'
import { ApiScope } from '@island.is/auth/scopes'
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const SocialInsuranceMaintenancePaymentPlan = lazy(() =>
  import('./screens/PaymentPlan/PaymentPlan'),
)

const SocialInsuranceMaintenanceIncomePlan = lazy(() =>
  import('./screens/IncomePlan/IncomePlan'),
)

const SocialInsuranceMaintenanceIncomePlanDetail = lazy(() =>
  import('./screens/IncomePlanDetail/IncomePlanDetail'),
)

export const socialBenefitsModule: PortalModule = {
  name: 'Framfærsla',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    // Root redirect: /framfaersla → /framfaersla/almannatryggingar/greidsluaetlun
    {
      name: m.maintenance,
      path: SocialBenefitsPaths.SocialBenefitsRoot,
      enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
      key: 'SocialInsurance',
      element: (
        <Navigate
          to={SocialInsuranceMaintenancePaths.SocialInsurancePaymentPlan}
          replace
        />
      ),
    },
    // Section redirect: /framfaersla/almannatryggingar → /framfaersla/almannatryggingar/greidsluaetlun
    {
      name: m.maintenance,
      path: SocialInsuranceMaintenancePaths.SocialInsuranceRoot,
      enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
      key: 'SocialInsurance',
      element: (
        <Navigate
          to={SocialInsuranceMaintenancePaths.SocialInsurancePaymentPlan}
          replace
        />
      ),
    },
    // New paths — actual screens
    {
      name: m.paymentPlan,
      path: SocialInsuranceMaintenancePaths.SocialInsurancePaymentPlan,
      enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
      key: 'SocialInsurance',
      element: <SocialInsuranceMaintenancePaymentPlan />,
    },
    {
      name: m.incomePlan,
      path: SocialInsuranceMaintenancePaths.SocialInsuranceIncomePlan,
      enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
      key: 'SocialInsuranceIncomePlan',
      element: <SocialInsuranceMaintenanceIncomePlan />,
    },
    {
      name: m.incomePlanDetail,
      path: SocialInsuranceMaintenancePaths.SocialInsuranceIncomePlanDetail,
      enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
      key: 'SocialInsuranceIncomePlan',
      element: <SocialInsuranceMaintenanceIncomePlanDetail />,
    },
    // Legacy redirects — keep old URLs working
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
  ],
}
