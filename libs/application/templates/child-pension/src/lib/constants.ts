import { DefaultEvents } from '@island.is/application/types'

export const YES = 'yes'
export const NO = 'no'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }

export enum Roles {
  APPLICANT = 'applicant',
}

export enum States {
  PREREQUESITES = 'prerequesites',
  DRAFT = 'draft',
  DONE = 'done',
  TRYGGINGASTOFNUN_SUBMITTED = 'tryggingastofnunSubmitted',
  TRYGGINGASTOFNUN_IN_REVIEW = 'tryggingastofnunInReview',
  ADDITIONAL_DOCUMENTS_REQUIRED = 'additionalDocumentsRequired',
  REJECTED = 'rejected',
  APPROVED = 'approved',
}
