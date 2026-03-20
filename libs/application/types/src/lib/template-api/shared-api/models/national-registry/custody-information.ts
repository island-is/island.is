import {
  NationalRegistryIndividual,
  NationalRegistryOtherIndividual,
} from './individual'

export interface ApplicantChildCustodyInformation {
  nationalId: string
  givenName?: string | null
  familyName?: string | null
  fullName: string
  genderCode: string
  livesWithApplicant: boolean
  livesWithBothParents: boolean
  otherParent?: NationalRegistryIndividual | null
  citizenship: {
    code: string | null
    name: string | null
  } | null
  domicileInIceland: boolean
}

export interface ApplicantChildCustodyInformationV3 {
  nationalId: string
  givenName?: string | null
  familyName?: string | null
  fullName: string
  genderCode: string
  genderDescription?: string | undefined
  livesWithApplicant: boolean
  livesWithBothParents: boolean
  otherParent?: NationalRegistryOtherIndividual | null
  citizenship: {
    code: string | null
    name: string | null
  } | null
  domicileInIceland: boolean
}
