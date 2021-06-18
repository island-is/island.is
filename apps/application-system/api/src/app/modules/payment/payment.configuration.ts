export const PAYMENT_CONFIG = 'PAYMENT_CONFIG'

// TODO: Why two of these?
export interface PaymentConfig {
  xRoadPath: string
  xRoadClientId: string
  username?: string
  password?: string
  callbackBaseUrl?: string
  callbackAdditionUrl?: string
  arkBaseUrl: string
}

export interface PaymentServiceOptions {
  xRoadPath: string
  xRoadClientId: string
  username: string
  password: string
  callbackBaseUrl: string
  callbackAdditionUrl: string
  arkBaseUrl: string
}
