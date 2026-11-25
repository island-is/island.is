const CLOSING_SOON_THRESHOLD_MS = 30 * 60 * 1000
const MS_IN_DAY = 24 * 60 * 60 * 1000

const pad = (value: number) => value.toString().padStart(2, '0')

export const formatTimeLabel = (time?: string | null): string | undefined => {
  const match = time?.match(/^(\d{1,2}):(\d{2})/)
  return match ? `${pad(Number(match[1]))}:${match[2]}` : undefined
}

export const isClosingSoon = (
  closesAt?: string | null,
  now: Date = new Date(),
): boolean => {
  if (!closesAt) return false
  const msToClose = new Date(closesAt).getTime() - now.getTime()
  return msToClose > 0 && msToClose <= CLOSING_SOON_THRESHOLD_MS
}

export interface OpeningWindow {
  windowOpen: string
  windowClose: string
  isAllDay: boolean
}

export interface OpeningHours {
  weekday?: OpeningWindow | null
  weekend?: OpeningWindow | null
  holiday?: OpeningWindow | null
}

export interface WindowLabels {
  openLabel: string
  closeLabel: string
  isAllDay: boolean
}

export const getWindowLabels = (
  window?: OpeningWindow | null,
): WindowLabels | undefined => {
  const openLabel = formatTimeLabel(window?.windowOpen)
  const closeLabel = formatTimeLabel(window?.windowClose)
  return window && openLabel && closeLabel
    ? { openLabel, closeLabel, isAllDay: window.isAllDay }
    : undefined
}

export interface OpeningHoursLabels {
  weekday?: WindowLabels
  weekend?: WindowLabels
  holiday?: WindowLabels
}

export const getOpeningHoursLabels = (
  openingHours?: OpeningHours | null,
): OpeningHoursLabels | undefined => {
  if (!openingHours) return undefined
  const weekday = getWindowLabels(openingHours.weekday)
  const weekend = getWindowLabels(openingHours.weekend)
  const holiday = getWindowLabels(openingHours.holiday)

  if (!weekday && !weekend && !holiday) return undefined

  return { weekday, weekend, holiday }
}

export interface NextOpening {
  date: string
  windowOpen: string
}

// Day difference is counted in UTC, which is Icelandic local time all year.
export const getNextOpeningInfo = (
  nextOpensAt?: NextOpening | null,
  now: Date = new Date(),
):
  | {
      when: 'today' | 'tomorrow' | 'later'
      timeLabel: string
      opensAtMidnight: boolean
      dateLabel: string
    }
  | undefined => {
  if (!nextOpensAt) return undefined
  const timeLabel = formatTimeLabel(nextOpensAt.windowOpen)
  const date = new Date(nextOpensAt.date)
  if (!timeLabel || isNaN(date.getTime())) return undefined

  const dayNumber = (d: Date) => Math.floor(d.getTime() / MS_IN_DAY)
  const dayDiff = dayNumber(date) - dayNumber(now)

  return {
    when: dayDiff <= 0 ? 'today' : dayDiff === 1 ? 'tomorrow' : 'later',
    timeLabel,
    // "kl. 00:00 á morgun" reads oddly, so the day alone is shown for midnight.
    opensAtMidnight: timeLabel === '00:00',
    dateLabel: `${pad(date.getUTCDate())}.${pad(
      date.getUTCMonth() + 1,
    )}.${date.getUTCFullYear()}`,
  }
}
