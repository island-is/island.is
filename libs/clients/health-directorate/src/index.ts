export { HealthDirectorateClientModule } from './lib/healthDirectorateClient.module'
export * from './lib/healthDirectorateClient.types'
export * from './lib/clients/occupational-license/gen/fetch'
export {
  HealthDirectorateVaccinationsClientConfig,
  HealthDirectorateOrganDonationClientConfig,
  HealthDirectorateHealthClientConfig,
  HealthDirectorateClientConfig,
  HealthDirectorateVaccinationsService,
  HealthDirectorateClientService,
  HealthDirectorateHealthService,
  HealthDirectorateOrganDonationService,
  OrganDonorDto,
  Locale,
  organLocale,
  VaccinationDto,
  DiseaseVaccinationDtoVaccinationStatusEnum,
  PrescribedItemCategory,
  PrescriptionRenewalBlockedReason,
  PrescriptionRenewalStatus,
  PrescriptionRenewalRequestDto,
  PrescriptionCommissionDto,
  EuPatientConsentDto,
  EuPatientConsentStatus,
  PrescriptionCommissionStatus,
  CreateEuPatientConsentDto,
} from './lib/clients'
export {
  DispensationHistoryItemDto,
  AppointmentStatus,
} from './lib/clients/health'
