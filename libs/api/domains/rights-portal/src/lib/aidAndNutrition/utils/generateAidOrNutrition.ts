import { AidOrNutritionDTO } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { AidOrNutrition } from '../models/aidAndNutrition.model'

export enum AidOrNutritionType {
  AID,
  NUTRITION,
}

export function generateAidOrNutrition(
  data: AidOrNutritionDTO,
  type: AidOrNutritionType,
): AidOrNutrition | null {
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
  }
}
