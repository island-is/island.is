import { PortalModule } from '@island.is/portals/core'
import { m } from './lib/messages'
import { SocialInsuranceMaintenancePaths } from './lib/paths'
import { ApiScope } from '@island.is/auth/scopes'
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const SocialInsuranceMaintenancePaymentPlan = lazy(() =>
  import('./screens/PaymentPlan/PaymentPlan'),
)

export const socialInsuranceMaintenanceModule: PortalModule = {
  name: 'Framfærsla',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    {
      name: m.maintenance,
      path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceRoot,
      enabled: userInfo.scopes.includes(ApiScope.internal),
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
      enabled: userInfo.scopes.includes(ApiScope.internal),
      key: 'SocialInsurance',
      element: <SocialInsuranceMaintenancePaymentPlan />,
    },
  ],
}
