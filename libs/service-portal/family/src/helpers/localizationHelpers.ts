import { MessageDescriptor } from 'react-intl'
import { Gender, MaritalStatus } from '@island.is/api/schema'
import { spmm } from '../lib/messages'

export const natRegGenderMessageDescriptorRecord: Record<
  Gender,
  MessageDescriptor
> = {
  FEMALE: spmm.family.genderFemale,
  FEMALE_MINOR: spmm.family.genderFemaleMinor,
  MALE: spmm.family.genderMale,
  MALE_MINOR: spmm.family.genderMaleMinor,
  TRANSGENDER: spmm.family.genderTransgender,
  TRANSGENDER_MINOR: spmm.family.genderTransgender,
  UNKNOWN: spmm.family.genderUnknown,
}

export const natRegMaritalStatusMessageDescriptorRecord: Record<
  MaritalStatus,
  MessageDescriptor
> = {
  DIVORCED: spmm.family.maritalStatusDivorced,
  FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON:
    spmm.family.maritalStatusForeignResidence,
  ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON:
    spmm.family.maritalStatusIcelandicResidence,
  MARRIED: spmm.family.maritalStatusMarried,
  MARRIED_LIVING_SEPARATELY: spmm.family.maritalStatusMarriedLivingSep,
  MARRIED_TO_FOREIGN_LAW_PERSON: spmm.family.maritalStatusMarriedToForeign,
  SEPARATED: spmm.family.maritalStatusSeparated,
  UNKNOWN: spmm.family.maritalStatusUnknown,
  UNMARRIED: spmm.family.maritalStatusUnmarried,
  WIDOWED: spmm.family.maritalStatusWidowed,
}
