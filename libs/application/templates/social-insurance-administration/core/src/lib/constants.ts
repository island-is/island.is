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

  NOT_ELIGIBLE = 'notEligible',

  DRAFT = 'draft',

  TRYGGINGASTOFNUN_SUBMITTED = 'tryggingastofnunSubmitted', // NYSKRAD = 91
  TRYGGINGASTOFNUN_IN_REVIEW = 'tryggingastofnunInReview', // I_VINNSLU = 562

  ADDITIONAL_DOCUMENTS_REQUIRED = 'additionalDocumentsRequired', // I_BID_GOGN_VANTAR = 1617

  DISMISSED = 'dismissed', // VÍSAÐ FRÁ
  REJECTED = 'rejected', // SYNJAD = 1281
  APPROVED = 'approved', // AFGREIDD = 563
  COMPLETED = 'completed',
}

export enum OAPEvents {
  ADDITIONALDOCUMENTSREQUIRED = 'ADDITIONALDOCUMENTSREQUIRED',
  INREVIEW = 'INREVIEW',
  PENDING = 'PENDING',
  DISMISS = 'DISMISS',
}

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: OAPEvents.ADDITIONALDOCUMENTSREQUIRED } // Ex: TR ask for more documents
  | { type: OAPEvents.INREVIEW } // Ex: TR's employee start review application
  | { type: OAPEvents.DISMISS } // EX: TR's employee dismisses the application
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
  uploadAccept: '.pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png',
  uploadHeader:
    socialInsuranceAdministrationMessage.fileUpload.attachmentHeader,
  uploadDescription:
    socialInsuranceAdministrationMessage.fileUpload.attachmentDescription,
  uploadButtonLabel:
    socialInsuranceAdministrationMessage.fileUpload.attachmentButton,
  uploadMultiple: true,
}

const married = 'Gift/ur'

export const maritalStatuses: {
  [key: string]: string
} = {
  '1': 'Ógift/ur',
  '3': married,
  '4': 'Ekkja/Ekkill',
  '5': 'Skilin/nn/ð að borði og sæng',
  '6': 'Fráskilin/nn/ð',
  '7': married,
  '8': married,
  '9': 'Óupplýst',
  '0': married,
  L: married,
}

export const FOREIGN_BASIC_PENSION = 'Erlendur grunnlífeyrir'
export const FOREIGN_PENSION = 'Erlendur lífeyrir'
export const FOREIGN_INCOME = 'Erlendar tekjur'
export const INTEREST_ON_DEPOSITS_IN_FOREIGN_BANKS =
  'Vextir af innstæðum í erlendum bönkum'
export const DIVIDENDS_IN_FOREIGN_BANKS =
  'Arður af hlutabréfa eign í erlendum bönkum'
export const ISK = 'IKR'
export const INCOME = 'Atvinnutekjur'

export enum RatioType {
  YEARLY = 'yearly',
  MONTHLY = 'monthly',
}

export const defaultIncomeTypes = [
  {
    income: 'yearly',
    currency: 'IKR',
    incomeType: 'Lífeyrissjóður',
    incomePerYear: '0',
    incomeCategory: 'Lífeyrissjóðstekjur',
  },
  {
    income: 'yearly',
    currency: 'IKR',
    incomeType: 'Laun',
    incomePerYear: '0',
    incomeCategory: 'Atvinnutekjur',
  },
  {
    income: 'yearly',
    currency: 'IKR',
    incomeType: 'Vextir af innistæðum',
    incomePerYear: '0',
    incomeCategory: 'Fjármagnstekjur',
  },
  {
    income: 'yearly',
    currency: 'EUR',
    incomeType: 'Erlendur lífeyrir',
    incomePerYear: '0',
    incomeCategory: 'Lífeyrissjóðstekjur',
  },
  {
    income: 'yearly',
    currency: 'IKR',
    incomeType: 'Vextir af verðbréfum',
    incomePerYear: '0',
    incomeCategory: 'Fjármagnstekjur',
  },
]
