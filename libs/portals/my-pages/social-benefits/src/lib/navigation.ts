import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import {
  SocialBenefitsPaths,
  SocialInsuranceMaintenancePaths,
  UnemploymentBenefitsPaths,
} from './paths'
import { sharedMessages } from './messages'
import { unemploymentBenefitsMessages } from './messages/unemployment'

export const socialBenefitsNavigation: PortalNavigationItem = {
  name: m.socialInsuranceMaintenance,
  description: m.socialInsuranceMaintenanceIntro,
  path: SocialBenefitsPaths.SocialBenefitsRoot,
  icon: {
    icon: 'cardWithCheckmark',
  },
  children: [
    {
      name: m.socialSecurity,
      path: SocialInsuranceMaintenancePaths.SocialInsuranceRoot,
      children: [
        {
          name: m.paymentPlan,
          description: m.socialInsuranceMaintenanceDescription,
          path: SocialInsuranceMaintenancePaths.SocialInsurancePaymentPlan,
          children: [
            {
              name: m.paymentPlan,
              path: SocialInsuranceMaintenancePaths.SocialInsurancePaymentPlan,
              breadcrumbHide: true,
              navHide: true,
            },
            {
              name: m.paymentsReasoning,
              path: SocialInsuranceMaintenancePaths.SocialInsurancePaymentsReasoning,
              navHide: true,
            },
          ],
        },
        {
          name: m.incomePlan,
          description: m.incomePlanDescription,
          path: SocialInsuranceMaintenancePaths.SocialInsuranceIncomePlan,
          children: [
            {
              name: m.latestIncomePlan,
              path: SocialInsuranceMaintenancePaths.SocialInsuranceIncomePlanDetail,
              navHide: true,
            },
          ],
        },
      ],
    },
    {
      name: unemploymentBenefitsMessages.unemploymentBenefits,
      path: UnemploymentBenefitsPaths.Root,
      children: [
        {
          name: sharedMessages.myStatus,
          path: UnemploymentBenefitsPaths.Status,
        },
      ],
    },
  ],
}
