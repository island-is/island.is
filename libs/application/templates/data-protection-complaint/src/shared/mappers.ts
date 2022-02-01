import { complaint, info, sharedFields } from '../lib/messages'
import { NO, OnBehalf, SubjectOfComplaint, YES } from './constants'

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
