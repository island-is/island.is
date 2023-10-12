import { EinstaklingurDTOAllt } from '@island.is/clients/national-registry-v3'
import { registerEnumType } from '@nestjs/graphql'
import { Person } from './models'
import {
  ISLBorninMin,
  ISLEinstaklingur,
} from '@island.is/clients/national-registry-v1'

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  TRANSGENDER = 'transgender',
  MALE_MINOR = 'male-minor',
  FEMALE_MINOR = 'female-minor',
  TRANSGENDER_MINOR = 'transgender-minor',
  UNKNOWN = 'unknown',
}

export enum MaritalStatus {
  UNMARRIED = 'unmarried',
  MARRIED = 'married',
  WIDOWED = 'widowed',
  SEPARATED = 'separated',
  DIVORCED = 'divorced',
  MARRIED_LIVING_SEPARATELY = 'married-living-separately',
  MARRIED_TO_FOREIGN_LAW_PERSON = 'registered-married-to-foreign-law-person',
  UNKNOWN = 'unknown',
  FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON = 'foreign-residence-married-to-unregistered-person',
  ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON = 'transnational-marriage',
}

registerEnumType(Gender, { name: 'NationalRegistryGender' })
registerEnumType(MaritalStatus, {
  name: 'NationalRegistryMaritalStatus',
})
export type PersonV3 = Person & {
  api: 'v3'
  rawData?: EinstaklingurDTOAllt | null
}

export type V1RawData = ISLEinstaklingur & {
  children: Array<ISLBorninMin> | null
}

export type PersonV1 = Person & {
  api: 'v1'
  rawData?: V1RawData
}

export type SharedPerson = PersonV1 | PersonV3
