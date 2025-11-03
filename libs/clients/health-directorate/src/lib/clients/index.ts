export * from './occupational-license'
export * from './vaccinations'
export {
  HealthDirectorateOrganDonationClientConfig,
  HealthDirectorateOrganDonationService,
  OrganDonorDto,
  Locale as organLocale,
} from './organ-donation'
export {
  HealthDirectorateHealthClientConfig,
  HealthDirectorateHealthService,
  PrescribedItemCategory,
  PrescriptionRenewalBlockedReason,
  PrescriptionRenewalStatus,
  PrescriptionRenewalRequestDto,
  EuPatientConsentStatus,
  EuPatientConsentDto,
} from './health'
