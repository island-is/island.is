// ATTENTION -> When adding or changing paths, please always make sure to redirect old paths.

export enum SupportMaintenancePaths {
  // Umbrella root
  SupportMaintenanceRoot = '/framfaersla',

  // ── Social Insurance (Almannatryggingar) ────────────────────────────────────
  SupportMaintenanceSocialInsuranceRoot = '/framfaersla/almannatryggingar',
  SupportMaintenancePaymentPlan = '/framfaersla/almannatryggingar/greidsluaetlun',
  SupportMaintenancePaymentsReasoning = '/framfaersla/almannatryggingar/forsendur-greidslna',
  SupportMaintenanceIncomePlan = '/framfaersla/almannatryggingar/tekjuaaetlun',
  SupportMaintenanceIncomePlanDetail = '/framfaersla/almannatryggingar/tekjuaaetlun/nuverandi',

  // ── Unemployment (Atvinnuleysi) ─────────────────────────────────────────────────────
  SupportMaintenanceUnemploymentRoot = '/framfaersla/atvinnuleysisbaetur',
  SupportMaintenanceUnemploymentStatus = '/framfaersla/atvinnuleysisbaetur/stadan',

  // ── Legacy redirects (old flat paths from social-insurance-maintenance) ─────
  //LegacySocialInsuranceMaintenanceRoot = '/framfaersla',
  LegacyPaymentPlan = '/framfaersla/greidsluaetlun',
  LegacyPaymentsReasoning = '/framfaersla/forsendur-greidslna',
  LegacyIncomePlan = '/framfaersla/tekjuaaetlun',
  LegacyIncomePlanDetail = '/framfaersla/tekjuaaetlun/nuverandi',
}
