import { MessageDescriptor } from "react-intl"

export interface FileType {
  key: string
  name: string
}

export interface FileUpload {
  leaseAgreement?: FileType[]
  schoolConfirmation?: FileType[]
}

export interface Attachments {
  attachments: FileType[]
  label: MessageDescriptor
}

export interface AdditionalInformation {
  additionalDocuments?: FileType[]
  additionalDocumentsRequired?: FileType[]
}
