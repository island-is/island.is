import { FileType } from '@island.is/application/templates/social-insurance-administration-core/types'

export interface PensionSupplementAttachments {
  assistedCareAtHome?: FileType[]
  additionalDocuments?: FileType[]
  houseRentAgreement?: FileType[]
  houseRentAllowance?: FileType[]
  assistedLiving?: FileType[]
  purchaseOfHearingAids?: FileType[]
  halfwayHouse?: FileType[]
}
