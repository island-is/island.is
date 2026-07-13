const MINUTES_IN_DAY = 24 * 60
const CLOSING_SOON_THRESHOLD_MINUTES = 30

const pad = (value: number) => value.toString().padStart(2, '0')

const formatMinutes = (minutes: number) =>
  `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`

const parseTimeToMinutes = (time: string): number | undefined => {
  const match = time.match(/^(\d{1,2}):(\d{2})/)
  if (!match) return undefined
  return Number(match[1]) * 60 + Number(match[2])
}


export const getMessagingWindowInfo = ({
  windowOpen,
  windowClose,
}: {
  windowOpen?: string
  windowClose?: string
}) => {
  const now = new Date()
  const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes()
  const openMinutes = windowOpen ? parseTimeToMinutes(windowOpen) : undefined
  const closeMinutes = windowClose ? parseTimeToMinutes(windowClose) : undefined

  const minutesToClose =
    closeMinutes !== undefined
      ? (closeMinutes - nowMinutes + MINUTES_IN_DAY) % MINUTES_IN_DAY
      : undefined

  return {
    isClosingSoon:
      minutesToClose !== undefined &&
      minutesToClose > 0 &&
      minutesToClose <= CLOSING_SOON_THRESHOLD_MINUTES,
    windowOpenLabel:
      openMinutes !== undefined ? formatMinutes(openMinutes) : undefined,
    windowCloseLabel:
      closeMinutes !== undefined ? formatMinutes(closeMinutes) : undefined,
    currentTimeLabel: formatMinutes(nowMinutes),
  }
}
