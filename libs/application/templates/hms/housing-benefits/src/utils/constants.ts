import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type:
    | DefaultEvents.SUBMIT
    | DefaultEvents.ABORT
    | DefaultEvents.APPROVE
    | DefaultEvents.REJECT
    | DefaultEvents.EDIT
  /** Set by ApplicationTemplateHelper.changeState when the API passes the authenticated user */
  nationalId?: string
}

export enum States {
  PREREQUISITES = 'prerequisites',
  NO_RENTAL_AGREEMENT = 'noRentalAgreement',
  TAX_RETURN_REQUIRED = 'taxReturnRequired',
  DRAFT = 'draft',
  ASSIGNEE_APPROVAL = 'assigneeApproval',
  APPLICANT_SUBMIT = 'applicantSubmit',
  ADD_HOUSEHOLD_MEMBER = 'addHouseholdMember',
  EXTRA_DATA = 'extraData',
  IN_REVIEW = 'inReview',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DELAYED = 'delayed',
}

export enum TemplateApiActions {
  submitApplication = 'submitApplication',
  notifyAssignees = 'notifyAssignees',
  notifyApplicantOnAssigneeSubmit = 'notifyApplicantOnAssigneeSubmit',
  notifyApplicantOnAssigneeReject = 'notifyApplicantOnAssigneeReject',
  notifyApplicantOnExtraDataRequested = 'notifyApplicantOnExtraDataRequested',
  notifyApplicantOnApprovedByInstitution = 'notifyApplicantOnApprovedByInstitution',
  notifyApplicantOnRejectedByInstitution = 'notifyApplicantOnRejectedByInstitution',
}

export enum Roles {
  APPLICANT = 'applicant',
  UNSIGNED_PREREQ_ASSIGNEE = 'unsignedPrereqAssignee',
  UNSIGNED_DRAFT_ASSIGNEE = 'unsignedDraftAssignee',
  SIGNED_ASSIGNEE = 'signedAssignee',
  REJECTED_ASSIGNEE = 'rejectedAssignee',
  INSTITUTION = 'institution',
}

/** Gervimaður Bretland — institution UI tester; never assigned or mapped on production. */
export const DEV_INSTITUTION_TESTER_NATIONAL_ID = '0101304929'

export const UPLOAD_ACCEPT = '.pdf,.doc,.docx,.rtf,.jpg,.jpeg,.png,.heic'

export const MAX_TEXT_LENGTH = 500
export const MAX_NUMBER_LENGTH = 10
