import { DefaultEvents } from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'
import { parentalLeaveFormMessages } from './lib/messages'

export const MANUAL = 'manual'
export const SPOUSE = 'spouse'
export const SINGLE = 'single'
export const PARENTAL_LEAVE = 'parentalLeave'
export const PARENTAL_GRANT = 'parentalGrant'
export const PARENTAL_GRANT_STUDENTS = 'parentalGrantStudents'
export const PERMANENT_FOSTER_CARE = 'foster_care'
export const ADOPTION = 'primary_adoption'
export const OTHER_NO_CHILDREN_FOUND = 'other'

export const FILE_SIZE_LIMIT = 2000000 // 2MB

export const NO_UNION = 'F000'
export const NO_PRIVATE_PENSION_FUND = 'X000'
export const NO_UNEMPLOYED_BENEFITS = 'B000'
export const NO_MULTIPLE_BIRTHS = '1'
export const MINIMUM_PERIOD_LENGTH = 14

export enum PLEvents {
  CLOSED = 'CLOSED',
  ADDITIONALDOCUMENTSREQUIRED = 'ADDITIONALDOCUMENTSREQUIRED',
}

export type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }
  | { type: DefaultEvents.EDIT }
  | { type: 'CLOSED' } // Ex: Close application
  | { type: 'ADDITIONALDOCUMENTSREQUIRED' } // Ex: VMST ask for more documents

export enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
  ORGANISATION_REVIEWER = 'vmst',
}

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
  assignEmployers = 'assignEmployers',
  assignEmployer = 'assignEmployer',
  sendApplication = 'sendApplication',
  notifyApplicantOfRejectionFromOtherParent = 'notifyApplicantOfRejectionFromOtherParent',
  validateApplication = 'validateApplication',
  notifyApplicantOfRejectionFromEmployer = 'notifyApplicantOfRejectionFromEmployer',
  setChildrenInformation = 'setChildrenInformation',
  setBirthDateForNoPrimaryParent = 'setBirthDateForNoPrimaryParent',
  setBirthDate = 'setBirthDate',
  /**
   * Fetches and returns VMST periods for the given application.
   * Need to add this to `onExit` in every state that reaches `EDIT_OR_ADD_EMPLOYERS_AND_PERIODS`,
   * except states that are still pending employer approval.
   */
  setVMSTPeriods = 'setVMSTPeriods',
  setApplicationRights = 'setApplicationRights',
  setOtherParent = 'setOtherParent',
}

export enum StartDateOptions {
  ESTIMATED_DATE_OF_BIRTH = 'estimatedDateOfBirth',
  ACTUAL_DATE_OF_BIRTH = 'actualDateOfBirth',
  SPECIFIC_DATE = 'specificDate',
  ADOPTION_DATE = 'adoptionDate',
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

  APPROVED = 'approved',
  CLOSED = 'closed',

  // Edit Flow
  EDIT_OR_ADD_EMPLOYERS_AND_PERIODS = 'editOrAddEmployersAndPeriods',

  EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS = 'employerWaitingToAssignForEdits',
  EMPLOYER_APPROVE_EDITS = 'employerApproveEdits',
  EMPLOYER_EDITS_ACTION = 'employerRequiresActionOnEdits',

  VINNUMALASTOFNUN_APPROVE_EDITS = 'vinnumalastofnunApproveEdits',
  VINNUMALASTOFNUN_EDITS_ACTION = 'vinnumalastofnunRequiresActionOnEdits',

  RESIDENCE_GRANT_APPLICATION = 'residenceGrantApplication',
  RESIDENCE_GRANT_APPLICATION_NO_BIRTH_DATE = 'residenceGrantApplicationNoBirthDate',
}

export enum AnswerValidationConstants {
  EMPLOYER = 'employer',
  REQUEST_RIGHTS = 'requestRights',
  GIVE_RIGHTS = 'giveRights',
  // When attempting to continue from the periods repeater main screen
  // this validator will get called to validate all of the periods
  VALIDATE_PERIODS = 'validatedPeriods',
  // When a new entry is added to the periods repeater
  // the repeater sends all the periods saved in 'periods'
  // to this validator, which will validate the latest one
  VALIDATE_LATEST_PERIOD = 'periods',
}

export const DATE_FORMAT = 'yyyy-MM-dd'

export enum FileType {
  PERIOD = 'period',
  DOCUMENT = 'document',
  DOCUMENTPERIOD = 'documentPeriod',
  EMPPER = 'empper',
  EMPLOYER = 'employer',
  EMPDOC = 'empdoc',
  EMPDOCPER = 'empdocper',
}

export enum Languages {
  IS = 'IS',
  EN = 'EN',
}

export enum AttachmentTypes {
  SELF_EMPLOYED = 'selfEmployedFile',
  STUDENT = 'studentFile',
  BENEFITS = 'benefitsFile',
  SINGLE_PARENT = 'singleParent',
  PARENT_WITHOUT_BIRTH_PARENT = 'parentWithoutBirthParent',
  PERMANENT_FOSTER_CARE = 'permanentFosterCare',
  ADOPTION = 'adoption',
  EMPLOYMENT_TERMINATION_CERTIFICATE = 'employmentTerminationCertificateFile',
  FILE = 'file',
  CHANGE_EMPLOYER = 'changeEmployerFile',
}

export const AttachmentLabel: {
  [key: string]: MessageDescriptor
} = {
  selfEmployedFile: parentalLeaveFormMessages.selfEmployed.attachmentTitle,
  studentFile: parentalLeaveFormMessages.attachmentScreen.studentTitle,
  benefitsFile:
    parentalLeaveFormMessages.attachmentScreen.unemploymentBenefitsTitle,
  singleParent: parentalLeaveFormMessages.attachmentScreen.singleParentTitle,
  parentWithoutBirthParent:
    parentalLeaveFormMessages.attachmentScreen.parentWithoutBirthParentTitle,
  permanentFosterCare:
    parentalLeaveFormMessages.attachmentScreen.permanentFostercareTitle,
  adoption: parentalLeaveFormMessages.attachmentScreen.adoptionTitle,
  employmentTerminationCertificateFile:
    parentalLeaveFormMessages.attachmentScreen
      .employmentTerminationCertificateTitle,
  file: parentalLeaveFormMessages.attachmentScreen.title,
  changeEmployerFile:
    parentalLeaveFormMessages.attachmentScreen.changeEmployerTitle,
}
