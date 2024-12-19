import { DefaultEvents, FormValue } from '@island.is/application/types'
import { m } from './messages'

export enum License {
  B_FULL = 'B-full',
  B_TEMP = 'B-temp',
  B_FULL_RENEWAL_65 = 'B-full-renewal-65',
  B_ADVANCED = 'B-advanced',
  BE = 'BE',
}

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.ABORT }

export enum Roles {
  APPLICANT = 'applicant',
}

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
  DECLINED = 'declined',
  PREREQUISITES = 'prerequisites',
}

export enum ApiActions {
  submitApplication = 'submitApplication',
  createCharge = 'createCharge',
}

export enum Pickup {
  'POST' = 'post',
  'DISTRICT' = 'district',
}

export interface DrivingLicenseFormConfig {
  allowFakeData?: boolean
  allowPickLicense?: boolean
  allowBELicense?: boolean
  allow65Renewal?: boolean
  allowAdvanced?: boolean
}

export type ConditionFn = (answer: FormValue) => boolean

export const healthDeclarationQuestions = [
  {
    id: 'healthDeclaration.usesContactGlasses',
    label: m.healthDeclaration1,
  },
  {
    id: 'healthDeclaration.hasReducedPeripheralVision',
    label: m.healthDeclaration2,
  },
  {
    id: 'healthDeclaration.hasEpilepsy',
    label: m.healthDeclaration3,
  },
  {
    id: 'healthDeclaration.hasHeartDisease',
    label: m.healthDeclaration4,
  },
  {
    id: 'healthDeclaration.hasMentalIllness',
    label: m.healthDeclaration5,
  },
  {
    id: 'healthDeclaration.usesMedicalDrugs',
    label: m.healthDeclaration6,
  },
  {
    id: 'healthDeclaration.isAlcoholic',
    label: m.healthDeclaration7,
  },
  {
    id: 'healthDeclaration.hasDiabetes',
    label: m.healthDeclaration8,
  },
  {
    id: 'healthDeclaration.isDisabled',
    label: m.healthDeclaration9,
  },
  {
    id: 'healthDeclaration.hasOtherDiseases',
    label: m.healthDeclaration10,
  },
]

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

type AdvancedLicenseMapItem = {
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

export const DELIVERY_FEE = 'deliveryFee'

export const CHARGE_ITEM_CODES: Record<string, string> = {
  [License.B_TEMP]: 'AY114',
  [License.B_FULL]: 'AY110',
  [License.B_FULL_RENEWAL_65]: 'AY113',
  [License.BE]: 'AY115',
  [DELIVERY_FEE]: 'AY145',
}

export const otherLicenseCategories = ['C', 'C1', 'CE', 'D', 'D1', 'DE']
export const codesRequiringHealthCertificate = ['400', '01.06']
export const codesExtendedLicenseCategories = [
  'C1',
  'C1E',
  'C',
  'CE',
  'D1',
  'D1E',
  'D',
  'DE',
  'Bfar',
  'Far',
  'FAR',
]
export const remarksCannotRenew65 = ['400', '450', '95']

export type DrivingLicense = {
  currentLicense: string | null
  remarks?: {
    code: string
    description: string
  }[]
  categories: {
    nr: string
    validToCode: number
    issued?: string
  }[]
}
export interface DrivingLicenseFakeData {
  useFakeData?: 'yes' | 'no'
  qualityPhoto?: 'yes' | 'no'
  remarks?: 'yes' | 'no'
  currentLicense?: 'none' | 'temp' | 'full' | 'BE'
  howManyDaysHaveYouLivedInIceland: string | number
  age: number
}
