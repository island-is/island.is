import { complaint, info, sharedFields } from '../lib/messages'

export const YES = 'yes'
export const NO = 'no'

export enum API_MODULE {
  sendApplication = 'sendApplication',
}

export const FILE_SIZE_LIMIT = 10000000

export enum OnBehalf {
  MYSELF = 'myself',
  MYSELF_AND_OR_OTHERS = 'myselfAndOrOthers',
  OTHERS = 'others',
  ORGANIZATION_OR_INSTITUTION = 'organizationOrInsititution',
}

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

export const subjectOfComplaintValueLabelMapper = {
  [SubjectOfComplaint.WITH_AUTHORITIES]: complaint.labels.subjectAuthorities,
  [SubjectOfComplaint.LACK_OF_EDUCATION]:
    complaint.labels.subjectLackOfEducation,
  [SubjectOfComplaint.SOCIAL_MEDIA]: complaint.labels.subjectSocialMedia,
  [SubjectOfComplaint.REQUEST_FOR_ACCESS]:
    complaint.labels.subjectRequestForAccess,
  [SubjectOfComplaint.RIGHTS_OF_OBJECTION]:
    complaint.labels.subjectRightOfObjection,
  [SubjectOfComplaint.EMAIL]: complaint.labels.subjectEmail,
  [SubjectOfComplaint.NATIONAL_ID]: complaint.labels.subjectNationalId,
  [SubjectOfComplaint.EMAIL_IN_WORKPLACE]:
    complaint.labels.subjectEmailInWorkplace,
  [SubjectOfComplaint.UNAUTHORIZED_PUBLICATION]:
    complaint.labels.subjectUnauthorizedPublication,
  [SubjectOfComplaint.VANSKILASKRA]: complaint.labels.subjectVanskilaskra,
  [SubjectOfComplaint.VIDEO_RECORDINGS]: complaint.labels.subjectVideoRecording,
  [SubjectOfComplaint.OTHER]: complaint.labels.subjectOther,
}

export const onBehalfValueLabelMapper = {
  [OnBehalf.MYSELF]: info.labels.myself,
  [OnBehalf.MYSELF_AND_OR_OTHERS]: info.labels.myselfAndOrOthers,
  [OnBehalf.OTHERS]: info.labels.others,
  [OnBehalf.ORGANIZATION_OR_INSTITUTION]: info.labels.organizationInstitution,
}

export const yesNoValueLabelMapper = {
  [YES]: sharedFields.yes,
  [NO]: sharedFields.no,
}
