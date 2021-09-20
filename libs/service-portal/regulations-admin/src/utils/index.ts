import { useLocale as _useLocale } from '@island.is/localization'
import { getHolidays } from 'fridagar'
import {
  ISODate,
  toISODate,
  HTMLText,
  MinistrySlug,
  RegulationType,
  PlainText,
  RegName,
} from '@island.is/regulations'
import { startOfDay, addDays, set } from 'date-fns/esm'
import { OptionTypeBase, ValueType } from 'react-select'
import { RegDraftFormSimpleProps, RegDraftForm } from '../state/types'

import { Option } from '@island.is/island-ui/core'
import { RegulationMinistry } from '@island.is/regulations/web'
import { MessageDescriptor, useIntl } from 'react-intl'

type FormatMessageValues = Parameters<
  ReturnType<typeof useIntl>['formatMessage']
>[1]

export const useLocale = () => {
  const data = _useLocale() as Omit<
    ReturnType<typeof _useLocale>,
    'formatMessage'
  > & {
    formatMessage: typeof formatMessage
  }

  const _formatDateFns = data.formatDateFns
  data.formatDateFns = (date, format = 'PP') => _formatDateFns(date, format)

  const _formatMessage = data.formatMessage

  function formatMessage(descriptor: undefined): undefined
  function formatMessage(
    descriptor: MessageDescriptor | string,
    values?: FormatMessageValues,
  ): string
  function formatMessage(
    descriptor: MessageDescriptor | string | undefined,
    values?: FormatMessageValues,
  ): string | undefined

  function formatMessage(
    descriptor: MessageDescriptor | string | undefined,
    values?: FormatMessageValues,
  ): string | undefined {
    if (!descriptor) return descriptor
    return _formatMessage(descriptor, values)
  }
  data.formatMessage = formatMessage

  return data
}

// ---------------------------------------------------------------------------

type IsHolidayMap = Record<string, true | undefined>
const _holidayCache: Record<number, IsHolidayMap | undefined> = {}

const getHolidayMap = (year: number): IsHolidayMap => {
  let yearHolidays = _holidayCache[year]
  if (!yearHolidays) {
    const holidayMap: IsHolidayMap = {}
    getHolidays(year).forEach((holiday) => {
      holidayMap[toISODate(holiday.date)] = true
    })
    yearHolidays = _holidayCache[year] = holidayMap
  }
  return yearHolidays
}

export const isWorkday = (date: Date): boolean => {
  const wDay = date.getDay()
  if (wDay === 0 || wDay === 6) {
    return false
  }
  const holidays = getHolidayMap(date.getFullYear())
  return holidays[toISODate(date)] !== true
}

export const getMinPublishDate = (fastTrack: boolean, signatureDate?: Date) => {
  let d = new Date()
  // Shift forward one day if the time is 14:00 or later.
  if (d.getHours() > 14) {
    d = addDays(d, 1)
  }
  // only fastTracked regulations may request today and/or a holiday
  if (!fastTrack) {
    d = getNextWorkday(addDays(d, 1))
  }
  const minDate = startOfDay(d)

  // Signature date sets a hard lower boundry on publication date.
  if (signatureDate && signatureDate > minDate) {
    return signatureDate
  }
  return minDate
}

export const getNextWorkday = (date: Date) => {
  // Returns the next workday.
  let nextDay = date
  while (!isWorkday(nextDay)) {
    nextDay = addDays(nextDay, 1)
  }
  return nextDay
}

// ---------------------------------------------------------------------------

export const workingDaysUntil = (date: Date | ISODate) => {
  const targetDate = date instanceof Date ? startOfDay(date) : new Date(date)
  const refDate = startOfDay(Date.now())
  if (targetDate <= refDate) {
    return { workingDayCount: 0, today: true }
  }

  let workingDayCount = 0
  while (refDate < targetDate) {
    if (isWorkday(refDate)) {
      workingDayCount += 1
    }
    refDate.setDate(refDate.getDate() + 1)
  }
  return { workingDayCount, today: false }
}

// ---------------------------------------------------------------------------

/** Icky utility function to handle the buggy typing of react-select
 *
 * See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/32553
 */
export const getRSValue = (option: ValueType<OptionTypeBase>) => {
  const opt: OptionTypeBase | undefined | null = Array.isArray(option)
    ? (option as Array<OptionTypeBase>)[0]
    : option
  return opt ? opt.value : undefined
}

export const emptyOption = (label?: string): Option => ({
  value: '',
  label: label ? `– ${label} –` : '—',
})

