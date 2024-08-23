import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { getValueViaPath } from '@island.is/application/core'
import {
  Application,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { IdentityDocument, IdentityDocumentChild } from '../lib/constants'

export * from './getChosenApplicant'
export * from './hasSecondGuardian'
export * from './hasDiscount'
export * from './hasReviewer'
export * from './getChargeItemCodes'
export * from './updateAnswers'
export * from './isChild'
export * from './isAvailableForApplication'

export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}

export const getCombinedApplicantInformation = (externalData: any) => {
  const applicantName = getValueViaPath(
    externalData,
    'nationalRegistry.data.fullName',
    '',
  ) as string

  const applicantNationalRegistry = getValueViaPath(
    externalData,
    'nationalRegistry.data',
    {},
  ) as NationalRegistryIndividual

  const applicantPassport = getValueViaPath(
    externalData,
    'identityDocument.data.userPassport',
    undefined,
  ) as IdentityDocument | undefined

  const applicantChildren = getValueViaPath(
    externalData,
    'identityDocument.data.childPassports',
    [],
  ) as Array<IdentityDocumentChild>

  return {
    name: applicantName,
    age: applicantNationalRegistry.age,
    nationalId: applicantNationalRegistry.nationalId,
    passport: applicantPassport,
    children: applicantChildren,
  }
}
