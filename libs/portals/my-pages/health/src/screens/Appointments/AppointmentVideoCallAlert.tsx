import { useEffect, useReducer } from 'react'
import { HealthDirectorateAppointmentLinkType } from '@island.is/api/schema'
import { AlertMessage, Box, Button, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { LinkResolver } from '@island.is/portals/my-pages/core'
import { useWindowSize } from 'react-use'
import { messages } from '../../lib/messages'
import * as styles from './AppointmentVideoCallAlert.css'

type VideoCallPhase = 'before' | 'active' | 'expired'

const getVideoCallPhase = (
  activatesAt?: string | Date | null,
  expiresAt?: string | Date | null,
): VideoCallPhase => {
  if (!activatesAt || !expiresAt) return 'active'
  const now = Date.now()
  if (now >= new Date(expiresAt).getTime()) return 'expired'
  if (now >= new Date(activatesAt).getTime()) return 'active'
  return 'before'
}

interface Props {
  links?: Array<{
    type: HealthDirectorateAppointmentLinkType
    url: string
    activatesAt?: string | null
    expiresAt?: string | null
  }> | null
}

export const AppointmentVideoCallAlert = ({ links }: Props) => {
  const { formatMessage } = useLocale()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.sm

  const videoCall = links?.find(
    (l) => l.type === HealthDirectorateAppointmentLinkType.VIDEO_CALL,
  )
  const { activatesAt, expiresAt } = videoCall ?? {}

  const [, rerender] = useReducer((c) => c + 1, 0)
  // Pure derivation each render — always correct at render time, so the very
  // first render with a resolved activatesAt/expiresAt already reflects the
  // correct phase.
  const videoCallPhase = getVideoCallPhase(activatesAt, expiresAt)

  // Arm a single timer for the next phase boundary. No dep array: it re-arms
  // after every render, so a capped long wait chains itself, and a timer that
  // was delayed by tab throttling or laptop sleep self-corrects on the next
  // render instead of getting stuck.
  useEffect(() => {
    if (videoCallPhase === 'expired' || !activatesAt || !expiresAt) {
      return
    }
    const boundary =
      videoCallPhase === 'before'
        ? new Date(activatesAt).getTime()
        : new Date(expiresAt).getTime()
    // The cap keeps the delay well under the browser's 32-bit setTimeout
    // The floor prevents a tight re-arm loop if a timer fires early.
    const delay = Math.min(boundary - Date.now(), 60 * 60 * 1000)
    const timeout = setTimeout(rerender, Math.max(delay, 1000))
    return () => clearTimeout(timeout)
  })

  if (videoCallPhase === 'expired') {
    return null
  }

  const videoCallLink = videoCall?.url
  const isVideoCallActive = videoCallPhase === 'active'

  return (
    <Box marginTop={3}>
      <AlertMessage
        type="info"
        message={
          videoCallLink ? (
            <Box className={styles.videoCallMessageRow}>
              <Text variant="small">
                {formatMessage(
                  isVideoCallActive
                    ? messages.appointmentVideoCallInfoWithLinkActive
                    : messages.appointmentVideoCallInfoWithLink,
                )}
              </Text>
              {isVideoCallActive ? (
                <LinkResolver
                  href={videoCallLink}
                  className={styles.videoCallLink}
                >
                  <Button as="span" size="small" fluid={isMobile} unfocusable>
                    {formatMessage(messages.appointmentVideoCallLink)}
                  </Button>
                </LinkResolver>
              ) : (
                <Box className={styles.videoCallLink}>
                  <Button size="small" fluid={isMobile} disabled>
                    {formatMessage(messages.appointmentVideoCallLink)}
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            formatMessage(messages.appointmentVideoCallInfoNoLink)
          )
        }
      />
    </Box>
  )
}
