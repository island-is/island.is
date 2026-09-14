const MINUTES_IN_DAY = 24 * 60
const CLOSING_SOON_THRESHOLD_MINUTES = 30
const MS_IN_DAY = 24 * 60 * 60 * 1000

const pad = (value: number) => value.toString().padStart(2, '0')

const formatMinutes = (minutes: number) =>
  `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`

const parseTimeToMinutes = (time: string): number | undefined => {
  const match = time.match(/^(\d{1,2}):(\d{2})/)
  if (!match) return undefined
  return Number(match[1]) * 60 + Number(match[2])
}

export const formatTimeLabel = (time?: string | null): string | undefined => {
  const minutes = time ? parseTimeToMinutes(time) : undefined
  return minutes !== undefined ? formatMinutes(minutes) : undefined
}

export interface OpeningWindow {
  windowOpen: string
  windowClose: string
}

export interface OpeningHours {
  weekday?: OpeningWindow | null
  weekend?: OpeningWindow | null
  holiday?: OpeningWindow | null
}

/**
 * The hours the recipient keeps today, resolved through dayType. Undefined
 * when the recipient is closed on this kind of day.
 */
export const getTodaysWindow = (recipient: {
  dayType: string
  openingHours?: OpeningHours | null
}): OpeningWindow | undefined => {
  const key = recipient.dayType.toLowerCase()
  return key === 'weekday' || key === 'weekend' || key === 'holiday'
    ? recipient.openingHours?.[key] ?? undefined
    : undefined
}

export const getClosingSoonInfo = (
  window?: OpeningWindow | null,
  now: Date = new Date(),
): { isClosingSoon: boolean; openLabel?: string; closeLabel?: string } => {
  const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes()
  const openMinutes = window ? parseTimeToMinutes(window.windowOpen) : undefined
  const closeMinutes = window
    ? parseTimeToMinutes(window.windowClose)
    : undefined

  const minutesToClose =
    closeMinutes !== undefined
      ? (closeMinutes - nowMinutes + MINUTES_IN_DAY) % MINUTES_IN_DAY
      : undefined

  return {
    isClosingSoon:
      minutesToClose !== undefined &&
      minutesToClose > 0 &&
      minutesToClose <= CLOSING_SOON_THRESHOLD_MINUTES,
    openLabel:
      openMinutes !== undefined ? formatMinutes(openMinutes) : undefined,
    closeLabel:
      closeMinutes !== undefined ? formatMinutes(closeMinutes) : undefined,
  }
}

interface WindowLabels {
  openLabel: string
  closeLabel: string
}

const toWindowLabels = (
  window?: OpeningWindow | null,
): WindowLabels | undefined => {
  const openLabel = formatTimeLabel(window?.windowOpen)
  const closeLabel = formatTimeLabel(window?.windowClose)
  return openLabel && closeLabel ? { openLabel, closeLabel } : undefined
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
  const weekday = toWindowLabels(openingHours.weekday)
  const weekend = toWindowLabels(openingHours.weekend)
  const holiday = toWindowLabels(openingHours.holiday)

  if (!weekday && !weekend && !holiday) return undefined

  return { weekday, weekend, holiday }
}

export interface NextOpening {
  date: string
  windowOpen: string
}

/**
 * When the recipient next opens, phrased relative to the current UTC day —
 * the messaging windows are defined in UTC (Iceland stays on UTC year-round).
 */
export const getNextOpeningInfo = (
  nextOpensAt?: NextOpening | null,
  now: Date = new Date(),
):
  | { when: 'today' | 'tomorrow' | 'later'; timeLabel: string; dateLabel: string }
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
    dateLabel: `${pad(date.getUTCDate())}.${pad(
      date.getUTCMonth() + 1,
    )}.${date.getUTCFullYear()}`,
  }
}
