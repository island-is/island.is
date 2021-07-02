import { PaymentScheduleConditions } from '@island.is/api/schema'
import { ExternalData } from '@island.is/application/core'

export const prerequisitesFailed = (data: ExternalData) => {
  const prerequisites = data.paymentPlanPrerequisites?.data as
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
