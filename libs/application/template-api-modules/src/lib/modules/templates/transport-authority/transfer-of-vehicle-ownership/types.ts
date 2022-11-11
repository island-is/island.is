export enum EmailRole {
  seller,
  sellerCoOwner,
  buyer,
  buyerCoOwner,
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
