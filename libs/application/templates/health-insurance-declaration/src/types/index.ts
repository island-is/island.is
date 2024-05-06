import {
  ApplicantChildCustodyInformation,
  Application,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { HealthInsuranceDeclaration } from '../lib/dataSchema'
import { NationalRegistrySpouse } from '@island.is/api/schema'

export type SubmitApplicationData = {
  success: boolean
  applicants: {
    comment: string
    approved: boolean
    documentId: number
    nationalId: string
  }[]
  applicationId: number
}

export type HealthInsuranceDeclarationExternalData = {
  nationalRegistry: {
    data: NationalRegistryIndividual
    date: string
    status: string
  }
  userProfile: {
    data: { email: string; mobilePhoneNumber: string }
    date: string
    status: string
  }
  insuranceStatementData: {
    data: InsuranceStatementData
    date: string
    status: string
  }
  nationalRegistrySpouse: {
    data: NationalRegistrySpouse
    date: string
    status: string
  }
  childrenCustodyInformation: {
    data: ApplicantChildCustodyInformation[]
    date: string
    status: string
  }
  submitApplication: {
    data: SubmitApplicationData
    date: Date
    status: 'failure' | 'success'
  }
}

export type HealthInsuranceDeclarationApplication =
  Application<HealthInsuranceDeclaration> & {
    externalData: HealthInsuranceDeclarationExternalData
  }

export type HealthInsuranceCountry = {
  code: string
  name: string
  icelandicName: string
}

export type HealthInsuranceContinents = {
  code: string
  name: string
  icelandicName: string
}

export type InsuranceStatementData = {
  canApply: boolean
  countries: HealthInsuranceCountry[]
  continents: HealthInsuranceContinents[]
}
