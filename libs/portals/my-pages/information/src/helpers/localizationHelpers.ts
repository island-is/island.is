import { MessageDescriptor } from 'react-intl'
import {
  NationalRegistryGender,
  NationalRegistryMaritalStatus,
} from '@island.is/api/schema'
import { spmm } from '../lib/messages'

export const natRegGenderMessageDescriptorRecord: Record<
  NationalRegistryGender,
  MessageDescriptor
> = {
  FEMALE: spmm.genderFemale,
  FEMALE_MINOR: spmm.genderFemaleMinor,
  MALE: spmm.genderMale,
  MALE_MINOR: spmm.genderMaleMinor,
  TRANSGENDER: spmm.genderTransgender,
  TRANSGENDER_MINOR: spmm.genderTransgender,
  UNKNOWN: spmm.genderUnknown,
}

export const natRegMaritalStatusMessageDescriptorRecord: Record<
  NationalRegistryMaritalStatus,
  MessageDescriptor
> = {
  DIVORCED: spmm.maritalStatusDivorced,
  FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON:
    spmm.maritalStatusForeignResidence,
  ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON:
    spmm.maritalStatusIcelandicResidence,
  MARRIED: spmm.maritalStatusMarried,
  MARRIED_LIVING_SEPARATELY: spmm.maritalStatusMarriedLivingSep,
  MARRIED_TO_FOREIGN_LAW_PERSON: spmm.maritalStatusMarriedToForeign,
  SEPARATED: spmm.maritalStatusSeparated,
  UNKNOWN: spmm.maritalStatusUnknown,
  UNMARRIED: spmm.maritalStatusUnmarried,
  WIDOWED: spmm.maritalStatusWidowed,
}
