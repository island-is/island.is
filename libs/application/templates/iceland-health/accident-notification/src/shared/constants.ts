import {
  AgricultureAccidentLocationEnum,
  FishermanWorkplaceAccidentLocationEnum,
  GeneralWorkplaceAccidentLocationEnum,
  ProfessionalAthleteAccidentLocationEnum,
  RescueWorkAccidentLocationEnum,
  StudiesAccidentLocationEnum,
} from '../utils/enums'

export enum ApiActions {
  submitApplication = 'submitApplication',
  reviewApplication = 'reviewApplication',
  addAttachment = 'addAdditionalAttachment',
}

export const accidentLocationLabelMapper = (
  value:
    | GeneralWorkplaceAccidentLocationEnum
    | FishermanWorkplaceAccidentLocationEnum
    | ProfessionalAthleteAccidentLocationEnum
    | AgricultureAccidentLocationEnum
    | RescueWorkAccidentLocationEnum
    | StudiesAccidentLocationEnum,
): number | undefined => {
  switch (value) {
    case GeneralWorkplaceAccidentLocationEnum.ATTHEWORKPLACE:
      return 0
    case GeneralWorkplaceAccidentLocationEnum.TOORFROMTHEWORKPLACE:
      return 1
    case GeneralWorkplaceAccidentLocationEnum.OTHER:
      return 2
    case FishermanWorkplaceAccidentLocationEnum.ONTHESHIP:
      return 0
    case FishermanWorkplaceAccidentLocationEnum.TOORFROMTHEWORKPLACE:
      return 1
    case FishermanWorkplaceAccidentLocationEnum.OTHER:
      return 2
    case ProfessionalAthleteAccidentLocationEnum.SPORTCLUBSFACILITES:
      return 0
    case ProfessionalAthleteAccidentLocationEnum.TOORFROMTHESPORTCLUBSFACILITES:
      return 1
    case ProfessionalAthleteAccidentLocationEnum.OTHER:
      return 2
    case AgricultureAccidentLocationEnum.ATTHEWORKPLACE:
      return 0
    case AgricultureAccidentLocationEnum.TOORFROMTHEWORKPLACE:
      return 1
    case AgricultureAccidentLocationEnum.OTHER:
      return 2
    case RescueWorkAccidentLocationEnum.DURINGRESCUE:
      return 0
    case RescueWorkAccidentLocationEnum.TOORFROMRESCUE:
      return 1
    case RescueWorkAccidentLocationEnum.OTHER:
      return 2
    case StudiesAccidentLocationEnum.ATTHESCHOOL:
      return 0
    case StudiesAccidentLocationEnum.OTHER:
      return 2
    default:
      return undefined
  }
}
