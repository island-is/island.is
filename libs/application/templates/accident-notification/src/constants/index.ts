export const YES = 'yes'
export const NO = 'no'

export enum States {
  PREREQUISITES = 'prerequisites',

  // Draft flow
  DRAFT = 'draft',

  APPROVED = 'approved',
  SUBMITTED = 'submitted',

  NEEDS_DOCUMENT = 'needsDocument',
  NEEDS_REVIEW = 'needsReview',
  NEEDS_DOCUMENT_AND_REVIEW = 'needsDocumentAndReview',
  IN_FINAL_REVIEW = 'inFinalReview',
}
