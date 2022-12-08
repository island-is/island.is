export const YES = 'yes'
export const NO = 'no'
export const MANUAL = 'manual'
export const SPOUSE = 'spouse'
export const SINGLE = 'single'
export const PARENTAL_LEAVE = 'parentalLeave'
export const PARENTAL_GRANT = 'parentalGrant'
export const PARENTAL_GRANT_STUDENTS = 'parentalGrantStudents'

export const FILE_SIZE_LIMIT = 10000000 // 10MB

export const NO_UNION = 'F000'
export const NO_PRIVATE_PENSION_FUND = 'X000'
export const NO_UNEMPLOYED_BENEFITS = 'B000'
export const NO_MULTIPLE_BIRTHS = '1'

export enum UnEmployedBenefitTypes {
  vmst = 'Vinnumálastofnun (atvinnuleysisbætur)',
  union = 'Stéttarfélagi (dagpeningar/veikindaréttur)',
  healthInsurance = 'Sjúkratryggingar Íslands (sjúkradagpeningar)',
  other = 'Annað',
}

export enum ParentalRelations {
  primary = 'primary',
  secondary = 'secondary',
}

export enum ApiModuleActions {
  assignOtherParent = 'assignOtherParent',
  assignEmployer = 'assignEmployer',
  sendApplication = 'sendApplication',
  notifyApplicantOfRejectionFromOtherParent = 'notifyApplicantOfRejectionFromOtherParent',
  validateApplication = 'validateApplication',
  notifyApplicantOfRejectionFromEmployer = 'notifyApplicantOfRejectionFromEmployer',
}

export enum StartDateOptions {
  ESTIMATED_DATE_OF_BIRTH = 'estimatedDateOfBirth',
  ACTUAL_DATE_OF_BIRTH = 'actualDateOfBirth',
  SPECIFIC_DATE = 'specificDate',
}

export enum TransferRightsOption {
  NONE = 'NONE',
  REQUEST = 'REQUEST',
  GIVE = 'GIVE',
}

export enum States {
  PREREQUISITES = 'prerequisites',

  // Draft flow
  DRAFT = 'draft',

  OTHER_PARENT_APPROVAL = 'otherParentApproval',
  OTHER_PARENT_ACTION = 'otherParentRequiresAction',

  EMPLOYER_WAITING_TO_ASSIGN = 'employerWaitingToAssign',
  EMPLOYER_APPROVAL = 'employerApproval',
  EMPLOYER_ACTION = 'employerRequiresAction',

  VINNUMALASTOFNUN_APPROVAL = 'vinnumalastofnunApproval',
  VINNUMALASTOFNUN_ACTION = 'vinnumalastofnunRequiresAction',

  ADDITIONAL_DOCUMENT_REQUIRED = 'additionalDocumentRequired',
  APPROVED = 'approved',
  CLOSED = 'closed',

  // Edit Flow
  EDIT_OR_ADD_PERIODS = 'editOrAddPeriods',

  EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS = 'employerWaitingToAssignForEdits',
  EMPLOYER_APPROVE_EDITS = 'employerApproveEdits',
  EMPLOYER_EDITS_ACTION = 'employerRequiresActionOnEdits',

  VINNUMALASTOFNUN_APPROVE_EDITS = 'vinnumalastofnunApproveEdits',
  VINNUMALASTOFNUN_EDITS_ACTION = 'vinnumalastofnunRequiresActionOnEdits',
}

export const DATE_FORMAT = 'yyyy-MM-dd'
