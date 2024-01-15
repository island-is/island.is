import { DefaultEvents } from '@island.is/application/types'
import { socialInsuranceAdministrationMessage } from './messages'

export enum Actions {
  SEND_APPLICATION = 'sendApplication',
  SEND_DOCUMENTS = 'sendDocuments',
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

export const MONTHS = [
  {
    value: 'January',
    label: socialInsuranceAdministrationMessage.months.january,
  },
  {
    value: 'February',
    label: socialInsuranceAdministrationMessage.months.february,
  },
  {
    value: 'March',
    label: socialInsuranceAdministrationMessage.months.march,
  },
  {
    value: 'April',
    label: socialInsuranceAdministrationMessage.months.april,
  },
  { value: 'May', label: socialInsuranceAdministrationMessage.months.may },
  {
    value: 'June',
    label: socialInsuranceAdministrationMessage.months.june,
  },
  {
    value: 'July',
    label: socialInsuranceAdministrationMessage.months.july,
  },
  {
    value: 'August',
    label: socialInsuranceAdministrationMessage.months.august,
  },
  {
    value: 'September',
    label: socialInsuranceAdministrationMessage.months.september,
  },
  {
    value: 'October',
    label: socialInsuranceAdministrationMessage.months.october,
  },
  {
    value: 'November',
    label: socialInsuranceAdministrationMessage.months.november,
  },
  {
    value: 'December',
    label: socialInsuranceAdministrationMessage.months.desember,
  },
]

export enum TaxLevelOptions {
  INCOME = '2',
  FIRST_LEVEL = '1',
  SECOND_LEVEL = '3',
}

export const fileUploadSharedProps = {
  maxSize: FILE_SIZE_LIMIT,
  maxSizeErrorText:
    socialInsuranceAdministrationMessage.fileUpload.attachmentMaxSizeError,
  uploadAccept: '.pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic',
  uploadHeader:
    socialInsuranceAdministrationMessage.fileUpload.attachmentHeader,
  uploadDescription:
    socialInsuranceAdministrationMessage.fileUpload.attachmentDescription,
  uploadButtonLabel:
    socialInsuranceAdministrationMessage.fileUpload.attachmentButton,
  uploadMultiple: true,
}
