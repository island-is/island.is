import {
  DefaultEvents,
  GenericFormField,
  Option,
} from '@island.is/application/types'

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
  submitOperatingLicenseApplication = 'submitOperatingLicenseApplication',
}

export enum ApplicationTypes {
  HOTEL = 'hotel',
  RESTURANT = 'resturant',
}

export enum OperationCategory {
  TWO = '2',
  THREE = '3',
  FOUR = '4',
}

export const ResturantTypes: Option[] = [
  {
    value: 'A Veitingahús',
    label: 'Veitingahús',
    subLabel:
      'Veitingastaður með fjölbreyttar veitingar í mat og drykk og fulla þjónustu. Í veitingahúsi skal vera starfandi maður með fullnægjandi þekkingu í framreiðslu.',
  },
  {
    value: 'B Skemmtistaður',
    label: 'Skemmtistaður',
    subLabel:
      'Veitingastaður með reglubundna skemmtistarfsemi og fjölbreyttar veitingar í mat og/eða drykk. Hér undir falla einnig staðir þar sem aðaláhersla er lögð á áfengisveitingar, dans gesta, tónlist og langan afgreiðslutíma en engar eða takmarkaðar veitingar í mat.',
  },
  {
    value: 'C Veitingastofa og greiðasala',
    label: 'Veitingastofa og greiðasala',
    subLabel:
      'Veitingastaðir með fábreyttar veitingar í mat og/eða drykk. Á slíkum stöðum er takmarkaðri þjónusta og/eða gestir afgreiða sig sjálfir að hluta eða öllu leyti. Hér undir falla t.d. skyndibitastaðir og einnig söluskálar með aðstöðu til neyslu veitinga.',
  },
  {
    value: 'D Veisluþjónusta og veitingaverslun',
    label: 'Veisluþjónusta og veitingaverslun',
    subLabel:
      'Staðir þar sem fram fer sala veitinga sem ekki er til neyslu á staðnum enda er slík sala meginstarfsemi staðarins.',
  },
  {
    value: 'E Kaffihús',
    label: 'Kaffihús',
    subLabel:
      'Veitingastaður með einfaldar veitingar í mat og/eða drykk þar sem aðaláhersla er lögð á kaffiveitingar. Hér undir falla t.d. bakarí sem hafa aðstöðu til neyslu veitinga á staðnum.',
  },
  {
    value: 'F Krá',
    label: 'Krá',
    subLabel:
      'Veitingastaður með takmarkaða þjónustu og einfaldar eða engar veitingar í mat, þar sem aðaláhersla er lögð á áfengisveitingar og langan afgreiðslutíma.',
  },
  {
    value: 'G Samkomusalir',
    label: 'Samkomusalir',
    subLabel:
      'Staðir sem eru sérstaklega útbúnir og ætlaðir til hvers kyns samkomuhalds og til þess leigðir út í atvinnuskyni til einstaklinga og/eða fyrirtækja, hvort sem er með eða án veitinga í mat og/eða drykk. Félagsheimili, íþróttasalir, flugskýli, vöruskemmur og önnur húsakynni sem að jafnaði eru ekki ætluð til samkomuhalds í atvinnuskyni geta fallið hér undir ef útleiga til skemmtanahalds fer oftar fram en tólf sinnum á ári.',
  },
]

export const HotelTypes: Option[] = [
  {
    value: 'B Stærra gistiheimili',
    label: 'Stærra gistiheimili',
    subLabel:
      'Gististaður með takmarkaða þjónustu þar sem leigð eru út 6 herbergi eða fleiri eða rými fyrir fleiri en 10 einstaklinga. Handlaug skal vera í hverju herbergi og salerni nærliggjandi en gestir þurfa einnig að hafa aðgang að fullbúinni baðaðstöðu.',
  },
  {
    value: 'C Minna gistiheimili',
    label: 'Minna gistiheimili',
    subLabel:
      'Gististaður með takmarkaða þjónustu þar sem leigð eru út 5 eða færri herbergi eða hefur rými fyrir 10 einstaklinga eða færri. Getur verið gisting á einkaheimili. Ekki er gerð krafa um handlaug í herbergjum. Gestir skulu hafa aðgang að fullbúinni baðaðstöðu.',
  },
  {
    value: 'D Gistiskáli',
    label: 'Gistiskáli',
    subLabel:
      'Gisting í herbergjum eða svefnskálum. Hér undir falla farfuglaheimili (hostel).',
  },
  {
    value: 'E Fjallaskáli',
    label: 'Fjallaskáli',
    subLabel:
      'Gisting í herbergjum eða í svefnskálum staðsett utan alfaraleiðar og almenningur hefur aðgang að, svo sem skálar fyrir ferðamenn, veiðiskálar og sæluhús.',
  },
  {
    value: 'G Íbúðir',
    label: 'Íbúðir',
    subLabel:
      'Íbúðarhúsnæði sérstaklega ætlað til útleigu til gesta til skamms tíma, sbr. 2. gr. reglugerðar þessarar og fellur ekki undir húsaleigulög. Hér undir falla starfsmannabústaðir og starfsmannabúðir þegar slíkar byggingar eru ekki leigðar út í tengslum við vinnusamning. Íbúðir félagasamtaka eru undanskildar.',
  },
  {
    value: 'H Frístundahús',
    label: 'Frístundahús',
    subLabel:
      'Hús utan þéttbýlis sem er nýtt til tímabundinnar dvalar. Orlofshús félagasamtaka, svo sem stéttarfélaga og starfsgreinafélaga, eru undanskilin.',
  },
]

export const HotelCategories: Option[] = [
  {
    value: OperationCategory.TWO,
    label: m.operationCategoryTwo,
    subLabel: m.operationCategoryHotelTwo.defaultMessage,
  },
  {
    value: OperationCategory.THREE,
    label: m.operationCategoryThree,
    subLabel: m.operationCategoryHotelThree.defaultMessage,
  },
  {
    value: OperationCategory.FOUR,
    label: m.operationCategoryFour,
    subLabel: m.operationCategoryHotelFour.defaultMessage,
  },
]

export const ResturantCategories: Option[] = [
  {
    value: OperationCategory.TWO,
    label: m.operationCategoryTwo,
    subLabel: m.operationCategoryResturantTwo.defaultMessage,
  },
  {
    value: OperationCategory.THREE,
    label: m.operationCategoryThree,
    subLabel: m.operationCategoryResturantThree.defaultMessage,
  },
]

export type Operation = {
  operation: ApplicationTypes
  category: OperationCategory | OperationCategory[] | undefined
  typeHotel?: string
  typeResturant?: string[]
  willServe?: string
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

export type PropertyField = GenericFormField<Property>

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
  {
    id: 'attachments.otherFiles.file',
    label: attachmentNames.five.defaultMessage,
  },
]
