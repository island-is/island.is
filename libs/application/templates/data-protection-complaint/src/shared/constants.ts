export const FILE_SIZE_LIMIT = 10000000

export enum SubjectOfComplaint {
  WITH_AUTHORITIES = 'withAuthorities',
  LACK_OF_EDUCATION = 'lackOfEducation',
  SOCIAL_MEDIA = 'socialMedia',
  REQUEST_FOR_ACCESS = 'requestForAccess',
  RIGHTS_OF_OBJECTION = 'rightOfObjection',
  EMAIL = 'email',
  NATIONAL_ID = 'nationalId',
  EMAIL_IN_WORKPLACE = 'emailInWorkplace',
  UNAUTHORIZED_PUBLICATION = 'unauthorizedPublication',
  VANSKILASKRA = 'vanskilaskra',
  VIDEO_RECORDINGS = 'videoRecordings',
  OTHER = 'other',
}

export enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}
export enum TEMPLATE_API_ACTIONS {
  // Has to match name of action in template API module
  // (will be refactored when state machine is a part of API module)
  sendApplication = 'sendApplication',
}

export enum OnBehalf {
  MYSELF = 'myself',
  MYSELF_AND_OR_OTHERS = 'myselfAndOrOthers',
  OTHERS = 'others',
  ORGANIZATION_OR_INSTITUTION = 'organizationOrInsititution',
}

export interface SubmittedApplicationData {
  data?: {
    applicationPdfKey: string
  }
}
