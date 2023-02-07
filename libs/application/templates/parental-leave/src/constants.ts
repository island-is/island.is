import { DefaultEvents } from '@island.is/application/types'

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
  setBirthDateForNoPrimaryParent = 'setBirthDateForNoPrimaryParent',
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

  ADDITIONAL_DOCUMENTS_REQUIRED = 'additionalDocumentsRequired',
  INREVIEW_ADDITIONAL_DOCUMENTS_REQUIRED = 'inReviewAdditionalDocumentsRequired',

  APPROVED = 'approved',
  CLOSED = 'closed',

  // Edit Flow
  EDIT_OR_ADD_PERIODS = 'editOrAddPeriods',

  EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS = 'employerWaitingToAssignForEdits',
  EMPLOYER_APPROVE_EDITS = 'employerApproveEdits',
  EMPLOYER_EDITS_ACTION = 'employerRequiresActionOnEdits',

  VINNUMALASTOFNUN_APPROVE_EDITS = 'vinnumalastofnunApproveEdits',
  VINNUMALASTOFNUN_EDITS_ACTION = 'vinnumalastofnunRequiresActionOnEdits',

  RESIDENCE_GRAND_APPLICATION = 'residenceGrantApplication',
  RESIDENCE_GRAND_APPLICATION_IN_PROGRESS = 'residenceGrantApplicationInProgress',
}

export enum AnswerValidationConstants {
  EMPLOYER = 'employer',
  FILEUPLOAD = 'fileUpload',
  PAYMENTS = 'payments',
  OTHER_PARENT = 'otherParentObj',
  OTHER_PARENT_EMAIL = 'otherParentEmail',
  REQUEST_RIGHTS = 'requestRights',
  GIVE_RIGHTS = 'giveRights',
  // Check Multiple_Births
  MULTIPLE_BIRTHS = 'multipleBirths',
  // When attempting to continue from the periods repeater main screen
  // this validator will get called to validate all of the periods
  VALIDATE_PERIODS = 'validatedPeriods',
  // When a new entry is added to the periods repeater
  // the repeater sends all the periods saved in 'periods'
  // to this validator, which will validate the latest one
  VALIDATE_LATEST_PERIOD = 'periods',
}

export const DATE_FORMAT = 'yyyy-MM-dd'

export type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }
  | { type: DefaultEvents.EDIT }
  | { type: 'MODIFY' } // Ex: The user might modify their 'edits'.
  | { type: 'CLOSED' } // Ex: Close application
  /**
   * States for routing Dvalarstyrkur
   *  Takes previous state and add
   *  a postfix of REJECT if rejected button is pushed
   */
  | { type: 'APPROVED' }
  | { type: 'RESIDENCEGRANTAPPLICATION' } // Ex: when the baby is born a parent can apply for resident grant
  | { type: 'ADDITIONALDOCUMENTSREQUIRED' } // Ex: VMST ask for more documents
  | { type: 'APPROVEDREJECT' }
  | { type: 'VINNUMALASTOFNUNAPPROVALREJECT' }
  | { type: 'RESIDENCEGRANTAPPLICATIONREJECT' }
  | { type: 'VINNUMALASTOFNUNAPPROVEEDITSREJECT' }
