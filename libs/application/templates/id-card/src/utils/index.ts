import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { IdentityDocument, IdentityDocumentChild } from '../lib/constants'

export * from './getChosenApplicant'
export * from './hasSecondGuardian'
export * from './hasDiscount'
export * from './hasReviewer'
export * from './getChargeItems'
export * from './updateAnswers'
export * from './isChild'
export * from './isAvailableForApplication'
export * from './getPriceList'

export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}

export const getCombinedApplicantInformation = (externalData: ExternalData) => {
  const applicantName = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.fullName',
    '',
  )

  const applicantNationalRegistry = getValueViaPath<NationalRegistryIndividual>(
    externalData,
    'nationalRegistry.data',
  )

  const applicantPassport = getValueViaPath<IdentityDocument>(
    externalData,
    'identityDocument.data.userPassport',
  )

  const applicantChildren = getValueViaPath<Array<IdentityDocumentChild>>(
    externalData,
    'identityDocument.data.childPassports',
    [],
  )

  return {
    name: applicantName,
    age: applicantNationalRegistry?.age,
    nationalId: applicantNationalRegistry?.nationalId,
    citizenship: applicantNationalRegistry?.citizenship,
    passport: applicantPassport,
    children: applicantChildren,
  }
}

export const formatIsk = (value: number): string =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'
