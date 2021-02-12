import { ExternalData } from '@island.is/application/core'
import { Address } from '@island.is/api/schema'
import { Applications } from './dataProviders/APIDataTypes'
import { FAROE_ISLANDS, GREENLAND } from './constants'

export const hasHealthInsurance = (externalData: ExternalData) => {
  const isInsured = externalData?.healthInsurance?.data
  return isInsured === true
}

export const hasActiveDraftApplication = (externalData: ExternalData) => {
  const response = externalData?.applications
  if (response && response?.status === 'success') {
    const applications = response.data as Applications[]
    const pendingApplications = applications?.filter(
      (application) => application.state === 'draft',
    )
    return pendingApplications?.length > 1
  }
  // If we can not find any pending applications becausee of failure to fetch info, we will return false to allow the user to continue to create a new application
  return false
}

export const hasPendingApplications = (externalData: ExternalData) => {
  const pendingApplications = externalData?.oldPendingApplications
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

export const isEUCountry = (formerCountry: string) => {
  try {
    const countryData = JSON.parse(formerCountry)
    const { regions } = countryData
    return regions.includes('EU') || regions.includes('EFTA')
  } catch (error) {
    return false
  }
}

export const requireConfirmationOfResidency = (formerCountry: string) => {
  try {
    const countryData = JSON.parse(formerCountry)
    const { name } = countryData
    return name === FAROE_ISLANDS || name === GREENLAND
  } catch (error) {
    return false
  }
}
