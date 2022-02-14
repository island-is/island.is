export const YES = 'yes'
export const NO = 'no'
export const MANUAL = 'manual'
export const SPOUSE = 'spouse'

export const FILE_SIZE_LIMIT = 10000000 // 10MB

export enum ParentalRelations {
  primary = 'primary',
  secondary = 'secondary',
}

export enum API_MODULE_ACTIONS {
  assignOtherParent = 'assignOtherParent',
  assignEmployer = 'assignEmployer',
  sendApplication = 'sendApplication',
  notifyApplicantOfRejectionFromOtherParent = 'notifyApplicantOfRejectionFromOtherParent',
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

  APPROVED = 'approved',

  // Edit Flow
  EDIT_OR_ADD_PERIODS = 'editOrAddPeriods',

  EMPLOYER_WAITING_TO_ASSIGN_FOR_EDITS = 'employerWaitingToAssignForEdits',
  EMPLOYER_APPROVE_EDITS = 'employerApproveEdits',
  EMPLOYER_EDITS_ACTION = 'employerRequiresActionOnEdits',

  VINNUMALASTOFNUN_APPROVE_EDITS = 'vinnumalastofnunApproveEdits',
  VINNUMALASTOFNUN_EDITS_ACTION = 'vinnumalastofnunRequiresActionOnEdits',
}

export const DATE_FORMAT = 'yyyy-MM-dd'
