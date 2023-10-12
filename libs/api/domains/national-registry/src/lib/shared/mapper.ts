import { Gender, MaritalStatus } from './types'

export const mapGender = (genderIndex: string): Gender => {
  switch (genderIndex) {
    case '1':
      return Gender.MALE
    case '2':
      return Gender.FEMALE
    case '3':
      return Gender.MALE_MINOR
    case '4':
      return Gender.FEMALE_MINOR
    case '7':
      return Gender.TRANSGENDER
    case '8':
      return Gender.TRANSGENDER_MINOR
    default:
      return Gender.UNKNOWN
  }
}

export const mapMaritalStatus = (maritalCode: string): MaritalStatus => {
  switch (maritalCode) {
    case '1':
      return MaritalStatus.UNMARRIED
    case '3':
      return MaritalStatus.MARRIED
    case '4':
      return MaritalStatus.WIDOWED
    case '5':
      return MaritalStatus.SEPARATED
    case '6':
      return MaritalStatus.DIVORCED
    case '7':
      return MaritalStatus.MARRIED_LIVING_SEPARATELY
    case '8':
      return MaritalStatus.MARRIED_TO_FOREIGN_LAW_PERSON
    case '9':
      return MaritalStatus.UNKNOWN
    case '0':
      return MaritalStatus.FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON
    case 'L':
      return MaritalStatus.ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON
    default:
      return MaritalStatus.UNMARRIED
  }
}
