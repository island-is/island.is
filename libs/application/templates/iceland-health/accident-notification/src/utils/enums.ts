export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  REVIEW = 'review',
  REVIEW_ADD_ATTACHMENT = 'reviewAddAttachment',
  IN_FINAL_REVIEW = 'inFinalReview',
}

export enum Status {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export enum OnBehalf {
  MYSELF = 'myself',
  OTHERS = 'others',
}

export enum Roles {
  DELEGATE = 'delegate', // Any type of auth delegation (umboð)
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
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
