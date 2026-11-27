/**
 * Apple Pay validation URL hosts - strict allowlist per Apple's documentation.
 * @see https://developer.apple.com/documentation/apple_pay_on_the_web/setting_up_your_server
 */
export const APPLE_PAY_ALLOWED_VALIDATION_HOSTS = [
  'apple-pay-gateway.apple.com', // Production (Global)
  'apple-pay-gateway-cert.apple.com', // Sandbox (Global)
] as const
