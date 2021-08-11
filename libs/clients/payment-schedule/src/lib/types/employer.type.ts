export interface WageDeductionResponse {
  wagesDeduction: Employer
}

export interface Employer {
  employerNationalId: string
  employerName: string
}