/** Looks through a list of `Option`s for one with a matching
 * `value` and returns a copy of it with its label trimmed for nicer
 * display by `react-select`
 *
 * If a match is not found it returns `null` because that's the
 * magic value that tricks `react-select` to show the "placeholder" value
 */
export const findValueOption = (
  options: ReadonlyArray<Option>,
  value?: string,
): Option | null => {
  if (!value) {
    return null
  }
  const opt = options.find((opt) => value === opt.value || value === opt.label)
  return (
    (opt && {
      value: opt.value,
      label: opt.label.trim(),
    }) ||
    null
  )
}

// ---------------------------------------------------------------------------

export const asDiv = (html: HTMLText): HTMLDivElement => {
  const div = document.createElement('div')
  div.innerHTML = html
  return div
}

// ---------------------------------------------------------------------------

const getSpacedTextContent = (html: HTMLText): PlainText => {
  const blockElms = 'p,h2,h3,h4,h5,h6,td,th,caption,li,blockquote'
  const textDiv = asDiv(html)
  textDiv.querySelectorAll(blockElms).forEach((elm) => {
    // inject spaces after each block level element to
    // ensure .textContent returns legible text for grepping
    elm.after(' ')
  })
  return textDiv.textContent as PlainText
}

export const findAffectedRegulationsInText = (
  title: PlainText,
  text: HTMLText,
): Array<string> => {
  const totalString = title + ' ' + getSpacedTextContent(text)
  const maybeRegNames: Record<string, true> = {}

  const nameMatchRe = /(?<!(?:lög|lögum|laga)\s+(?:nr.|númer)\s*)[\s(]\d{1,4}\/(?:19|20)\d{2}[\s,.;)]/gi

  let m: RegExpExecArray | null
  while ((m = nameMatchRe.exec(totalString))) {
    const maybeName = m[0].replace(/^[\s(]/, '').replace(/[\s,.;)]$/, '')
    maybeRegNames[maybeName] = true
  }
  return Object.keys(maybeRegNames)
}

// ---------------------------------------------------------------------------

export const findSignatureInText = (
  html: HTMLText,
  ministries: ReadonlyArray<RegulationMinistry>,
) => {
  const paragraphs = Array.from(asDiv(html).querySelectorAll('p')).slice(-40)

  const threeLetterMonths = [
    'jan',
    'feb',
    'mar',
    'apr',
    'maí',
    'jún',
    'júl',
    'ágú',
    'sep',
    'okt',
    'nóv',
    'des',
  ]
  const undirskrRe = /^(.+?ráðuneyti)(?:ð|nu),? (\d{1,2})\.? (jan|feb|mar|apr|maí|jún|júl|ágú|sep|okt|nóv|des)(?:\.|[a-záðéíóúýþæö]+)? (2\d{3}).?$/i

  let match: RegExpMatchArray | false | null = false

  // Side-effect `Array#find` to perform one-pass search and assign to `_match`.
  paragraphs.reverse().find((elm) => {
    const textContent = elm.textContent || ''
    if (!/ráðuneyti/i.test(textContent)) {
      return false
    }
    match = textContent.trim().replace(/\s+/g, ' ').match(undirskrRe)
    console.log('FOOBAR BB-2', {
      cleanText: textContent.trim().replace(/\s+/g, ' '),
      match,
    })
    return !!match
  })

  if (!match) {
    return {}
  }
  const [
    _,
    ministryName,
    dayOfMonth,
    monthName,
    year,
  ] = match as RegExpMatchArray

  const signatureDate = set(new Date(), {
    date: parseInt(dayOfMonth),
    month: threeLetterMonths.indexOf(monthName.toLowerCase()),
    year: parseInt(year),
  })
  const ministrySlug = ministries.find((m) => m.name === ministryName)?.slug

  return {
    ministrySlug,
    signatureDate,
  }
}

//
// NOTE: Let's not rabbit-hole into guessing the effectiveDate
//

export const findRegulationType = (title: PlainText): RegulationType =>
  /^Reglugerð um (?:\((\d+\.)\) )?breytingu á reglugerð /i.test(title)
    ? 'amending'
    : 'base'

// ---------------------------------------------------------------------------

export const getInputFieldsWithErrors = (
  inputs: RegDraftFormSimpleProps[],
  draft: RegDraftForm | undefined,
) => {
  if (draft) {
    const hasErrors = inputs.filter((x) => !draft[x].value)
    if (hasErrors.length > 0) {
      const errorUpdateArray = hasErrors.map((item) => ({
        [item]: {
          ...draft?.[item],
          error: true,
        },
      }))
      return Object.assign({}, ...errorUpdateArray)
    }
  }
  return undefined
}
