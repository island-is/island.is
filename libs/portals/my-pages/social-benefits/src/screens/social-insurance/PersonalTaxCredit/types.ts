import type { SetSocialInsuranceSpouseTaxCardDueToDeathMutationVariables } from './PersonalTaxCredit.generated'

type SpouseTaxCardDueToDeathInput =
  SetSocialInsuranceSpouseTaxCardDueToDeathMutationVariables['input']

export type MyTaxCreditState =
  | {
      action: 'register'
      data: { year: number | null; month: number | null; percentage: string }
    }
  | { action: 'update'; data: { percentage: string } }
  | {
      action: 'discontinue'
      data: { year: number | null; month: number | null }
    }
  | { action: null }

export type SpouseState = {
  deceased: boolean
  grant: boolean
  year: NonNullable<SpouseTaxCardDueToDeathInput['year']> | null
  month: NonNullable<SpouseTaxCardDueToDeathInput['month']> | null
  percentage: string
}
