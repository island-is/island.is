import type { Locale } from '@island.is/shared/types'
import { localeMap } from '@island.is/cms'

export const METRICS_PREFIX = 'user-notification.'

export const SmsDelivery = {
  ALWAYS: 'ALWAYS',
  OPT_IN: 'OPT_IN',
  NEVER: 'NEVER',
} as const

export type SmsDeliveryOption = typeof SmsDelivery[keyof typeof SmsDelivery]

export const isDefined = <T>(x: T | null | undefined): x is T => x != null
export const mapToLocale = (locale: string): Locale =>
  locale === 'en' ? 'en' : 'is'
export const mapToContentfulLocale = (locale: Locale): string =>
  locale === 'en' ? 'en' : 'is-IS'
export const cleanString = (str: string): string =>
  str.replace(/\s+/g, ' ').trim()

/**
 * Normalizes a sender id (kennitala) by stripping all non-digit characters,
 * e.g. '550169-2829' -> '5501692829'.
 */
export const normalizeKennitala = (senderId: string): string =>
  senderId.replace(/\D/g, '')

/**
 * A normalized sender id is valid when it is exactly 10 digits, matching the
 * validation user-profile applies when blocking a sender.
 */
export const isValidSenderId = (normalizedSenderId: string): boolean =>
  /^\d{10}$/.test(normalizedSenderId)

export const extractLocaleField = (
  field: string | Record<string, string> | undefined | null,
  locale: Locale,
  fallback = '',
): string => {
  if (!field) return fallback
  if (typeof field === 'string') return field
  const contentfulLocaleCode = localeMap[locale] || 'is-IS'
  return field[contentfulLocaleCode] || field['is-IS'] || fallback
}
