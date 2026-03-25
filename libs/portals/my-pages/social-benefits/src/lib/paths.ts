export enum SocialBenefitsPaths {
  SocialBenefitsRoot = '/framfaersla',
}

export enum SocialInsuranceMaintenancePaths {
  SocialInsuranceRoot = '/framfaersla/almannatryggingar',
  SocialInsurancePaymentPlan = '/framfaersla/almannatryggingar/greidsluaetlun',
  SocialInsurancePaymentsReasoning = '/framfaersla/almannatryggingar/forsendur-greidslna',
  SocialInsuranceIncomePlan = '/framfaersla/almannatryggingar/tekjuaaetlun',
  SocialInsuranceIncomePlanDetail = '/framfaersla/almannatryggingar/tekjuaaetlun/nuverandi',
}

/** @deprecated Use SocialInsurancePaths instead — these legacy paths are kept for redirects */
export enum SocialInsuranceMaintenanceLegacyPaths {
  SocialInsuranceMaintenancePaymentPlan = '/framfaersla/greidsluaetlun',
  SocialInsuranceMaintenancePaymentsReasoning = '/framfaersla/forsendur-greidslna',
  SocialInsuranceMaintenanceIncomePlan = '/framfaersla/tekjuaaetlun',
  SocialInsuranceMaintenanceIncomePlanDetail = '/framfaersla/tekjuaaetlun/nuverandi',
}
