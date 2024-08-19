import { RatioType } from './lib/constants'

export interface categorizedIncomeTypes {
  categoryCode?: string | null
  categoryName?: string | null
  categoryNumber?: number
  incomeTypeCode?: string | null
  incomeTypeName?: string | null
  incomeTypeNumber?: number
}

export interface withholdingTax {
  year?: number
  incomeTypes?: Array<withholdingTaxIncomeType> | null
}

interface withholdingTaxIncomeType {
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

export interface incomePlanRow {
  incomeCategories: string
  incomeTypes: string
  currency: string
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

export interface latestIncomePlan {
  year: string
  origin: string
  status: string
  incomeTypeLines: incomeType[]
  registrationDate: string
}

interface incomeType {
  currency: string
  totalSum: number
  incomeTypeCode: string
  incomeTypeName: string
  incomeTypeNumber: number
  incomeCategoryCode: string
  incomeCategoryName: string
  incomeCategoryNumber: number
}
