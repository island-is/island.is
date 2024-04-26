import {
  Application,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { HealthInsuranceDeclaration } from '../lib/dataSchema'

export type HealthInsuranceDeclarationExternalData = {
  nationalRegistry: { data: NationalRegistryIndividual; date: string }
  userProfile: {
    data: { email: string; mobilePhoneNumber: string }
    date: string
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
