import { RatioType } from './lib/constants'

export interface CategorizedIncomeTypes {
  categoryCode?: string | null
  categoryName?: string | null
  categoryNumber?: number
  incomeTypeCode?: string | null
  incomeTypeName?: string | null
  incomeTypeNumber?: number
}

export interface WithholdingTax {
  year?: number
  incomeTypes?: Array<WithholdingTaxIncomeType> | null
}

interface WithholdingTaxIncomeType {
  incomeTypeNumber?: number | null
  incomeTypeName?: string | null
  incomeTypeCode?: string | null
  categoryNumber?: number | null
  categoryName?: string | null
  categoryCode?: string | null
  january?: number | null
  february?: number | null
  march?: number | null
  april?: number | null
  may?: number | null
  june?: number | null
  july?: number | null
  august?: number | null
  september?: number | null
  october?: number | null
  november?: number | null
  december?: number | null
  total?: number | null
}

export interface IncomePlanRow {
  incomeType: string
  incomeTypeNumber: number
  incomeTypeCode: string
  currency: string
  incomeCategory: string
  incomeCategoryNumber: number
  incomeCategoryCode: string
  income: RatioType
  equalForeignIncomePerMonth?: string
  equalIncomePerMonth?: string
  incomePerYear: string
  unevenIncomePerYear?: string
  january?: string
  february?: string
  march?: string
  april?: string
  may?: string
  june?: string
  july?: string
  august?: string
  september?: string
  october?: string
  november?: string
  december?: string
}

export interface LatestIncomePlan {
  year: number
  origin: string
  status: string
  incomeTypeLines: IncomeType[]
  registrationDate: string
}

interface IncomeType {
  currency: string
  totalSum: number
  incomeTypeCode: string
  incomeTypeName: string
  incomeTypeNumber: number
  incomeCategoryCode: string
  incomeCategoryName: string
  incomeCategoryNumber: number
}

export interface Eligible {
  isEligible: boolean
  reason: string
  reasonCode: string
}

export interface IncomePlanConditions {
  incomePlanYear: number
  showTemporaryCalculations: boolean
}
