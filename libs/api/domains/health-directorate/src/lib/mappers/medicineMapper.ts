import {
  DispensationHistoryItemDto,
  PrescribedItemCategory,
  PrescriptionCommissionStatus,
  PrescriptionRenewalBlockedReason,
  PrescriptionRenewalStatus,
} from '@island.is/clients/health-directorate'
import {
  PermitStatusEnum,
  PrescribedItemCategoryEnum,
  PrescribedItemRenewalBlockedReasonEnum,
  PrescribedItemRenewalStatusEnum,
} from '../models/enums'

import { isDefined } from '@island.is/shared/utils'
import { MedicineHistoryDispensation } from '../models/medicineHistory.model'

export const mapPrescriptionRenewalBlockedReason = (
  status: PrescriptionRenewalBlockedReason,
): PrescribedItemRenewalBlockedReasonEnum => {
  switch (status) {
    case PrescriptionRenewalBlockedReason.REJECTED_REQUEST:
      return PrescribedItemRenewalBlockedReasonEnum.RejectedRequest
    case PrescriptionRenewalBlockedReason.PENDING_REQUEST:
      return PrescribedItemRenewalBlockedReasonEnum.PendingRequest
    case PrescriptionRenewalBlockedReason.ALREADY_REQUESTED:
      return PrescribedItemRenewalBlockedReasonEnum.AlreadyRequested
    case PrescriptionRenewalBlockedReason.NOT_FULLY_DISPENSED:
      return PrescribedItemRenewalBlockedReasonEnum.NotFullyDispensed
    case PrescriptionRenewalBlockedReason.IS_REGIMENT:
      return PrescribedItemRenewalBlockedReasonEnum.IsRegiment
    case PrescriptionRenewalBlockedReason.DRUG_NOT_ON_MED_CARD:
      return PrescribedItemRenewalBlockedReasonEnum.NoMedCard
    case PrescriptionRenewalBlockedReason.NO_PRIMARY_CARE_CLINIC:
      return PrescribedItemRenewalBlockedReasonEnum.NoHealthClinic
    case PrescriptionRenewalBlockedReason.MORE_RECENT_PRESCRIPTION_EXISTS:
      return PrescribedItemRenewalBlockedReasonEnum.MoreRecentPrescriptionExists
    default:
      return PrescribedItemRenewalBlockedReasonEnum.Unknown
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

export const mapDispensationItem = (
  item: DispensationHistoryItemDto,
): MedicineHistoryDispensation => {
  const quantity = item.product.quantity ?? 0

  return {
    id: [item.product.id, item.dispensationDate?.toISOString()]
      .filter((x) => isDefined(x))
      .join('-'),
    name: item.product.name,
    quantity: [quantity.toString(), item.product.unit]
      .filter((x) => isDefined(x))
      .join(' '),
    agentName: item.dispensingAgentName,
    unit: item.product.unit,
    type: item.product.type,
    indication: item.indication,
    dosageInstructions: item.dosageInstructions,
    issueDate: item.issueDate,
    prescriberName: item.prescriberName,
    expirationDate: item.expirationDate,
    isExpired: item.isExpired,
    date: item.dispensationDate,
    strength: item.product.strength ?? '',
  }
}
