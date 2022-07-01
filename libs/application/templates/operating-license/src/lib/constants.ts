import { DefaultEvents, Option } from '@island.is/application/types'

import { attachmentNames, m } from './messages'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }

export enum States {
  PREREQUISITES = 'prerequistites',
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
}
export enum Roles {
  APPLICANT = 'applicant',
}

export enum ApiActions {
  submitApplication = 'submitApplication',
  createCharge = 'createCharge',
  submitPassportApplication = 'submitPassportApplication',
}

export enum APPLICATION_TYPES {
  HOTEL = 'hotel',
  RESTURANT = 'resturant',
}

export const YES = 'yes'
export const NO = 'no'

export const ResturantTypes: Option[] = [
  { value: 'Veitingahús', label: 'Veitingahús' },
  { value: 'Skemmtistaður', label: 'Skemmtistaður' },
  {
    value: 'Veitingastofa og greiðasala',
    label: 'Veitingastofa og greiðasala',
  },
  {
    value: 'Veisluþjónusta og veitingaverslun',
    label: 'Veisluþjónusta og veitingaverslun',
  },
  { value: 'Kaffihús', label: 'Kaffihús' },
  { value: 'Krá', label: 'Krá' },
  { value: 'Samkomusalir', label: 'Samkomusalir' },
]

export const HotelTypes: Option[] = [
  { value: 'Hótel', label: 'Hótel' },
  {
    value: 'Stærra gistiheimili',
    label: 'Stærra gistiheimili',
  },
  {
    value: 'Minna gistiheimili',
    label: 'Minna gistiheimili',
  },
  { value: 'Gistiskáli', label: 'Gistiskáli' },
  {
    value: 'Fjallaskáli',
    label: 'Fjallaskáli',
  },
  {
    value: 'Heimagisting',
    label: 'Heimagisting',
  },
  { value: 'Íbúðir', label: 'Íbúðir' },
  {
    value: 'Frístundahús',
    label: 'Frístundahús',
  },
]

export enum OPERATION_CATEGORY {
  ONE = '1',
  TWO = '2',
}

export type Operation = {
  operation: APPLICATION_TYPES
  hotel: {
    category: OPERATION_CATEGORY | OPERATION_CATEGORY[] | undefined
    type: string
  }
  resturant: {
    category: OPERATION_CATEGORY | OPERATION_CATEGORY[] | undefined
    type: string
  }
}

export type OpeningHour = {
  from: string
  to: string
}

export type OpeningHours = {
  alcohol: {
    weekdays: OpeningHour
    weekends: OpeningHour
  }
  willServe: string[]
  outside?: {
    weekdays: OpeningHour
    weekends: OpeningHour
  }
}

export const UPLOAD_ACCEPT = '.pdf, .doc, .docx, .rtf, .jpg, .jpeg, .png, .heic'

export type FileSchema = {
  name: string
  key: string
  url: string
}

export type Attachment = {
  id: string
  label: string
}
export type Property = {
  propertyNumber: string
  address: string
  spaceNumber: string
  customerCount: string
}

export const AttachmentProps: Attachment[] = [
  {
    id: 'attachments.healthLicense.file',
    label: attachmentNames.one.defaultMessage,
  },
  {
    id: 'attachments.formerLicenseHolderConfirmation.file',
    label: attachmentNames.two.defaultMessage,
  },
  {
    id: 'attachments.houseBlueprints.file',
    label: attachmentNames.three.defaultMessage,
  },
  {
    id: 'attachments.outsideBlueprints.file',
    label: attachmentNames.four.defaultMessage,
  },
]
