import { PortalModule } from '@island.is/portals/core'
import { ApiScope } from '@island.is/auth/scopes'
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { moduleMessages as m } from './lib/messages'
import { SupportMaintenancePaths } from './lib/paths'

const SupportMaintenancePaymentPlan = lazy(() =>
  import('./screens/PaymentPlan/PaymentPlan'),
)

const SupportMaintenanceIncomePlan = lazy(() =>
  import('./screens/IncomePlan/IncomePlan'),
)

const SupportMaintenanceIncomePlanDetail = lazy(() =>
  import('./screens/IncomePlanDetail/IncomePlanDetail'),
)

const SupportMaintenanceOverview = lazy(() =>
  import('./screens/Overview/Overview'),
)

const UnemploymentOverview = lazy(() =>
  import('./screens/Unemployment/UnemploymentOverview'),
)

const UnemploymentStatus = lazy(() =>
  import('./screens/Unemployment/UnemploymentStatus'),
)

export const supportMaintenanceModule: PortalModule = {
  name: 'Framfærsla',
  enabled: ({ isCompany }) => !isCompany,
  routes: ({ userInfo }) => [
    // ── Umbrella root: overview landing page (no key = always present) ─────────
    {
      name: m.supportMaintenance,
      path: SupportMaintenancePaths.SupportMaintenanceRoot,
      element: <SupportMaintenanceOverview />,
    },

    // ── Unemployment landing page ──────────────────────────────────────────────
    {
      name: m.unemployment,
      path: SupportMaintenancePaths.SupportMaintenanceUnemploymentRoot,
      element: <UnemploymentOverview />,
    },

    // ── Unemployment: Staðan þín (dynamic – only appears in nav when user is active)
    // The route is always accessible by URL; the sidebar link is suppressed by
    // useDynamicRoutes until the unemployment-status API confirms active benefits.
    {
      name: m.unemploymentStatusTitle,
      path: SupportMaintenancePaths.SupportMaintenanceUnemploymentStatus,
      dynamic: true,
      element: <UnemploymentStatus />,
    },

    // ── Social Insurance section root redirect ─────────────────────────────────
    // Reuses the existing 'SocialInsurance' feature flag key so no new flag is needed.
    {
      name: m.socialInsurance,
      path: SupportMaintenancePaths.SupportMaintenanceSocialInsuranceRoot,
      enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
      key: 'SocialInsurance',
      element: (
        <Navigate
          to={SupportMaintenancePaths.SupportMaintenancePaymentPlan}
          replace
        />
      ),
    },

    // ── Social Insurance screens ───────────────────────────────────────────────
    {
      name: m.supportMaintenance,
      path: SupportMaintenancePaths.SupportMaintenancePaymentPlan,
      enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
      key: 'SocialInsurance',
      element: <SupportMaintenancePaymentPlan />,
    },
    {
      name: m.supportMaintenance,
      path: SupportMaintenancePaths.SupportMaintenanceIncomePlan,
      enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
      key: 'SocialInsuranceIncomePlan',
      element: <SupportMaintenanceIncomePlan />,
    },
    {
      name: m.supportMaintenance,
      path: SupportMaintenancePaths.SupportMaintenanceIncomePlanDetail,
      enabled: userInfo.scopes.includes(ApiScope.socialInsuranceAdministration),
      key: 'SocialInsuranceIncomePlan',
      element: <SupportMaintenanceIncomePlanDetail />,
    },

    // ── Legacy redirects from old flat paths (no key = always present) ─────────
    {
      name: m.supportMaintenance,
      path: SupportMaintenancePaths.LegacyPaymentPlan,
      element: (
        <Navigate
          to={SupportMaintenancePaths.SupportMaintenancePaymentPlan}
          replace
        />
      ),
    },
    {
      name: m.supportMaintenance,
      path: SupportMaintenancePaths.LegacyPaymentsReasoning,
      element: (
        <Navigate
          to={SupportMaintenancePaths.SupportMaintenancePaymentsReasoning}
          replace
        />
      ),
    },
    {
      name: m.supportMaintenance,
      path: SupportMaintenancePaths.LegacyIncomePlan,
      element: (
        <Navigate
          to={SupportMaintenancePaths.SupportMaintenanceIncomePlan}
          replace
        />
      ),
    },
    {
      name: m.supportMaintenance,
      path: SupportMaintenancePaths.LegacyIncomePlanDetail,
      element: (
        <Navigate
          to={SupportMaintenancePaths.SupportMaintenanceIncomePlanDetail}
          replace
        />
      ),
    },
  ],
}
