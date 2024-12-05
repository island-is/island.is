export enum PaymentMethod {
  CARD = 'card',
  INVOICE = 'invoice',
}

export type PaymentInformation = {
  id: string
  productIds: string[]
  // If null then the name of the first product id will be used (fetched from FJS)
  productTitle?: string
  availablePaymentMethods: PaymentMethod[]
  onSuccessUrl: string
  onUpdateUrl?: string
  onErrorUrl: string
  // To display which organization the payment is for
  organisationId: string
  // If the payment is connected to a specific invoice it can be included
  // here and it will be passed along with the onSucces callback
  invoiceId?: string
}
