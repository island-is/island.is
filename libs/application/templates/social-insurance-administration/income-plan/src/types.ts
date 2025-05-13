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
