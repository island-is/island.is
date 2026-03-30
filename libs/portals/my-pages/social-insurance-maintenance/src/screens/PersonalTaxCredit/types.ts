import { SocialInsuranceTaxCardAllowanceAction } from '@island.is/api/schema'
import type { SetSocialInsuranceSpouseTaxCardDueToDeathMutationVariables } from './PersonalTaxCredit.generated'

type SpouseTaxCardDueToDeathInput =
  SetSocialInsuranceSpouseTaxCardDueToDeathMutationVariables['input']

export type RegisterData = {
  year: number | null
  month: number | null
  percentage: string
}

export type EditData = {
  percentage: string
}

export type DiscontinueData = {
  year: number | null
  month: number | null
}

export type MyTaxCreditState =
  | {
      action: SocialInsuranceTaxCardAllowanceAction.REGISTER
      data: RegisterData
    }
  | { action: SocialInsuranceTaxCardAllowanceAction.EDIT; data: EditData }
  | {
      action: SocialInsuranceTaxCardAllowanceAction.DISCONTINUE
      data: DiscontinueData
    }
  | { action: null }

export type SpouseState = {
  deceased: boolean
  grant: boolean
  year: NonNullable<SpouseTaxCardDueToDeathInput['year']> | null
  month: NonNullable<SpouseTaxCardDueToDeathInput['month']> | null
  percentage: string
}
