import { ExternalData } from '@island.is/application/core'
import { Prerequisites } from '../dataProviders/tempAPITypes'

export const prerequisitesFailed = (data: ExternalData) => {
  const prerequisites = data.paymentPlanPrerequisites.data as Prerequisites
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
