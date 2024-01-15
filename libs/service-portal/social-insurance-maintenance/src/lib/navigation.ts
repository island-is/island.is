import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { SocialInsuranceMaintenancePaths } from './paths'

export const socialInsuranceMaintenanceNavigation: PortalNavigationItem = {
  name: m.socialInsuranceMaintenance,
  path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceRoot,
  icon: {
    icon: 'gridView',
  },
  children: [
    {
      name: m.paymentPlan,
      path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenancePaymentPlan,
      children: [
        {
          name: m.paymentPlan,
          path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenancePaymentPlan,
          navHide: true,
        },
        {
          name: m.paymentsReasoning,
          path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenancePaymentsReasoning,
          navHide: true,
        },
      ],
    },
  ],
}
