import type { DistributiveOmit } from '@island.is/shared/types'
import { MessageDescriptor } from 'react-intl'
import { ParentalRelations } from './constants'
import { YesOrNo } from '@island.is/application/core'

export interface MultipleBirths {
  hasMultipleBirths: YesOrNo
  multipleBirths?: number
}

export interface RequestRightsObj {
  isRequestingRights: YesOrNo
  requestDays: number
}

export interface GiveRightsObj {
  isGivingRights: YesOrNo
  requestDays: number
}

export interface PersonInformation {
  fullName: string
  genderCode: string
  children: {
    nationalId: string
    fullName: string
    otherParent: {
      nationalId: string
    }
  }[]
  spouse?: {
    nationalId?: string
    name?: string
  }
}

export interface Files {
  name: string
  key: string
}

export interface Attachments {
  attachments: Files[]
  label: MessageDescriptor
}

export interface FileUpload {
  selfEmployedFile?: Files[]
  studentFile?: Files[]
  benefitsFile?: Files[]
  singleParent?: Files[]
  parentWithoutBirthParent?: Files[]
  permanentFosterCare?: Files[]
  adoption?: Files[]
  employmentTerminationCertificateFile?: Files[]
  file?: Files[]
  changeEmployerFile?: Files[]
}

export interface VMSTPeriod {
  from: string
  to: string
  ratio: string
  firstPeriodStart: string
  paid: boolean
  rightsCodePeriod: string
  days: string
  approved: boolean
}

export interface VMSTOtherParent {
  otherParentId: string | null
  otherParentName: string | null
}

export interface Period {
  startDate: string
  endDate: string
  ratio: string
  firstPeriodStart?: string
  useLength?: YesOrNo
  daysToUse?: string
  rawIndex?: number
  rightCodePeriod?: string
  paid?: boolean
  approved?: boolean
  months?: number
  endDateAdjustLength?: string[]
}

export interface Payment {
  date: string
  taxAmount: number
  pensionAmount: number
  estimatedAmount: number
  privatePensionAmount: number
  unionAmount: number
  estimatePayment: number
  period: {
    from: string
    to: string
    ratio: number
    approved: boolean
    paid: boolean
  }
}

export interface Payments {
  bank: string
  pensionFund: string
  privatePensionFund: string
  privatePensionFundPercentage: string
  union: string
}

export interface OtherParentObj {
  chooseOtherParent: string
  otherParentName?: string
  otherParentId: string
}

interface BaseChildInformation {
  expectedDateOfBirth: string
  hasRights: boolean
  remainingDays: number
  /**
   * Will be a negative number if other parent requested to use your days
   * Will be a positive number if other parent requested to transfer days to you
   * Will be undefined if transferal was not requested
   */
  transferredDays?: number
  multipleBirthsDays?: number
  adoptionDate?: string
  dateOfBirth?: string
}

export type ChildInformation =
  | (BaseChildInformation & {
      parentalRelation: ParentalRelations.secondary
      primaryParentNationalRegistryId: string
      primaryParentGenderCode?: string
      primaryParentTypeOfApplication?: string
    })
  | (BaseChildInformation & {
      parentalRelation: ParentalRelations.primary
    })

export interface ExistingChildApplication {
  expectedDateOfBirth: string
  applicationId: string
  adoptionDate?: string
}

export interface PregnancyStatus {
  hasActivePregnancy: boolean
  expectedDateOfBirth: string
}

// Has rights and remaining rights is calculated at the end
// of the data provider. This is to be able to use
// the same type until the end when we calculate the missing fields

export type ChildInformationWithoutRights = DistributiveOmit<
  ChildInformation,
  'hasRights' | 'remainingDays'
>

export interface PregnancyStatusAndRightsResults {
  children: ChildInformation
  remainingDays: number
  hasRights: boolean
  hasActivePregnancy: boolean
}

export interface EmployerRow {
  email: string
  phoneNumber?: string
  ratio: string
  isApproved?: boolean
  reviewerNationalRegistryId?: string
  companyNationalRegistryId?: string
  stillEmployed?: YesOrNo
}

export type SelectOption = {
  label: string
  value: string
}
