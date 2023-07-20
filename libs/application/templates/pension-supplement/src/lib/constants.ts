import { DefaultEvents } from '@island.is/application/types'
import { MessageDescriptor } from 'react-intl'
import { pensionSupplementFormMessage } from './messages'

export const YES = 'yes'
export const NO = 'no'

export const FILE_SIZE_LIMIT = 5000000 // 5MB

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }

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

export const AttachmentLabel: {
  [key: string]: MessageDescriptor
} = {
  assistedCareAtHome: pensionSupplementFormMessage.fileUpload.assistedCareAtHomeTitle,
  additionalDocuments:
    pensionSupplementFormMessage.confirm.additionalDocumentsAttachment,
}
