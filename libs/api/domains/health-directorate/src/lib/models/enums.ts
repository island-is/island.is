import { registerEnumType } from '@nestjs/graphql'

export enum VaccinationStatusEnum {
  valid = 'valid', // mint
  expired = 'expired', // blue
  complete = 'complete', //  mint
  incomplete = 'incomplete', // blue
  undocumented = 'undocumented', // purple
  unvaccinated = 'unvaccinated', // red
  rejected = 'rejected', // purple
  undetermined = 'undetermined', // purple
}
registerEnumType(VaccinationStatusEnum, {
  name: 'HealthDirectorateVaccinationStatusEnum',
})

export enum PrescribedItemRenewalBlockedReasonEnum {
  PendingRequest = 'pendingRequest',
  RejectedRequest = 'rejectedRequest',
  NotFullyDispensed = 'notFullyDispensed',
  IsRegiment = 'isRegiment',
}

registerEnumType(PrescribedItemRenewalBlockedReasonEnum, {
  name: 'HealthDirectoratePrescriptionRenewalBlockedReason',
})

export enum PrescribedItemRenewalStatusEnum {
  NUMBER_0 = 0,
  NUMBER_1 = 1,
  NUMBER_2 = 2,
}

registerEnumType(PrescribedItemRenewalStatusEnum, {
  name: 'HealthDirectoratePrescriptionRenewalStatus',
})

export enum PrescribedItemCategoryEnum {
  Regular = 'regular',
  Pn = 'pn',
  Regimen = 'regimen',
  Owner = 'owner',
}

registerEnumType(PrescribedItemCategoryEnum, {
  name: 'HealthDirectoratePrescribedItemCategory',
})
