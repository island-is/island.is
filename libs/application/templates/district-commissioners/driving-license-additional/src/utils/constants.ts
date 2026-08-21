import { DefaultEvents } from '@island.is/application/types'
import { YesOrNo } from '@island.is/application/core'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.ABORT }

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
  PREREQUISITES = 'prerequisites',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum ApiActions {
  submitApplication = 'submitApplication',
  // Note: the FJS charge is created by the PAYMENT state's `buildPaymentState`
  // (CreateChargeApi), so no separate createCharge action is needed here.
}

export const B_ADVANCED = 'B-advanced'
export const BE = 'BE'
export const DELIVERY_FEE = 'deliveryFee'

// RLS category `validToCode` for a temporary (bráðabirgða) B licence. A holder
// of a temporary licence is not eligible to apply for BE or advanced rights.
export const TEMPORARY_LICENSE_VALIDTO_CODE = 8

export enum LicenseTypes {
  'B_FULL' = 'B-full',
  'B_TEMP' = 'B-temp',
  'BE' = 'BE',
  'B_ADVANCED' = 'B-advanced',
}

export enum Pickup {
  'POST' = 'post',
  'DISTRICT' = 'district',
}

export enum AdvancedLicenseGroupCodes {
  'C1' = 'C1',
  'C' = 'C',
  'D1' = 'D1',
  'D' = 'D',
}

export enum MainAdvancedLicense {
  'C1' = 'C1',
  'D1' = 'D1',
  'C' = 'C',
  'D' = 'D',
  'C1E' = 'C1E',
  'D1E' = 'D1E',
  'CE' = 'CE',
  'DE' = 'DE',
}

export enum ProfessionalAdvancedLicense {
  'C1A' = 'C1A',
  'D1A' = 'D1A',
  'CA' = 'CA',
  'DA' = 'DA',
}

export const AdvancedLicense = {
  ...MainAdvancedLicense,
  ...ProfessionalAdvancedLicense,
} as const

export type AdvancedLicenseMapItem = {
  minAge: number
  group: keyof typeof AdvancedLicenseGroupCodes
  code: keyof typeof MainAdvancedLicense
  professional?: {
    minAge: number
    code: keyof typeof ProfessionalAdvancedLicense
  }
}

export const advancedLicenseMap: AdvancedLicenseMapItem[] = [
  // C1
  {
    code: 'C1',
    group: 'C1',
    minAge: 18,
    professional: {
      code: 'C1A',
      minAge: 18,
    },
  },
  {
    code: 'C1E',
    group: 'C1',
    minAge: 18,
  },

  // C
  {
    code: 'C',
    group: 'C',
    minAge: 21,
    professional: {
      code: 'CA',
      minAge: 21,
    },
  },
  {
    code: 'CE',
    group: 'C',
    minAge: 21,
  },

  // D1
  {
    code: 'D1',
    group: 'D1',
    minAge: 21,
    professional: {
      code: 'D1A',
      minAge: 21,
    },
  },
  {
    code: 'D1E',
    group: 'D1',
    minAge: 21,
  },

  // D
  {
    code: 'D',
    group: 'D',
    minAge: 23,
    professional: {
      code: 'DA',
      minAge: 23,
    },
  },
  {
    code: 'DE',
    group: 'D',
    minAge: 23,
  },
]

export const organizedAdvancedLicenseMap = advancedLicenseMap.reduce<
  Record<string, AdvancedLicenseMapItem[]>
>((acc, item) => {
  if (!acc[item.group]) {
    acc[item.group] = []
  }

  acc[item.group].push(item)

  return acc
}, {})

export type AdvancedLicenseGroup = {
  group: keyof typeof AdvancedLicenseGroupCodes
  codes: Array<keyof typeof AdvancedLicense>
}

export const CHARGE_ITEM_CODES: Record<string, string> = {
  [BE]: 'AY148',
  [DELIVERY_FEE]: 'AY145',
  [B_ADVANCED]: 'AY115',
}

export type DrivingLicenseApplicationFor = typeof BE | typeof B_ADVANCED

type FakeCurrentLicense = 'none' | 'temp' | 'B' | 'BE'

// Fake-photo modes for hasThjodskraPhoto / hasRLSPhoto:
//   'yes'           — inject a fake photo
//   'no'            — inject "no photo" (fake empty)
//   'real'          — fall through to real RLS / Þjóðskrá data (default)
//   'metadata-only' — inject the prod-observed legacy-record shape:
//                     metadata returned, photo binary missing (RLS only)
export type FakePhotoMode = 'yes' | 'no' | 'real' | 'metadata-only'

export interface DrivingLicenseFakeData {
  useFakeData?: YesOrNo
  qualityPhoto?: YesOrNo
  currentLicense?: FakeCurrentLicense
  remarks?: YesOrNo
  howManyDaysHaveYouLivedInIceland: string | number
  age: number
  hasThjodskraPhoto?: FakePhotoMode
  hasRLSPhoto?: FakePhotoMode
  // Advanced categories the applicant already holds (e.g. 'C1', 'CE', 'D').
  advancedCategories?: Array<keyof typeof MainAdvancedLicense>
}
