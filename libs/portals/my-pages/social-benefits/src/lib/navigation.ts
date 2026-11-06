import { PortalNavigationItem } from '@island.is/portals/core'
import { m } from '@island.is/portals/my-pages/core'
import {
  ActivationAllowancePaths,
  SocialBenefitsPaths,
  SocialInsuranceMaintenancePaths,
  UnemploymentBenefitsPaths,
} from './paths'

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
        {
          name: m.personalTaxCredit,
          description: m.personalTaxCreditDescription,
          path: SocialInsuranceMaintenancePaths.SocialInsurancePersonalTaxCredit,
        },
        {
          name: m.paymentTypesOverview,
          description: m.paymentTypesOverviewDescription,
          path: SocialInsuranceMaintenancePaths.SocialInsurancePaymentTypesOverview,
        },
      ],
    },
    {
      name: m.unemploymentBenefits,
      path: UnemploymentBenefitsPaths.Root,
      children: [
        {
          name: m.myStatus,
          path: UnemploymentBenefitsPaths.Status,
        },
        {
          name: m.myIncome,
          path: UnemploymentBenefitsPaths.Income,
        },
        {
          name: m.myData,
          path: UnemploymentBenefitsPaths.MyData,
        },
      ],
    },
    {
      name: m.activationAllowance,
      path: ActivationAllowancePaths.Root,
      children: [
        {
          name: m.myStatus,
          path: ActivationAllowancePaths.Status,
        },
        {
          name: m.myData,
          path: ActivationAllowancePaths.MyData,
        },
      ],
    },
  ],
}
