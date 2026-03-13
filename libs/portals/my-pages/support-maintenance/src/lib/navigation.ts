import { PortalNavigationItem } from '@island.is/portals/core'
import { m as coreMessages } from '@island.is/portals/my-pages/core'
import { moduleMessages as m } from './messages'
import { SupportMaintenancePaths } from './paths'

export const supportMaintenanceNavigation: PortalNavigationItem = {
  name: m.supportMaintenance,
  description: m.supportMaintenanceDescription,
  intro: m.supportMaintenanceIntro,
  path: SupportMaintenancePaths.SupportMaintenanceRoot,
  icon: {
    icon: 'cardWithCheckmark',
  },
  children: [
    // ── Social Insurance (Almannatryggingar) ───────────────────────────────────
    {
      name: m.socialInsurance,
      description: m.socialInsuranceDescription,
      path: SupportMaintenancePaths.SupportMaintenanceSocialInsuranceRoot,
      children: [
        {
          name: coreMessages.paymentPlan,
          description: coreMessages.socialInsuranceMaintenanceDescription,
          path: SupportMaintenancePaths.SupportMaintenancePaymentPlan,
          children: [
            {
              name: coreMessages.paymentPlan,
              path: SupportMaintenancePaths.SupportMaintenancePaymentPlan,
              breadcrumbHide: true,
              navHide: true,
            },
            {
              name: coreMessages.paymentsReasoning,
              path: SupportMaintenancePaths.SupportMaintenancePaymentsReasoning,
              navHide: true,
            },
          ],
        },
        {
          name: coreMessages.incomePlan,
          description: coreMessages.incomePlanDescription,
          path: SupportMaintenancePaths.SupportMaintenanceIncomePlan,
          children: [
            {
              name: coreMessages.latestIncomePlan,
              path: SupportMaintenancePaths.SupportMaintenanceIncomePlanDetail,
              navHide: true,
            },
          ],
        },
      ],
    },

    // ── Unemployment (Atvinnuleysi) ──────────────────────────────────────────────
    {
      name: m.unemployment,
      description: m.unemploymentDescription,
      path: SupportMaintenancePaths.SupportMaintenanceUnemploymentRoot,
      children: [
        {
          // Visible in the sidebar ONLY when the user has active unemployment
          // benefits (path is added to activeDynamicRoutes by useDynamicRoutes).
          name: m.unemploymentStatusTitle,
          description: m.unemploymentStatusDescription,
          path: SupportMaintenancePaths.SupportMaintenanceUnemploymentStatus,
        },
      ],
    },
  ],
}
