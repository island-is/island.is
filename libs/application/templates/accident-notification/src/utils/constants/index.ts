export const YES = 'yes'
export const NO = 'no'

export const UPLOAD_ACCEPT = '.pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic'

export const FILE_SIZE_LIMIT = 10000000 // 10MB

export enum States {
  // Draft flow
  PREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  REVIEW = 'review',
  REVIEW_ADD_ATTACHMENT = 'reviewAddAttachment',
  IN_FINAL_REVIEW = 'inFinalReview',
}
