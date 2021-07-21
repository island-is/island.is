import { YES, NO } from './../constants'

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

export enum ProfessionalAthleteAccidentLocationEnum {
  SPORTCLUBSFACILITES = 'sportClubsFacilites',
  TOORFROMTHESPORTCLUBSFACILITES = 'toOrFromTheSportClubsFacilites',
  OTHER = 'ProfessionalAthleteAccidentLocation.other',
}

export enum AgricultureAccidentLocationEnum {
  ATTHEWORKPLACE = 'atTheWorkplace',
  TOORFROMTHEWORKPLACE = 'toOrFromTheWorkplace',
  OTHER = 'AgricultureAccidentLocation.other',
}
