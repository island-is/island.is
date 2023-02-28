export interface WageDeductionResponse {
  wagesDeduction: Employer
}

export interface Employer {
  employerNationalId: string
  employerName: string
}

export interface EmployerIsValidResponse {
  employerNationalId: string
  employerName: string
  isEmployerValid: string
}
