import {
  IdentityDocumentChildrenResponse,
  IdentityDocumentResponse,
} from '../../gen/fetch'
import { IdentityDocument, IdentityDocumentChild } from './passportsApi.types'

export const mapPassports = (
  passports: IdentityDocumentResponse,
): IdentityDocument => {
  return {
    productionRequestID: passports.productionRequestID ?? '',
    number: passports.number ?? '',
    type: passports.type ?? '',
    verboseType: passports.verboseType ?? '',
    subType: passports.subType ?? '',
    status: passports.status ?? '',
    issuingDate: passports.issuingDate ?? new Date(),
    expirationDate: passports.expirationDate ?? new Date(),
    displayFirstName: passports.displayFirstName ?? '',
    displayLastName: passports.displayLastName ?? '',
    mrzFirstName: passports.mrzFirstName ?? '',
    mrzLastName: passports.mrzLastName ?? '',
    sex: passports.sex ?? '',
  }
}

export const mapChildPassports = (
  passports: IdentityDocumentChildrenResponse,
): IdentityDocumentChild => {
  return {
    nationalId: passports.childrenSSN ?? '',
    secondParent: passports.secondParent ?? [],
    identityDocuments:
      passports.identityDocumentResponses?.map(mapPassports) || undefined,
  }
}
