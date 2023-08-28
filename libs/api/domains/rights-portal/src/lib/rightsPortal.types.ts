import { AidOrNutritionDTO } from '@island.is/clients/icelandic-health-insurance/rights-portal'

export enum AidOrNutritionType {
  AID,
  NUTRITION,
}

export function generateAidOrNutrition(
  data: AidOrNutritionDTO,
  type: AidOrNutritionType,
) {
  if (
    !data.id ||
    !data.iso ||
    !data.name ||
    !data.maxUnitRefund ||
    !data.refund?.type ||
    !data.refund?.value ||
    !data.expiring
  ) {
    return null
  }
  return {
    id: data.id,
    iso: data.iso,
    name: data.name,
    maxUnitRefund: data.maxUnitRefund,
    refund: {
      type: data.refund.type,
      value: data.refund.value,
    },
    type,
    available: data.available ?? undefined,
    location: data.location ?? undefined,
    expiring: data.expiring,
  }
}

export type ExcludesFalse = <T>(x: T | null | undefined | false | '') => x is T
