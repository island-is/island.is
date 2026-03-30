import { PortalRoute } from '@island.is/portals/core'
import { ApiScope } from '@island.is/auth/scopes'
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { BffUser } from '@island.is/shared/types'
import { m } from '../messages'
import { SocialInsuranceMaintenancePaths } from '../paths'

const PaymentPlan = lazy(() =>
  import('../../screens/social-insurance/PaymentPlan/PaymentPlan'),
)

const IncomePlan = lazy(() =>
  import('../../screens/social-insurance/IncomePlan/IncomePlan'),
)

const IncomePlanDetail = lazy(() =>
  import('../../screens/social-insurance/IncomePlanDetail/IncomePlanDetail'),
)

const PersonalTaxCredit = lazy(() =>
  import('../../screens/social-insurance/PersonalTaxCredit/PersonalTaxCredit'),
)

const PaymentTypes = lazy(() =>
  import('../../screens/social-insurance/PaymentTypes/PaymentTypes'),
)

export const socialInsuranceRoutes = (userInfo: BffUser): PortalRoute[] => [
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
  {
    name: m.paymentPlan,
    path: SocialInsuranceMaintenancePaths.SocialInsurancePaymentPlan,
    enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
    key: 'SocialInsurance',
    element: <PaymentPlan />,
  },
  {
    name: m.incomePlan,
    path: SocialInsuranceMaintenancePaths.SocialInsuranceIncomePlan,
    enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
    key: 'SocialInsuranceIncomePlan',
    element: <IncomePlan />,
  },
  {
    name: m.incomePlanDetail,
    path: SocialInsuranceMaintenancePaths.SocialInsuranceIncomePlanDetail,
    enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
    key: 'SocialInsuranceIncomePlan',
    element: <IncomePlanDetail />,
  },
  {
    name: m.personalTaxCredit,
    path: SocialInsuranceMaintenancePaths.SocialInsurancePersonalTaxCredit,
    enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
    key: 'MyPagesTRPersonalTaxCredit',
    element: <PersonalTaxCredit />,
  },
  {
    name: m.paymentTypesOverview,
    path: SocialInsuranceMaintenancePaths.SocialInsurancePaymentTypesOverview,
    enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
    key: 'MyPagesTRPaymentTypesOverview',
    element: <PaymentTypes />,
  },
]
