import {
  formatMinutes,
  parseTimeToMinutes,
} from '@island.is/portals/my-pages/core'

const MINUTES_IN_DAY = 24 * 60
const CLOSING_SOON_THRESHOLD_MINUTES = 30


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
