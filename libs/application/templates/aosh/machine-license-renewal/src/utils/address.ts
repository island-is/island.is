import { ExternalData } from '@island.is/application/types'
import { getApplicationExternalData } from './getApplicationExternalData'

export const formatAddress = (
  streetAddress?: string,
  postalCode?: string,
  city?: string,
) =>
  [streetAddress, [postalCode, city].filter(Boolean).join(' ')]
    .filter(Boolean)
    .join(', ')

export const getLegalDomicile = (externalData: ExternalData) => {
  const { applicantAddress, applicantPostalCode, applicantCity } =
    getApplicationExternalData(externalData)

  return formatAddress(applicantAddress, applicantPostalCode, applicantCity)
}
