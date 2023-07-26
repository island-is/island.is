import {
  NationalRegistryGender,
  NationalRegistryMaritalStatus,
} from './nationalRegistry.types'

export type ExcludesFalse = <T>(
  x: T | null | undefined | false | '' | 0,
) => x is T

export function mapGender(genderIndex: string): NationalRegistryGender {
  switch (genderIndex) {
    case '1':
      return NationalRegistryGender.MALE
    case '2':
      return NationalRegistryGender.FEMALE
    case '3':
      return NationalRegistryGender.MALE_MINOR
    case '4':
      return NationalRegistryGender.FEMALE_MINOR
    case '7':
      return NationalRegistryGender.TRANSGENDER
    case '8':
      return NationalRegistryGender.TRANSGENDER_MINOR
    default:
      return NationalRegistryGender.UNKNOWN
  }
}

export function mapMaritalStatus(
  maritalCode: string,
): NationalRegistryMaritalStatus {
  switch (maritalCode) {
    case '1':
      return NationalRegistryMaritalStatus.UNMARRIED
    case '3':
      return NationalRegistryMaritalStatus.MARRIED
    case '4':
      return NationalRegistryMaritalStatus.WIDOWED
    case '5':
      return NationalRegistryMaritalStatus.SEPARATED
    case '6':
      return NationalRegistryMaritalStatus.DIVORCED
    case '7':
      return NationalRegistryMaritalStatus.MARRIED_LIVING_SEPARATELY
    case '8':
      return NationalRegistryMaritalStatus.MARRIED_TO_FOREIGN_LAW_PERSON
    case '9':
      return NationalRegistryMaritalStatus.UNKNOWN
    case '0':
      return NationalRegistryMaritalStatus.FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON
    case 'L':
      return NationalRegistryMaritalStatus.ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON
    default:
      return NationalRegistryMaritalStatus.UNMARRIED
  }
}
