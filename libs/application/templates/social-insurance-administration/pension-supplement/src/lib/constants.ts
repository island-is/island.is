import { MessageDescriptor } from 'react-intl'
import { pensionSupplementFormMessage } from './messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

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
    socialInsuranceAdministrationMessage.confirm.additionalDocumentsAttachment,
}

export enum AttachmentTypes {
  ASSISTED_CARE_AT_HOME = 'assistedCareAtHome',
  MEDICINE_COST = 'medicineCost',
  HOUSE_RENT = 'houseRent',
  ASSISTED_LIVING = 'assistedLiving',
  PURCHASE_OF_HEARING_AIDS = 'purchaseOfHearingAids',
  OXYGEN_FILTER_COST = 'oxygenFilterCost',
  HALFWAY_HOUSE = 'halfwayHouse',
  ADDITIONAL_DOCUMENTS = 'additionalDocuments',
}
