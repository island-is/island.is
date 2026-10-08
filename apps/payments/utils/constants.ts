import { Locale } from './localisation'

export const ALLOWED_LOCALES: Locale[] = [Locale.IS, Locale.EN]

// postMessage type the 3DS result page (inside the 3DS iframe) uses to tell the
// payment page how verification ended, so it can stop waiting on failure.
export const THREE_DS_RESULT_MESSAGE_TYPE = 'payments:3ds-result'
