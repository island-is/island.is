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
  'NOT_VALID_FOR_RENEWAL' = 'NOT_VALID_FOR_RENEWAL',
}

const RENEWAL_STATUS_MAP = {
  0: AidOrNutritionRenewalStatus.VALID,
  1: AidOrNutritionRenewalStatus.VALID_FOR_RENEWAL,
  2: AidOrNutritionRenewalStatus.RENEWAL_IN_PROGRESS,
  3: AidOrNutritionRenewalStatus.NOT_VALID_FOR_RENEWAL,
} as const

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
    valid: data.valid ?? undefined,
    explanation: data.explanation ?? undefined,
    allowed12MonthPeriod: data.allowed12MonthPeriod ?? undefined,
    validUntil: data.validUntil ? data.validUntil : undefined,
    nextAllowedMonth: data.nextAllowedMonth ?? undefined,
    available: data.available ?? undefined,
    location: data.location
      ? typeof data.location === 'string'
        ? data.location.split('#')
        : typeof data.location === 'object' && Array.isArray(data.location)
        ? data.location
        : undefined
      : undefined,
    expiring: data.expiring ? data.expiring : false,
    renewalStatus:
      data.renewalStatus !== undefined
        ? RENEWAL_STATUS_MAP[
            data.renewalStatus as keyof typeof RENEWAL_STATUS_MAP
          ]
        : undefined,
  }
}
