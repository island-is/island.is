import compareAsc from 'date-fns/compareAsc'
import parseISO from 'date-fns/parseISO'

import {
  NotificationType,
  Notification,
} from '@island.is/judicial-system/types'

const useNotifications = (notifications?: Notification[]) => {
  const hasSentNotification = (notificationType: NotificationType) => {
    if (!notifications || notifications.length === 0) {
      return false
    }

    const n = notifications.filter(
      (notification) => notification.type === notificationType,
    )

    const latestN = n.sort((a, b) =>
      compareAsc(parseISO(b.created), parseISO(a.created)),
    )[0]

    return latestN.recipients.some((recipient) => recipient.success)
  }

  return {
    hasSentNotification,
  }
}

export default useNotifications
