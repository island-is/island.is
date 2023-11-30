import { DefaultEvents } from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'
import { pensionSupplementFormMessage } from './messages'

export const YES = 'yes'
export const NO = 'no'

export const FILE_SIZE_LIMIT = 5000000 // 5MB

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: 'ADDITIONALDOCUMENTSREQUIRED' } // Ex: TR ask for more documents

export enum Roles {
  APPLICANT = 'applicant',
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  DONE = 'done',

  TRYGGINGASTOFNUN_SUBMITTED = 'tryggingastofnunSubmitted',
  TRYGGINGASTOFNUN_IN_REVIEW = 'tryggingastofnunInReview',

  ADDITIONAL_DOCUMENTS_REQUIRED = 'additionalDocumentsRequired',

  REJECTED = 'rejected',
  APPROVED = 'approved',
}

export enum ApplicationReason {
  MEDICINE_COST = 'medicineCost', // Lyfja- eða sjúkrahjálp
  HOUSE_RENT = 'houseRent', // Húsaleiga sem fellur utan húsaleigubóta frá sveitafélagi
  ASSISTED_CARE_AT_HOME = 'assistedCareAtHome', // Umönnun í heimahúsi
  ASSISTED_LIVING = 'assistedLiving', // Dvöl á sambýli eða áfangaheimili
  PURCHASE_OF_HEARING_AIDS = 'purchaseOfHearingAids', // Kaup á heyrnartækjum
  OXYGEN_FILTER_COST = 'oxygenFilterCost', // Rafmagn á súrefnissíu
  HALFWAY_HOUSE = 'halfwayHouse', // Dvöl á áfangaheimili
}

export enum AnswerValidationConstants {
  FILEUPLOAD = 'fileUpload',
}

export const AttachmentLabel: {
  [key: string]: MessageDescriptor
} = {
  assistedCareAtHome:
    pensionSupplementFormMessage.fileUpload.assistedCareAtHomeTitle,
  houseRent: pensionSupplementFormMessage.fileUpload.houseRentTitle,
  assistedLiving: pensionSupplementFormMessage.fileUpload.assistedLivingTitle,
  purchaseOfHearingAids:
    pensionSupplementFormMessage.fileUpload.purchaseOfHearingAidsTitle,
  halfwayHouse: pensionSupplementFormMessage.fileUpload.halfwayHouseTitle,
  additionalDocuments:
    pensionSupplementFormMessage.fileUpload.additionalFileTitle,
}

export const MONTHS = [
  { value: 'January', label: pensionSupplementFormMessage.months.january },
  { value: 'February', label: pensionSupplementFormMessage.months.february },
  { value: 'March', label: pensionSupplementFormMessage.months.march },
  { value: 'April', label: pensionSupplementFormMessage.months.april },
  { value: 'May', label: pensionSupplementFormMessage.months.may },
  { value: 'June', label: pensionSupplementFormMessage.months.june },
  { value: 'July', label: pensionSupplementFormMessage.months.july },
  { value: 'August', label: pensionSupplementFormMessage.months.august },
  {
    value: 'September',
    label: pensionSupplementFormMessage.months.september,
  },
  { value: 'October', label: pensionSupplementFormMessage.months.october },
  { value: 'November', label: pensionSupplementFormMessage.months.november },
  { value: 'December', label: pensionSupplementFormMessage.months.desember },
]

export enum BankAccountType {
  ICELANDIC = 'icelandic',
  FOREIGN = 'foreign',
}
