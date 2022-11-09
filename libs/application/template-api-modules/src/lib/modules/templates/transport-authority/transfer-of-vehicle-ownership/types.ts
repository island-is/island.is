export interface EmailRecipient {
  ssn: string
  name: string
  email?: string
  phone?: string
  role: 'seller' | 'sellerCoOwner' | 'buyer' | 'buyerCoOwner' | 'buyerOperator'
}
