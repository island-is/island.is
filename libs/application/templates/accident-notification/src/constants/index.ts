export const YES = 'yes'
export const NO = 'no'

export const UPLOAD_ACCEPT = '.pdf, .doc, .docx, .rtf'

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

  ADD_DOCUMENTS = 'addDocuments',
  OVERVIEW = 'overview',
  THIRD_PARTY_COMMENT = 'thirdPartyComment',
}
