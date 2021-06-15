export const PAYMENT_CONFIG = 'PAYMENT_CONFIG'

export interface PaymentConfig {
  url?: string
  username?: string
  password?: string
  callbackBaseUrl?: string
  callbackAdditionUrl?: string
  arkBaseUrl: string
}

export interface PaymentServiceOptions {
  url: string
  username: string
  password: string
  callbackBaseUrl: string
  callbackAdditionUrl: string
  arkBaseUrl: string
}
