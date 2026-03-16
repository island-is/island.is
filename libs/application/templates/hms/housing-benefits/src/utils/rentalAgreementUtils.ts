import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { Contract } from '@island.is/clients/hms-rental-agreement'

/**
 * Gets rental agreements that qualify for housing benefits.
 * Filtering (applicant as tenant, unbound or 3+ months left) is done by the API.
 */
export const getRentalAgreementsForHousingBenefits = (
  application: Application,
): Contract[] => {
  const contracts = getValueViaPath<Contract[]>(
    application?.externalData,
    'getRentalAgreements.data',
  )
  return Array.isArray(contracts) ? contracts : []
}

export const hasRentalAgreements = (application: Application) =>
  getRentalAgreementsForHousingBenefits(application).length > 0
