import { NO, YES } from '@island.is/application/core'
import { complaint, info, sharedFields } from '../lib/messages'
import { OnBehalf, SubjectOfComplaint } from './constants'

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
  [SubjectOfComplaint.WITH_AUTHORITIES]:
    complaint.labels[SubjectOfComplaint.WITH_AUTHORITIES],
  [SubjectOfComplaint.LACK_OF_EDUCATION]:
    complaint.labels[SubjectOfComplaint.LACK_OF_EDUCATION],
  [SubjectOfComplaint.SOCIAL_MEDIA]:
    complaint.labels[SubjectOfComplaint.SOCIAL_MEDIA],
  [SubjectOfComplaint.REQUEST_FOR_ACCESS]:
    complaint.labels[SubjectOfComplaint.REQUEST_FOR_ACCESS],
  [SubjectOfComplaint.RIGHTS_OF_OBJECTION]:
    complaint.labels[SubjectOfComplaint.RIGHTS_OF_OBJECTION],
  [SubjectOfComplaint.EMAIL]: complaint.labels[SubjectOfComplaint.EMAIL],
  [SubjectOfComplaint.NATIONAL_ID]:
    complaint.labels[SubjectOfComplaint.NATIONAL_ID],
  [SubjectOfComplaint.EMAIL_IN_WORKPLACE]:
    complaint.labels[SubjectOfComplaint.EMAIL_IN_WORKPLACE],
  [SubjectOfComplaint.UNAUTHORIZED_PUBLICATION]:
    complaint.labels[SubjectOfComplaint.UNAUTHORIZED_PUBLICATION],
  [SubjectOfComplaint.VANSKILASKRA]:
    complaint.labels[SubjectOfComplaint.VANSKILASKRA],
  [SubjectOfComplaint.VIDEO_RECORDINGS]:
    complaint.labels[SubjectOfComplaint.VIDEO_RECORDINGS],
  [SubjectOfComplaint.OTHER]: complaint.labels[SubjectOfComplaint.OTHER],
}
