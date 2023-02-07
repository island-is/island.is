import type { DistributiveOmit } from '@island.is/shared/types'

import { YES, NO, ParentalRelations } from './constants'

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

export type YesOrNo = typeof NO | typeof YES

export interface Files {
  name: string
  key: string
}

export interface VMSTPeriod {
  from: string
  to: string
  ratio: string
  firstPeriodStart: string
  paid: boolean
  rightsCodePeriod: string
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
}

export type ChildInformation =
  | (BaseChildInformation & {
      parentalRelation: ParentalRelations.secondary
      primaryParentNationalRegistryId: string
    })
  | (BaseChildInformation & {
      parentalRelation: ParentalRelations.primary
    })

export interface ExistingChildApplication {
  expectedDateOfBirth: string
  applicationId: string
}

export interface PregnancyStatus {
  hasActivePregnancy: boolean
  expectedDateOfBirth: string
}

export interface ChildrenAndExistingApplications {
  children: ChildInformation[]
  existingApplications: ExistingChildApplication[]
}

// Has rights and remaining rights is calculated at the end
// of the data provider. This is to be able to use
// the same type until the end when we calculate the missing fields

export type ChildInformationWithoutRights = DistributiveOmit<
  ChildInformation,
  'hasRights' | 'remainingDays'
>

export type ChildrenWithoutRightsAndExistingApplications = Pick<
  ChildrenAndExistingApplications,
  'existingApplications'
> & {
  children: ChildInformationWithoutRights[]
}

export interface PregnancyStatusAndRightsResults {
  childrenAndExistingApplications: ChildrenAndExistingApplications
  remainingDays: number
  hasRights: boolean
  hasActivePregnancy: boolean
}
