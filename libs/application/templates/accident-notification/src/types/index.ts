import { NO, YES } from './../constants'

export enum DataProviderTypes {
  NationalRegistry = 'NationalRegistryProvider',
  UserProfile = 'UserProfileProvider',
}

export enum WhoIsTheNotificationForEnum {
  JURIDICALPERSON = 'juridicalPerson',
  ME = 'me',
  POWEROFATTORNEY = 'powerOfAttorney',
}

export enum AccidentTypeEnum {
  HOMEACTIVITIES = 'homeActivities',
  WORK = 'work',
  RESCUEWORK = 'rescueWork',
  STUDIES = 'studies',
  SPORTS = 'sports',
}

export type YesOrNo = typeof NO | typeof YES

export enum AttachmentsEnum {
  INJURYCERTIFICATE = 'injuryCertificate',
  HOSPITALSENDSCERTIFICATE = 'hospitalSendsCertificate',
  SENDCERTIFICATELATER = 'sendCertificateLater',
}

export enum GeneralWorkplaceAccidentLocationEnum {
  ATTHEWORKPLACE = 'atTheWorkplace',
  TOORFROMTHEWORKPLACE = 'GeneralWorkplaceAccidentLocation.toOrFromTheWorkplace',
  OTHER = 'GeneralWorkplaceAccidentLocation.other',
}

export enum FishermanWorkplaceAccidentLocationEnum {
  ONTHESHIP = 'onTheShip',
  TOORFROMTHEWORKPLACE = 'FishermanWorkplaceAccidentLocation.toOrFromTheWorkplace',
  OTHER = 'FishermanWorkplaceAccidentLocation.other',
}

export enum FishermanWorkplaceAccidentShipLocationEnum {
  SAILINGORFISHING = 'FishermanWorkplaceAccidentShipLocation.sailingOrFishing',
  HARBOR = 'FishermanWorkplaceAccidentShipLocation.harbor',
  OTHER = 'FishermanWorkplaceAccidentShipLocation.other',
}

export enum ProfessionalAthleteAccidentLocationEnum {
  SPORTCLUBSFACILITES = 'sportClubsFacilites',
  TOORFROMTHESPORTCLUBSFACILITES = 'toOrFromTheSportClubsFacilites',
  OTHER = 'ProfessionalAthleteAccidentLocation.other',
}

export enum AgricultureAccidentLocationEnum {
  ATTHEWORKPLACE = 'agriculture.atTheWorkplace',
  TOORFROMTHEWORKPLACE = 'agriculture.toOrFromTheWorkplace',
  OTHER = 'AgricultureAccidentLocation.other',
}

export enum WorkAccidentTypeEnum {
  GENERAL = 'general',
  FISHERMAN = 'fisherman',
  PROFESSIONALATHLETE = 'professionalAthlete',
  AGRICULTURE = 'agriculture',
}

export enum RescueWorkAccidentLocationEnum {
  DURINGRESCUE = 'duringRescue',
  TOORFROMRESCUE = 'toOrFromRescue',
  OTHER = 'rescueWork.other',
}

export enum StudiesAccidentTypeEnum {
  INTERNSHIP = 'internship',
  APPRENTICESHIP = 'apprenticeship',
  VOCATIONALEDUCATION = 'vocationalEducation',
}

export enum StudiesAccidentLocationEnum {
  ATTHESCHOOL = 'atTheSchool',
  DURINGSTUDIES = 'duringStudies',
  OTHER = 'studiesLocation.other',
}
