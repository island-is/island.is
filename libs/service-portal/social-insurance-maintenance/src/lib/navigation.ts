import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { SocialInsuranceMaintenancePaths } from './paths'

export const socialInsuranceMaintenanceNavigation: PortalNavigationItem = {
  name: m.socialInsuranceMaintenance,
  description: m.socialInsuranceMaintenanceIntro,
  serviceProvider: 'tryggingastofnun',
  serviceProviderTooltip: m.socialInsuranceTooltip,
  path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceRoot,
  icon: {
    icon: 'cardWithCheckmark',
  },
  children: [
    {
      name: m.paymentPlan,
      intro: m.socialInsuranceMaintenanceDescription,
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
      intro: m.incomePlanDescription,
      path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceIncomePlan,
      children: [
        {
          name: m.latestIncomePlan,
          intro: m.incomePlanDetail,
          path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceIncomePlanDetail,
          navHide: true,
        },
      ],
    },
  ],
}
