import {
  DiseaseVaccinationDtoVaccinationStatusEnum,
  PrescribedItemDtoRenewalBlockedReasonEnum,
  PrescribedItemDtoRenewalStatusEnum,
  PrescribedItemDtoCategoryEnum,
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
  status: PrescribedItemDtoRenewalBlockedReasonEnum,
): PrescribedItemRenewalBlockedReasonEnum => {
  switch (status) {
    case PrescribedItemDtoRenewalBlockedReasonEnum.RejectedRequest:
      return PrescribedItemRenewalBlockedReasonEnum.RejectedRequest
    case PrescribedItemDtoRenewalBlockedReasonEnum.PendingRequest:
      return PrescribedItemRenewalBlockedReasonEnum.PendingRequest
    case PrescribedItemDtoRenewalBlockedReasonEnum.NotFullyDispensed:
      return PrescribedItemRenewalBlockedReasonEnum.NotFullyDispensed
    case PrescribedItemDtoRenewalBlockedReasonEnum.IsRegiment:
      return PrescribedItemRenewalBlockedReasonEnum.IsRegiment
    default:
      return PrescribedItemRenewalBlockedReasonEnum.PendingRequest
  }
}

export const mapPrescriptionRenewalStatus = (
  status: PrescribedItemDtoRenewalStatusEnum,
): PrescribedItemRenewalStatusEnum => {
  switch (status) {
    case PrescribedItemDtoRenewalStatusEnum.NUMBER_0:
      return PrescribedItemRenewalStatusEnum.NUMBER_0
    case PrescribedItemDtoRenewalStatusEnum.NUMBER_1:
      return PrescribedItemRenewalStatusEnum.NUMBER_1
    case PrescribedItemDtoRenewalStatusEnum.NUMBER_2:
      return PrescribedItemRenewalStatusEnum.NUMBER_2
    default:
      return PrescribedItemRenewalStatusEnum.NUMBER_0
  }
}

export const mapPrescriptionCategory = (
  status: PrescribedItemDtoCategoryEnum,
): PrescribedItemCategoryEnum => {
  switch (status) {
    case PrescribedItemDtoCategoryEnum.Pn:
      return PrescribedItemCategoryEnum.Pn
    case PrescribedItemDtoCategoryEnum.Regimen:
      return PrescribedItemCategoryEnum.Regimen
    case PrescribedItemDtoCategoryEnum.Regular:
      return PrescribedItemCategoryEnum.Regular
    default:
      return PrescribedItemCategoryEnum.Owner
  }
}
