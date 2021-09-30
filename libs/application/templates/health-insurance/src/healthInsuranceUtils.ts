import { ExternalData } from '@island.is/application/core'
import { Address } from '@island.is/api/schema'
import { Applications } from './dataProviders/APIDataTypes'
import { NordicCountriesCountryCode } from './shared'
import EFTA from './assets/EFTA.json'
import EU from './assets/EU.json'

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

export const hasNoIcelandicAddress = (externalData: ExternalData) => {
  const address = (externalData?.nationalRegistry?.data as {
    address?: Address
  })?.address

  // Users that lives abroad are registered either without address or without streetaddress and postal code. Hence the check below.
  return !address || (address && !(address.streetAddress && address.postalCode))
}

export const prerequisitesFailed = (externalData: ExternalData) => {
  return (
    hasHealthInsurance(externalData) ||
    hasPendingApplications(externalData) ||
    hasNoIcelandicAddress(externalData) ||
    hasActiveDraftApplication(externalData)
  )
}

export const isEUCountry = (countryCode: string) => {
  const isInEFTA = !!EFTA.find((element) => element.alpha2Code === countryCode)
  const isInEU = !!EU.find((element) => element.alpha2Code === countryCode)
  return isInEU || isInEFTA
}

// Special cases for Faroe islands and greenland
export const requireConfirmationOfResidency = (country: string) => {
  const countryCode = extractKeyFromStringObject(country, 'countryCode')
  return countryCode === 'FO' || countryCode === 'GL'
}

export const isNordicCountry = (countryCode: string) => {
  return countryCode in NordicCountriesCountryCode
}

export const requireWaitingPeriod = (
  formerCountry: string,
  citizenship: string,
) => {
  const citizenshipCode = extractKeyFromStringObject(citizenship, 'code')
  const formerCountryCode = extractKeyFromStringObject(
    formerCountry,
    'countryCode',
  )
  if (!isNordicCountry(formerCountryCode)) {
    if (isEUCountry(formerCountryCode)) {
      if (!isEUCountry(citizenshipCode)) return true
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
