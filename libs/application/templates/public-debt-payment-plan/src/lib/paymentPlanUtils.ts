import { PaymentScheduleConditions } from '@island.is/api/schema'
import { ExternalData } from '@island.is/application/core'
import { PaymentPlanExternalData } from './dataSchema'

export const prerequisitesFailed = (data: ExternalData) => {
  const prerequisites = (data as PaymentPlanExternalData)
    .paymentPlanPrerequisites?.data?.conditions as
    | PaymentScheduleConditions
    | undefined

  if (!prerequisites) return true

  return (
    !prerequisites.maxDebt ||
    !prerequisites.taxReturns ||
    !prerequisites.vatReturns ||
    !prerequisites.citReturns ||
    !prerequisites.accommodationTaxReturns ||
    !prerequisites.withholdingTaxReturns ||
    !prerequisites.wageReturns
  )
}

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'
