import { PortalModule } from '@island.is/portals/core'
import { m } from './lib/messages'
import { SocialInsuranceMaintenancePaths } from './lib/paths'
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

const SocialInsuranceMaintenanceBankAccount = lazy(() =>
  import('./screens/BankAccount/BankAccount'),
)

export const socialInsuranceMaintenanceModule: PortalModule = {
  name: 'Framfærsla',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: m.maintenance,
      path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceRoot,
      enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
      key: 'SocialInsurance',
      element: (
        <Navigate
          to={
            SocialInsuranceMaintenancePaths.SocialInsuranceMaintenancePaymentPlan
          }
          replace
        />
      ),
    },
    {
      name: m.paymentPlan,
      path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenancePaymentPlan,
      enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
      key: 'SocialInsurance',
      element: <SocialInsuranceMaintenancePaymentPlan />,
    },
    {
      name: m.incomePlan,
      path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceIncomePlan,
      enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
      key: 'SocialInsuranceIncomePlan',
      element: <SocialInsuranceMaintenanceIncomePlan />,
    },
    {
      name: m.incomePlanDetail,
      path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceIncomePlanDetail,
      enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
      key: 'SocialInsuranceIncomePlan',
      element: <SocialInsuranceMaintenanceIncomePlanDetail />,
    },
    {
      name: m.accountingInformation,
      path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceAccountingInformation,
      enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
      element: (
        <Navigate
          to={
            SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceBankAccount
          }
          replace
        />
      ),
    },
    {
      name: m.bankAccount,
      path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceBankAccount,
      enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
      element: <SocialInsuranceMaintenanceBankAccount />,
    },
  ],
}
