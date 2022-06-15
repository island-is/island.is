import { DefaultEvents, Option } from '@island.is/application/core'
import { m } from './messages'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }

export enum States {
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

export enum OPERATION_TYPES {
  HOTEL = 'hotel',
  RESTURANT = 'resturant',
}

export const YES = 'yes'
export const NO = 'no'

export const ResturantTypes: Option[] = [
  { value: 'Veitingahús', label: 'Veitingahús', tooltip: 'HALLLSS' },
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
  { value: 'Hótel', label: 'Hótel', tooltip: m.hotelTypeHotel },
  {
    value: 'Stærra gistiheimili',
    label: 'Stærra gistiheimili',
    tooltip: m.hotelTypeBiggerHostel,
  },
  {
    value: 'Minna gistiheimili',
    label: 'Minna gistiheimili',
    tooltip: m.hotelTypeSmallerHostel,
  },
  { value: 'Gistiskáli', label: 'Gistiskáli', tooltip: m.hotelTypeGuesthouse },
  {
    value: 'Fjallaskáli',
    label: 'Fjallaskáli',
    tooltip: m.hotelTypeMountainResort,
  },
  {
    value: 'Heimagisting',
    label: 'Heimagisting',
    tooltip: m.hotelTypeHomestay,
  },
  { value: 'Íbúðir', label: 'Íbúðir', tooltip: m.hotelTypeFlats },
  {
    value: 'Frístundahús',
    label: 'Frístundahús',
    tooltip: m.hotelTypeHolidayHome,
  },
]
