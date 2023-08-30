import { NationalRegistryIndividual } from './individual'

export interface ApplicantChildCustodyInformation {
  nationalId: string
  fullName: string
  genderCode: string
  livesWithApplicant: boolean
  livesWithBothParents: boolean
  otherParent?: NationalRegistryIndividual | null
}
