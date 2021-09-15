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

type DateFormatter = ReturnType<typeof _useLocale>['formatDateFns']

export const useLocale = () => {
  const data = _useLocale()
  const _formatDateFns = data.formatDateFns
  const formatDateFns: DateFormatter = (date, format = 'PP') =>
    _formatDateFns(date, format)
  data.formatDateFns = formatDateFns

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

export const getMinPublishDate = (fastTrack?: boolean) => {
  let d = new Date()
  // Shift forward one day if the time is 14:00 or later.
  if (d.getHours() > 14) {
    d = addDays(d, 1)
  }
  if (!fastTrack) {
    d = getNextWorkday(addDays(d, 1))
  }
  return startOfDay(d)
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

export const findAffectedRegulationsInText = (
  title: PlainText,
  text: HTMLText,
): Array<RegName> => {
  const regs: Array<RegName> = []
  if (findRegulationType(title) === 'amending') {
    // TODO: actually search the title
    regs.push('1270/2016' as RegName)
  }
  // TODO: search text
  return regs
}

export const findSignatureInText = (html: HTMLText) => {
  const htmlDiv = document.createElement('div')
  htmlDiv.innerHTML = html
  // FIXME: .Dags elements are not always present.
  // Instead loop through the last N paragraphs.
  const innertext = htmlDiv.querySelectorAll('.Dags')[0]

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

  const undirskrRe = /^(.+?ráðuneyti)(?:ð|nu),? (\d{1,2})\.? (jan|feb|mar|apr|maí|jún|júl|ágú|sep|okt|nóv|des)(?:\.|\w+)? (2\d{3}).?$/i
  const text = innertext?.textContent?.trim().replace(/\s+/g, ' ')
  const m = text?.match(undirskrRe)

  const ministryName = m?.[1]
  const dayOfMonth = m?.[2]
  const monthIndex = m?.[3]
    ? threeLetterMonths.indexOf(m[3].toLowerCase())
    : undefined
  const year = m?.[4]

  const signatureDate =
    monthIndex && year && dayOfMonth
      ? set(new Date(), {
          year: parseInt(year, 10),
          month: monthIndex,
          date: parseInt(dayOfMonth, 10),
        })
      : undefined

  return { ministryName, signatureDate }
}

//
// NOTE: Let's not rabbit-hole into guessing the effectiveDate
//

export const findRegulationType = (title: PlainText): RegulationType =>
  /^Reglugerð um (?:\((\d+\.)\) )?breytingu á reglugerð /i.test(title)
    ? 'amending'
    : 'base'

export const getAllGuessableValues = (text: HTMLText, title: string) => {
  const { ministryName, signatureDate } = findSignatureInText(text)
  const regulationTypeValue = findRegulationType(title)

  return {
    ministry: {
      value: ministryName as MinistrySlug,
      guessed: true,
    },
    signatureDate: {
      value: signatureDate,
      guessed: true,
    },
    type: {
      value: regulationTypeValue,
      guessed: true,
    },
  }
}

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
