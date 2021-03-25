import { ExternalData } from '@island.is/application/core'
import { Address } from '@island.is/api/schema'
import { Applications } from './dataProviders/APIDataTypes'
import { EFTA, EU, NordicCountries } from './constants'

const sortApplicationsByDateAscending = (applications: Applications[]) => {
  const sortedApplications = applications
    .slice()
    .sort((a, b) => (new Date(a.created) > new Date(b.created) ? 1 : -1))

  return sortedApplications
}

export const getDraftApplications = (applications: Applications[]) => {
  return applications?.filter((application) => application.state === 'draft')
}

export const getOldestDraftApplicationId = (applications: Applications[]) => {
  const draftApplications = getDraftApplications(applications)
  const sortedApplications = sortApplicationsByDateAscending(draftApplications)
  return sortedApplications[0]?.id
}

export const hasHealthInsurance = (externalData: ExternalData) => {
  const isInsured = externalData?.healthInsurance?.data
  return isInsured === true
}

export const hasActiveDraftApplication = (externalData: ExternalData) => {
  const applications = externalData?.applications?.data as Applications[]
  if (applications?.length) {
    const draftApplications = getDraftApplications(applications)
    const firstCreatedDraftId = getOldestDraftApplicationId(draftApplications)
    const currentPathname = window.location.pathname

    if (currentPathname.includes(firstCreatedDraftId)) {
      return false
    }

    return draftApplications?.length > 1
  }
  // If there are no applications becausee of failure to fetch info, we will return false to allow the user to continue and create a new application
  return false
}

export const hasPendingApplications = (externalData: ExternalData) => {
  const pendingApplications = externalData?.pendingApplications
    ?.data as string[]
  return pendingApplications?.length > 0
}

export const hasIcelandicAddress = (externalData: ExternalData) => {
  const address = (externalData?.nationalRegistry?.data as {
    address?: Address
  })?.address

  // Users that lives abroad are registered either without address or without streetaddress and postal code. Hence the check below.
  return !address || (address && !(address.streetAddress && address.postalCode))
}

export const shouldShowModal = (externalData: ExternalData) => {
  return (
    hasHealthInsurance(externalData) ||
    hasPendingApplications(externalData) ||
    hasIcelandicAddress(externalData) ||
    hasActiveDraftApplication(externalData)
  )
}

export const isEUCountry = (countryData: string) => {
  const regions = extractKeyFromStringObject(countryData, 'regions')
  return regions?.includes(EU) || regions?.includes(EFTA)
}

export const requireConfirmationOfResidency = (formerCountry: string) => {
  const countryName = extractKeyFromStringObject(formerCountry, 'name')
  return (
    countryName === NordicCountries.FAROE_ISLANDS ||
    countryName === NordicCountries.GREENLAND
  )
}

export const isNordicCountry = (countryData: string) => {
  const countryName = extractKeyFromStringObject(countryData, 'name')
  return Object.values(NordicCountries).includes(countryName)
}

export const requireWaitingPeriod = (
  formerCountry: string,
  citizenship: string,
) => {
  // Moving from outside of an EU/EEA country require waiting period
  // Moving from an EU country, and user is not an EU/EEA citizen require waiting period
  // Exceptions are if user is moving from a nordic country.
  if (!isNordicCountry(formerCountry)) {
    if (isEUCountry(formerCountry)) {
      if (!isEUCountry(citizenship)) return true
    } else {
      return true
    }
  }
  return false
}

export const extractKeyFromStringObject = (
  objectString: string,
  key: string,
) => {
  try {
    const object = JSON.parse(objectString)
    const value = object[key]
    return value
  } catch (error) {
    return null
  }
}

export const getBaseUrl = () => {
  const isDev = window.location.origin.includes('dev01.devland.is')
  const isStaging = window.location.origin.includes('staging01.devland.is')

  if (isStaging) {
    return 'https://beta.staging01.devland.is'
  } else if (isDev) {
    return 'https://beta.dev01.devland.is'
  } else {
    return 'https://island.is'
  }
}
