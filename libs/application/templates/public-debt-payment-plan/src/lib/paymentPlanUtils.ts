import { ExternalData } from '@island.is/application/core'
import { Prerequisites } from '../dataProviders/tempAPITypes'

export const prerequisitesFailed = (data: ExternalData) => {
  const prerequisites = data.paymentPlanPrerequisites?.data as
    | Prerequisites
    | undefined

  if (!prerequisites) return true

  return (
    !prerequisites.maxDebtOk ||
    !prerequisites.taxReturnsOk ||
    !prerequisites.vatOk ||
    !prerequisites.citOk ||
    !prerequisites.accommodationTaxOk ||
    !prerequisites.withholdingTaxOk ||
    !prerequisites.wageReturnsOk
  )
}
