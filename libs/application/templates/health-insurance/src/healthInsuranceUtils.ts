import { ExternalData } from '@island.is/application/core'
import { Address } from '@island.is/api/schema'
import { Applications } from './dataProviders/APIDataTypes'
import { EFTA, EU } from './constants'
import { Country, NordicCountries } from './types'

export const hasHealthInsurance = (externalData: ExternalData) => {
  const isInsured = externalData?.healthInsurance?.data
  return isInsured === true
}

export const hasActiveApplication = (externalData: ExternalData) => {
  const response = externalData?.applications
  // if (response && response?.status === 'success') {
  //   const applications = response.data as Applications[]
  //   const pendingApplications = applications?.filter(
  //     (application) =>
  //       application.state === 'draft' ||
  //       application.state === 'inReview' ||
  //       application.state === 'missingInfo',
  //   )
  //   return pendingApplications?.length > 1
  // }
  // If we can not find any pending applications becausee of failure to fetch info, we will return false to allow the user to continue to create a new application
  return false
}

export const hasOldPendingApplications = (externalData: ExternalData) => {
  const oldPendingApplications = externalData?.oldPendingApplications
    ?.data as string[]
  return oldPendingApplications?.length > 0
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
    hasActiveApplication(externalData) ||
    hasOldPendingApplications(externalData) ||
    hasIcelandicAddress(externalData)
  )
}

export const isEUCountry = (formerCountry: string) => {
  const regions = getCountryRegions(formerCountry)
  return regions.includes(EU) || regions.includes(EFTA)
}

export const requireConfirmationOfResidency = (formerCountry: string) => {
  const countryName = getCountryName(formerCountry)
  return (
    countryName === NordicCountries.FAROE_ISLANDS ||
    countryName === NordicCountries.GREENLAND
  )
}

export const isNordicCountry = (formerCountry: string) => {
  const countryName = getCountryName(formerCountry)
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

const getCountryName = (countryField: string) => {
  try {
    const countryData = JSON.parse(countryField)
    const { name } = countryData
    return name
  } catch (error) {
    return ''
  }
}

const getCountryRegions = (countryField: string) => {
  try {
    const countryData = JSON.parse(countryField)
    const { regions } = countryData
    return regions
  } catch (error) {
    return []
  }
}
