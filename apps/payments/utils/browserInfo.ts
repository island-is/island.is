import { PaymentsVerifyCardBrowserInfoInput } from '@island.is/api/schema'

/**
 * Collects the payer's browser environment for EMV 3-D Secure authentication.
 * These fields are forwarded (together with server-derived connection
 * information) to the card gateway as the browser data of the authentication
 * request. Only values observable by the page are collected; nothing here
 * identifies the payer beyond what every HTTP request already exposes.
 */
export const getBrowserInfo = ():
  | PaymentsVerifyCardBrowserInfoInput
  | undefined => {
  if (typeof window === 'undefined' || !window.screen) {
    return undefined
  }

  return {
    screenHeight: window.screen.height,
    screenWidth: window.screen.width,
    colorDepth: window.screen.colorDepth,
    timeZoneOffset: new Date().getTimezoneOffset(),
    language: navigator.language,
    // navigator.javaEnabled() is deprecated and returns false in all modern
    // browsers; report false when it is unavailable.
    javaEnabled:
      typeof navigator.javaEnabled === 'function'
        ? navigator.javaEnabled()
        : false,
  }
}
