import { accidentLocation } from '../lib/messages'
import {
  AgricultureAccidentLocationEnum,
  FishermanWorkplaceAccidentLocationEnum,
  GeneralWorkplaceAccidentLocationEnum,
  ProfessionalAthleteAccidentLocationEnum,
  RescueWorkAccidentLocationEnum,
  StudiesAccidentLocationEnum,
} from '../types'

export enum ApiActions {
  submitApplication = 'submitApplication',
  reviewApplication = 'reviewApplication',
  addAttachment = 'addAdditionalAttachment',
}

export const accidentLocationLabelMapper = {
  [GeneralWorkplaceAccidentLocationEnum.ATTHEWORKPLACE]:
    accidentLocation.generalWorkAccident.atTheWorkplace.defaultMessage,
  [GeneralWorkplaceAccidentLocationEnum.TOORFROMTHEWORKPLACE]:
    accidentLocation.generalWorkAccident.toOrFromTheWorkplace.defaultMessage,
  [GeneralWorkplaceAccidentLocationEnum.OTHER]:
    accidentLocation.generalWorkAccident.other.defaultMessage,
  [FishermanWorkplaceAccidentLocationEnum.ONTHESHIP]:
    accidentLocation.fishermanAccident.onTheShip.defaultMessage,
  [FishermanWorkplaceAccidentLocationEnum.TOORFROMTHEWORKPLACE]:
    accidentLocation.fishermanAccident.toOrFromTheWorkplace.defaultMessage,
  [FishermanWorkplaceAccidentLocationEnum.OTHER]:
    accidentLocation.fishermanAccident.other.defaultMessage,
  [ProfessionalAthleteAccidentLocationEnum.SPORTCLUBSFACILITES]:
    accidentLocation.professionalAthleteAccident.atTheClubsSportsFacilites
      .defaultMessage,
  [ProfessionalAthleteAccidentLocationEnum.TOORFROMTHESPORTCLUBSFACILITES]:
    accidentLocation.professionalAthleteAccident.toOrFromTheSportsFacilites
      .defaultMessage,
  [ProfessionalAthleteAccidentLocationEnum.OTHER]:
    accidentLocation.professionalAthleteAccident.other.defaultMessage,
  [AgricultureAccidentLocationEnum.ATTHEWORKPLACE]:
    accidentLocation.agricultureAccident.atTheWorkplace.defaultMessage,
  [AgricultureAccidentLocationEnum.TOORFROMTHEWORKPLACE]:
    accidentLocation.agricultureAccident.toOrFromTheWorkplace.defaultMessage,
  [RescueWorkAccidentLocationEnum.TOORFROMRESCUE]:
    accidentLocation.rescueWorkAccident.toOrFromRescue.defaultMessage,
  [RescueWorkAccidentLocationEnum.DURINGRESCUE]:
    accidentLocation.rescueWorkAccident.duringRescue.defaultMessage,
  [RescueWorkAccidentLocationEnum.OTHER]:
    accidentLocation.rescueWorkAccident.other.defaultMessage,
  [StudiesAccidentLocationEnum.ATTHESCHOOL]:
    accidentLocation.studiesAccidentLocation.atTheSchool.defaultMessage,
  [StudiesAccidentLocationEnum.OTHER]:
    accidentLocation.studiesAccidentLocation.other.defaultMessage,
}
