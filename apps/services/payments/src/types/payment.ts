export type PaymentMethod = 'card' | 'invoice'

export type PaymentInformation = {
  productId: string
  availablePaymentMethods: PaymentMethod[]
  callbacks: {
    onSuccess: string
    onError: string
  }
  // To display which organization the payment is for
  organizationId?: string
  // If the payment is connected to a specific invoice it can be included
  // here and it will be passed along with the onSucces callback
  invoiceId?: string
}
