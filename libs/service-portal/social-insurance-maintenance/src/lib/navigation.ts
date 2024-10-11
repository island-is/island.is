import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/service-portal/core'
import { SocialInsuranceMaintenancePaths } from './paths'

export const socialInsuranceMaintenanceNavigation: PortalNavigationItem = {
  name: m.socialInsuranceMaintenance,
  description: m.socialInsuranceMaintenanceIntro,
  displayIntroHeader: true,
  serviceProvider: 'tryggingastofnun',
  serviceProviderTooltip: m.socialInsuranceTooltip,
  path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceRoot,
  icon: {
    icon: 'cardWithCheckmark',
  },
  children: [
    {
      name: m.paymentPlan,
      displayIntroHeader: true,
      intro: m.socialInsuranceMaintenanceDescription,
      path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenancePaymentPlan,
      children: [
        {
          displayIntroHeader: true,
          name: m.paymentPlan,
          path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenancePaymentPlan,
          breadcrumbHide: true,
          navHide: true,
        },
        {
          displayIntroHeader: true,
          name: m.paymentsReasoning,
          path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenancePaymentsReasoning,
          navHide: true,
        },
      ],
    },
    {
      name: m.incomePlan,
      displayIntroHeader: true,
      intro: m.incomePlanDescription,
      path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceIncomePlan,
      children: [
        {
          name: m.latestIncomePlan,
          displayIntroHeader: true,
          intro: m.incomePlanDetail,
          path: SocialInsuranceMaintenancePaths.SocialInsuranceMaintenanceIncomePlanDetail,
          navHide: true,
        },
      ],
    },
  ],
}
