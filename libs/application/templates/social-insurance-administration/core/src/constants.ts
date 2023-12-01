import { DefaultEvents } from '@island.is/application/types'

export enum Actions {
  SEND_APPLICATION = 'sendApplication',
}

export enum BankAccountType {
  ICELANDIC = 'icelandic',
  FOREIGN = 'foreign',
}

export enum Roles {
  APPLICANT = 'applicant',
  ORGANIZATION_REVIEWER = 'tryggingastofnun',
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',

  TRYGGINGASTOFNUN_SUBMITTED = 'tryggingastofnunSubmitted', // NYSKRAD = 91
  TRYGGINGASTOFNUN_IN_REVIEW = 'tryggingastofnunInReview', // I_VINNSLU = 562

  ADDITIONAL_DOCUMENTS_REQUIRED = 'additionalDocumentsRequired', // I_BID_GOGN_VANTAR = 1617

  REJECTED = 'rejected', // SYNJAD = 1281
  APPROVED = 'approved', // AFGREIDD = 563
}

export enum OAPEvents {
  ADDITIONALDOCUMENTSREQUIRED = 'ADDITIONALDOCUMENTSREQUIRED',
  INREVIEW = 'INREVIEW',
  PENDING = 'PENDING',
  DISMISSED = 'DISMISSED',
}

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: OAPEvents.ADDITIONALDOCUMENTSREQUIRED } // Ex: TR ask for more documents
  | { type: OAPEvents.INREVIEW } // Ex: TR's employee start review application
  | { type: DefaultEvents.ABORT }

export const FILE_SIZE_LIMIT = 5000000 // 5MB
export const IS = 'IS'
