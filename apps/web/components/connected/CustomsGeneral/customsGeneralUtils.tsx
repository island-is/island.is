import { useIntl } from 'react-intl'

import { Tag } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { formatDate } from '@island.is/web/utils/formatDate'

import { m } from './translation.strings'

/**
 * Open ended validity is expressed with a sentinel end date far in the future rather
 * than with an empty value, so anything past this is shown as indefinite.
 */
const INDEFINITE_YEAR = 2200

export const formatValidityDate = (
  iso: string | undefined | null,
  indefinite: string,
  locale: string,
): string => {
  if (!iso) return indefinite
  const date = new Date(iso)
  if (isNaN(date.getTime()) || date.getFullYear() >= INDEFINITE_YEAR) {
    return indefinite
  }
  return formatDate(date, locale as 'is' | 'en', 'dd.MM.yyyy') ?? indefinite
}

/**
 * Validity as it arrives from the API, where every field is optional. The `DateTime`
 * scalar is typed as `Date` but comes over the wire as a string.
 */
export interface ValidityFieldsInput {
  validFrom?: string | Date | null
  validTo?: string | Date | null
  notYetInEffect?: boolean | null
}

/**
 * Validity carried by every dated row. Rows flagged `notYetInEffect` are published ahead
 * of time by the upstream API - they are real entries that only take effect after the
 * reference date, so they are labelled rather than hidden.
 */
export interface ValidityFields {
  validFrom: string
  validTo: string
  notYetInEffect: boolean
}

const toDateString = (value?: string | Date | null): string =>
  value instanceof Date ? value.toISOString() : value ?? ''

export const mapValidityFields = (
  item: ValidityFieldsInput,
): ValidityFields => ({
  validFrom: toDateString(item.validFrom),
  validTo: toDateString(item.validTo),
  notYetInEffect: item.notYetInEffect ?? false,
})

export const NotYetInEffectTag = ({ validFrom }: { validFrom?: string }) => {
  const { formatMessage } = useIntl()
  const { activeLocale } = useI18n()
  const date = formatValidityDate(validFrom, '', activeLocale)

  return (
    <Tag variant="purple" outlined>
      {date
        ? formatMessage(m.takesEffectOn, { date })
        : formatMessage(m.notYetInEffect)}
    </Tag>
  )
}
