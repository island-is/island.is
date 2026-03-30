import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type:
    | DefaultEvents.SUBMIT
    | DefaultEvents.ABORT
    | DefaultEvents.APPROVE
    | DefaultEvents.REJECT
    | DefaultEvents.EDIT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  NO_RENTAL_AGREEMENT = 'noRentalAgreement',
  DRAFT = 'draft',
  ASSIGNEE_APPROVAL = 'assigneeApproval',
  APPLICANT_SUBMIT = 'applicantSubmit',
  EXTRA_DATA = 'extraData',
  IN_REVIEW = 'inReview',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DELAYED = 'delayed',
}

export enum Roles {
  APPLICANT = 'applicant',
  UNSIGNED_PREREQ_ASSIGNEE = 'unsignedPrereqAssignee',
  UNSIGNED_DRAFT_ASSIGNEE = 'unsignedDraftAssignee',
  SIGNED_ASSIGNEE = 'signedAssignee',
  INSTITUTION = 'institution',
}
