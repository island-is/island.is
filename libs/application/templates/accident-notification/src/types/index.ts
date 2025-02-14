import { YesOrNo } from '@island.is/application/core'
import { companyInfo, representativeInfo } from '../lib/messages'

export type CompanyInfo = {
  nationalRegistrationId: string
  name: string
  type: AccidentTypeEnum | WorkAccidentTypeEnum
  onPayRoll?: {
    answer: YesOrNo
  }
}

export type Applicant = {
  name: string
  nationalId: string
  email: string
  phoneNumber: string
  jobTitle?: string
}

export enum Status {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export type AccidentNotifTypes =
  | 'InjuryCertificate'
  | 'ProxyDocument'
  | 'PoliceReport'
  | 'Unknown'

export type AccidentNotificationAttachmentStatus = {
  InjuryCertificate?: boolean | null
  ProxyDocument?: boolean | null
  PoliceReport?: boolean | null
  Unknown?: boolean | null
}

export type RepresentativeInfo = {
  name: string
  nationalId: string
  email: string
  phoneNumber?: string
}

export type FileType = {
  url?: string | undefined
  name: string
  key: string
}

export enum OnBehalf {
  MYSELF = 'myself',
  OTHERS = 'others',
}

export enum WhoIsTheNotificationForEnum {
  JURIDICALPERSON = 'juridicalPerson',
  ME = 'me',
  POWEROFATTORNEY = 'powerOfAttorney',
  CHILDINCUSTODY = 'childInCustody',
}

export enum AccidentTypeEnum {
  HOMEACTIVITIES = 'homeActivities',
  WORK = 'work',
  RESCUEWORK = 'rescueWork',
  STUDIES = 'studies',
  SPORTS = 'sports',
}

export enum AttachmentsEnum {
  INJURYCERTIFICATE = 'injuryCertificate',
  HOSPITALSENDSCERTIFICATE = 'hospitalSendsCertificate',
  SENDCERTIFICATELATER = 'sendCertificateLater',
  ADDITIONALNOW = 'additionalNow',
  ADDITIONALLATER = 'additionalLater',
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
  GENERAL = 'generalWorkAccident',
  FISHERMAN = 'fishermanAccident',
  PROFESSIONALATHLETE = 'professionalAthlete',
  AGRICULTURE = 'agricultureAccident',
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
  OTHER = 'studiesLocation.other',
}

export enum PowerOfAttorneyUploadEnum {
  UPLOADNOW = 'uploadNow',
  UPLOADLATER = 'uploadLater',
  FORCHILDINCUSTODY = 'forChildInCustody',
}

export enum ReviewApprovalEnum {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NOTREVIEWED = 'notReviewed',
}

export enum ReviewSectionState {
  inProgress = 'In progress',
  received = 'Received',
  missing = 'Missing documents',
  pending = 'Pending',
  approved = 'Approved',
  objected = 'Objected',
}

export interface SubmittedApplicationData {
  data?: {
    documentId: number
    sentDocuments: string[]
  }
}

export interface ReviewAddAttachmentData {
  data?: {
    sentDocuments: string[]
  }
}

// Types for new accident notification API

export type ApplicantV2 = {
  address?: string | null
  city?: string | null
  email?: string | null
  name?: string | null
  nationalId?: string | null
  phoneNumber?: string | null
  postalCode?: string | null
}

export type InjuredPersonInformationV2 = {
  email?: string | null
  jobTitle?: string | null
  name?: string | null
  nationalId?: string | null
  phoneNumber?: string | null
}

export type AccidentDetailsV2 = {
  accidentSymptoms?: string | null
  dateOfAccident?: string | null
  dateOfDoctorVisit?: string | null
  descriptionOfAccident?: string | null
  timeOfAccident?: string | null
  timeOfDoctorVisit?: string | null
}

export type HomeAccidentV2 = {
  address?: string | null
  community?: string | null
  moreDetails?: string | null
  postalCode?: string | null
}

export type WorkMachineV2 = {
  descriptionOfMachine?: string | null
}

export type FishingShipInfoV2 = {
  homePort?: string | null
  shipCharacters?: string | null
  shipName?: string | null
  shipRegisterNumber?: string | null
}

export type CompanyInfoV2 = {
  name?: string | null
  nationalRegistrationId?: string | null
}

export type RepresentativeInfoV2 = {
  email?: string | null
  name?: string | null
  nationalId?: string | null
  phoneNumber?: string | null
}

export type WorkplaceData = {
  companyInfo: CompanyInfo
  representitive: RepresentativeInfo
  companyInfoMsg: typeof companyInfo
  representitiveMsg: typeof representativeInfo
  type: WorkAccidentTypeEnum | AccidentTypeEnum
  onPayRoll?: YesOrNo
  screenId: string
}
