import { ExternalData } from "@island.is/application/core"
import { Address } from '@island.is/api/schema'
import { useQuery } from '@apollo/client'
import { APPLICANT_APPLICATIONS } from '@island.is/application/graphql'
import { ApplicationTypes } from '@island.is/application/core'
import { PendingApplications } from "./dataProviders/APIDataTypes"

// Flytta ut alla conditions till separata util-funktioner
// Returnera boolean
// Hämta text i separat util-funktion / hook-funktion
  
export const hasHealthInsurance = (externalData: ExternalData) => {
  const isInsured = externalData?.healthInsurance?.data
  return isInsured === true
}

export const hasActiveApplication = (externalData: ExternalData) => {
    const pendingApplications = externalData?.pendingApplications
    ?.data as PendingApplications[]
    return pendingApplications?.length > 1
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
  return (!address || (address && !(address.streetAddress && address.postalCode)))
}

export const isFormerCountryOutsideEu = (externalData: ExternalData) => {
  // TODO: 
  // Get EU countries
  // Get FormerCountry
  // Return if FormerCountry is not in EU list
}

export const shouldShowModal = (externalData: ExternalData) => {
    return hasHealthInsurance(externalData) || hasActiveApplication(externalData) || hasOldPendingApplications(externalData) || hasIcelandicAddress(externalData) // || isFormerCountryOutsideEu(externalData)
}
