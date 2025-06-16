import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import { SocialInsuranceMaintenancePaths } from './paths'

export const socialInsuranceMaintenanceNavigation: PortalNavigationItem = {
  name: m.socialInsuranceMaintenance,
  description: m.socialInsuranceMaintenanceIntro,
  path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceRoot,
  icon: {
    icon: 'cardWithCheckmark',
  },
  children: [
    {
      name: m.paymentPlan,
      description: m.socialInsuranceMaintenanceDescription,
      path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenancePaymentPlan,
      children: [
        {
          name: m.paymentPlan,
          path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenancePaymentPlan,
          breadcrumbHide: true,
          navHide: true,
        },
        {
          name: m.paymentsReasoning,
          path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenancePaymentsReasoning,
          navHide: true,
        },
      ],
    },
    {
      name: m.incomePlan,
      description: m.incomePlanDescription,
      path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceIncomePlan,
      children: [
        {
          name: m.latestIncomePlan,
          path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceIncomePlanDetail,
          navHide: true,
        },
      ],
    },
  ],
}
