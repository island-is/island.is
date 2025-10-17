import {
  DiseaseVaccinationDtoVaccinationStatusEnum,
  PrescriptionRenewalBlockedReason,
  PrescribedItemCategory,
  PrescriptionRenewalStatus,
} from '@island.is/clients/health-directorate'
import {
  PrescribedItemCategoryEnum,
  PrescribedItemRenewalBlockedReasonEnum,
  PrescribedItemRenewalStatusEnum,
  VaccinationStatusEnum,
} from '../models/enums'

export const mapVaccinationStatus = (
  status?: DiseaseVaccinationDtoVaccinationStatusEnum,
): VaccinationStatusEnum => {
  switch (status) {
    case DiseaseVaccinationDtoVaccinationStatusEnum.Valid:
      return VaccinationStatusEnum.valid
    case DiseaseVaccinationDtoVaccinationStatusEnum.Complete:
      return VaccinationStatusEnum.complete
    case DiseaseVaccinationDtoVaccinationStatusEnum.Expired:
      return VaccinationStatusEnum.expired
    case DiseaseVaccinationDtoVaccinationStatusEnum.Incomplete:
      return VaccinationStatusEnum.incomplete
    case DiseaseVaccinationDtoVaccinationStatusEnum.Rejected:
      return VaccinationStatusEnum.rejected
    case DiseaseVaccinationDtoVaccinationStatusEnum.Undetermined:
      return VaccinationStatusEnum.undetermined
    case DiseaseVaccinationDtoVaccinationStatusEnum.Undocumented:
      return VaccinationStatusEnum.undocumented
    case DiseaseVaccinationDtoVaccinationStatusEnum.Unvaccinated:
      return VaccinationStatusEnum.unvaccinated
    default:
      return VaccinationStatusEnum.undetermined
  }
}

export const mapPrescriptionRenewalBlockedReason = (
  status: PrescriptionRenewalBlockedReason,
): PrescribedItemRenewalBlockedReasonEnum => {
  switch (status) {
    case PrescriptionRenewalBlockedReason.REJECTED_REQUEST:
      return PrescribedItemRenewalBlockedReasonEnum.RejectedRequest
    case PrescriptionRenewalBlockedReason.PENDING_REQUEST:
      return PrescribedItemRenewalBlockedReasonEnum.PendingRequest
    case PrescriptionRenewalBlockedReason.NOT_FULLY_DISPENSED:
      return PrescribedItemRenewalBlockedReasonEnum.NotFullyDispensed
    case PrescriptionRenewalBlockedReason.IS_REGIMENT:
      return PrescribedItemRenewalBlockedReasonEnum.IsRegiment
    case PrescriptionRenewalBlockedReason.NO_MED_CARD:
      return PrescribedItemRenewalBlockedReasonEnum.NoMedCard
    case PrescriptionRenewalBlockedReason.NO_HEALTH_CLINIC:
      return PrescribedItemRenewalBlockedReasonEnum.NoHealthClinic
    default:
      return PrescribedItemRenewalBlockedReasonEnum.PendingRequest
  }
}

export const mapPrescriptionRenewalStatus = (
  status: PrescriptionRenewalStatus,
): PrescribedItemRenewalStatusEnum => {
  switch (status) {
    case PrescriptionRenewalStatus[0]:
      return PrescribedItemRenewalStatusEnum.NUMBER_0
    case PrescriptionRenewalStatus[1]:
      return PrescribedItemRenewalStatusEnum.NUMBER_1
    case PrescriptionRenewalStatus[2]:
      return PrescribedItemRenewalStatusEnum.NUMBER_2
    default:
      return PrescribedItemRenewalStatusEnum.NUMBER_0
  }
}

export const mapPrescriptionCategory = (
  status: PrescribedItemCategory,
): PrescribedItemCategoryEnum => {
  switch (status) {
    case PrescribedItemCategory.PN:
      return PrescribedItemCategoryEnum.Pn
    case PrescribedItemCategory.REGIMENT:
      return PrescribedItemCategoryEnum.Regiment
    case PrescribedItemCategory.REGULAR:
      return PrescribedItemCategoryEnum.Regular
    default:
      return PrescribedItemCategoryEnum.Owner
  }
}
