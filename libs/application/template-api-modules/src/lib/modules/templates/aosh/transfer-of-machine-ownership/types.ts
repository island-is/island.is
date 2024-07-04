export enum EmailRole {
  seller,
  buyer,
  buyerOperator,
}

export interface EmailRecipient {
  ssn: string
  name: string
  email?: string
  phone?: string
  role: EmailRole
  approved?: boolean
}
