export interface DirectTaxPaymentDto {
  remark?: string
  payerNationalId?: string
  paymentCode?: number
  totalSalary?: TotalSalary
  spouseTotalSalary?: TotalSalary
  salaryBreakdown?: SalaryBreakdown[]
  success: boolean
  timeStamp?: string
  errorText?: string
}

interface TotalSalary {
  transactionDate: string
  category: string
  isat: number
  monthsFromTo: string
  receiptDate: string
  transactionNumber: number
  calculatedSalary: number
  spouseCalculatedSalary: number
  salaryWithheldAtSource: number
  year: number
}

interface SalaryBreakdown {
  privatePensionSavings: number
  year: number
  carBenefits?: string
  dailyAllowance: number
  breakdownDate: string
  transactionDate: string
  isat: string
  pensionSavingDeduction: number
  basicSalary: number
  salaryTotal: number
  payerNationalId: number
  carAllowance: number
  personalAllowance: number
  spousePersonalAllowance: number
  salaryWithheldAtSource: number
  workingPercentage: number
  period: number
}
