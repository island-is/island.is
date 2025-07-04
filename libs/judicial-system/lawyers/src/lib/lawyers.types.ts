export type Lawyer = {
  name: string
  nationalId: string
  email: string
  phoneNumber: string
  practice: string
  isLitigator: boolean
}

export enum LawyerType {
  LITIGATORS = 'LITIGATORS',
}
