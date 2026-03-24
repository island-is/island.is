import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { getSelectedContract } from './rentalAgreementUtils'

type NationalRegistryPerson = {
  fullName?: string | null
  givenName?: string | null
  familyName?: string | null
}

const applicantDisplayName = (application: Application): string => {
  const nr = getValueViaPath<NationalRegistryPerson>(
    application.externalData,
    'nationalRegistry.data',
  )
  const fromFullName = nr?.fullName?.trim()
  if (fromFullName) return fromFullName

  const fromParts = [nr?.givenName, nr?.familyName]
    .filter((p): p is string => typeof p === 'string' && p.trim().length > 0)
    .join(' ')
    .trim()
  if (fromParts) return fromParts

  return getValueViaPath<string>(application.answers, 'applicant.name')?.trim() ?? ''
}

export const getApplicationCardRentalSummary = (
  application: Application,
): { applicantName: string; rentalAddress: string } => {
  const applicantName = applicantDisplayName(application)

  const contract = getSelectedContract(
    application.answers,
    application.externalData,
  )
  const prop = contract?.contractProperty?.[0]
  const postalMunicipality = [prop?.postalCode, prop?.municipality]
    .filter(Boolean)
    .join(' ')
  const parts = [prop?.streetAndHouseNumber, postalMunicipality].filter(Boolean)
  const rentalAddress = parts.join(', ')

  return { applicantName, rentalAddress }
}
