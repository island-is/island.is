import {
  DiseaseVaccinationDtoVaccinationStatusEnum,
  DispensationHistoryItemDto,
  EuPatientConsentDto,
  EuPatientConsentStatus,
  PrescribedItemCategory,
  PrescriptionRenewalBlockedReason,
  PrescriptionRenewalStatus,
  PrescriptionCommissionStatus,
} from '@island.is/clients/health-directorate'
import {
  PermitStatusEnum,
  PrescribedItemCategoryEnum,
  PrescribedItemRenewalBlockedReasonEnum,
  PrescribedItemRenewalStatusEnum,
  VaccinationStatusEnum,
} from '../models/enums'

import { isDefined } from '@island.is/shared/utils'
import { MedicineHistoryDispensation } from '../models/medicineHistory.model'
import { Country } from '../models/permits/country.model'
import { Permit } from '../models/permits/permits'

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

export const mapPermitStatus = (
  status: EuPatientConsentStatus,
): PermitStatusEnum => {
  switch (status) {
    case EuPatientConsentStatus.ACTIVE:
      return PermitStatusEnum.active
    case EuPatientConsentStatus.EXPIRED:
      return PermitStatusEnum.expired
    case EuPatientConsentStatus.INACTIVE:
      return PermitStatusEnum.inactive
    case EuPatientConsentStatus.PENDING:
      return PermitStatusEnum.awaitingApproval
    default:
      return PermitStatusEnum.unknown
  }
}

export const mapDelegationStatus = (
  status: PrescriptionCommissionStatus,
): PermitStatusEnum => {
  switch (status) {
    case PrescriptionCommissionStatus.ACTIVE:
      return PermitStatusEnum.active
    case PrescriptionCommissionStatus.EXPIRED:
      return PermitStatusEnum.expired
    case PrescriptionCommissionStatus.INACTIVE:
      return PermitStatusEnum.inactive
    case PrescriptionCommissionStatus.PENDING:
      return PermitStatusEnum.awaitingApproval
    default:
      return PermitStatusEnum.unknown
  }
}

export const mapPermit = (
  permit: EuPatientConsentDto,
  locale: string,
): Permit => {
  return {
    cacheId: `${permit.id}-${locale}`,
    id: permit.id ?? '',
    status: mapPermitStatus(permit.status),
    createdAt: permit.createdAt,
    validFrom: permit.validFrom,
    validTo: permit.validTo,
    codes: permit.codes ?? [],
    countries:
      permit.countries?.map((country) => {
        const countryObj: Country = {
          code: country.code,
          name: country.name,
        }
        return countryObj
      }) ?? [],
  }
}

export const mapDispensationItem = (
  item: DispensationHistoryItemDto,
): MedicineHistoryDispensation => {
  const quantity = item.productQuantity ?? 0

  return {
    id: item.productId,
    name: item.productName,
    quantity: [quantity.toString(), item.productUnit]
      .filter((x) => isDefined(x))
      .join(' '),
    agentName: item.dispensingAgentName,
    unit: item.productUnit,
    type: item.productType,
    indication: item.indication,
    dosageInstructions: item.dosageInstructions,
    issueDate: item.issueDate,
    prescriberName: item.prescriberName,
    expirationDate: item.expirationDate,
    isExpired: item.isExpired,
    date: item.dispensationDate,
  }
}
