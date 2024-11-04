import { AidOrNutritionDTO } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { AidOrNutrition } from '../models/aidOrNutrition.model'

export enum AidOrNutritionType {
  AID,
  NUTRITION,
}

export enum AidOrNutritionRenewalStatus {
  'VALID' = 'VALID',
  'VALID_FOR_RENEWAL' = 'VALID_FOR_RENEWAL',
  'RENEWAL_IN_PROGRESS' = 'RENEWAL_IN_PROGRESS',
  'NOT_VALID_FOR_RENWAL' = 'NOT_VALID_FOR_RENWAL',
}

export const generateAidOrNutrition = (
  data: AidOrNutritionDTO,
  type: AidOrNutritionType,
): AidOrNutrition | null => {
  if (
    !data.id ||
    !data.iso ||
    !data.name ||
    !data.refund?.type ||
    !data.refund?.value
  ) {
    return null
  }
  console.log(data)
  return {
    id: data.id,
    iso: data.iso,
    name: data.name,
    maxUnitRefund: data.maxUnitRefund ?? undefined,
    maxMonthlyAmount: data.maxMonthlyAmount ?? undefined,
    refund: {
      type: data.refund.type,
      value: data.refund.value,
    },
    type,
    explanation: data.explanation ?? undefined,
    allowed12MonthPeriod: data.allowed12MonthPeriod ?? undefined,
    validUntil: data.validUntil ? data.validUntil : undefined,
    nextAllowedMonth: data.nextAllowedMonth ?? undefined,
    available: data.available ?? undefined,
    location: data.location ?? undefined,
    expiring: data.expiring ? data.expiring : false,
    renewalStatus:
      data.renewalStatus === 0
        ? AidOrNutritionRenewalStatus.VALID
        : data.renewalStatus === 1
        ? AidOrNutritionRenewalStatus.VALID_FOR_RENEWAL
        : data.renewalStatus === 2
        ? AidOrNutritionRenewalStatus.RENEWAL_IN_PROGRESS
        : data.renewalStatus === 3
        ? AidOrNutritionRenewalStatus.NOT_VALID_FOR_RENWAL
        : undefined,
  }
}
