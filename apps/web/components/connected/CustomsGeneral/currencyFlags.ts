/**
 * Currency flags are drawn from a single sprite (`/assets/currency-flags.png`)
 * that stacks 32x32 flags vertically, one per currency, in the order below.
 *
 * To add a currency, append its flag to the bottom of the sprite image and add
 * the code here. Currencies without an entry (e.g. XDR, which has no country)
 * simply render no flag.
 */
export const CURRENCY_FLAG_SIZE = 32

export const CURRENCY_FLAG_SPRITE = '/assets/currency-flags.png'

const CURRENCY_CODES = [
  'AUD',
  'BGN',
  'BRL',
  'CAD',
  'CHF',
  'CNY',
  'CZK',
  'DKK',
  'EUR',
  'GBP',
  'HKD',
  'HRK',
  'HUF',
  'ILS',
  'INR',
  'ISK',
  'JMD',
  'JPY',
  'KRW',
  'MXN',
  'NGN',
  'NOK',
  'NZD',
  'PLN',
  'RUB',
  'SAR',
  'SEK',
  'SGD',
  'SRD',
  'THB',
  'TRY',
  'TWD',
  'USD',
  'VEF',
  'ZAR',
] as const

export type CurrencyCode = typeof CURRENCY_CODES[number]

export const currencyFlagIndex = Object.fromEntries(
  CURRENCY_CODES.map((code, index) => [code, index]),
) as Record<CurrencyCode, number>

export const CURRENCY_FLAG_SPRITE_HEIGHT =
  CURRENCY_CODES.length * CURRENCY_FLAG_SIZE

export const hasCurrencyFlag = (code: string): code is CurrencyCode =>
  Object.prototype.hasOwnProperty.call(currencyFlagIndex, code)
