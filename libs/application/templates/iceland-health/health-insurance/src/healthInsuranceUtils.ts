import { ExternalData } from '@island.is/application/types'
import { NationalRegistryAddress as Address } from '@island.is/api/schema'
import { Applications } from './dataProviders/APIDataTypes'

import { EU } from './utils/EU'
import { EFTA } from './utils/EFTA'
import { NordicCountriesCountryCode } from './utils/constants'

export const getDraftApplications = (applications: Applications[]) => {
  return applications?.filter((application) => application.state === 'draft')
}

export const hasHealthInsurance = (externalData: ExternalData) => {
  const isInsured = externalData?.isHealthInsured?.data
  return isInsured === true
}

export const hasNoIcelandicAddress = (externalData: ExternalData) => {
  const address = (
    externalData?.nationalRegistry?.data as {
      address?: Address
    }
  )?.address

  // Users that lives abroad are registered either without address or without streetaddress and postal code. Hence the check below.
  return !address || (address && !(address.streetAddress && address.postalCode))
}

export const prerequisitesFailed = (externalData: ExternalData) => {
  return hasHealthInsurance(externalData) || hasNoIcelandicAddress(externalData)
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
