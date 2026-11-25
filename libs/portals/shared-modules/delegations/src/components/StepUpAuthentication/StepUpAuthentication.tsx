import { useCallback, useEffect, useRef, useState } from 'react'

import {
  AlertMessage,
  Box,
  Button,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'

export type StepUpMethod = 'app' | 'sim'

export type StepUpStatus =
  | 'pending'
  | 'confirmed'
  | 'denied'
  | 'timed_out'
  | 'expired'

export interface StepUpStart {
  method: StepUpMethod
  verificationCode?: string | null
  interval: number
  expiresIn: number
}

interface StepUpAuthenticationProps {
  stepUp: StepUpStart
  check: () => Promise<StepUpStatus>
  onConfirmed: () => void
  onRetry: () => void
  retrying?: boolean
  context?: string
  onBack?: () => void
}

type Notice = 'denied' | 'timed_out' | 'expired' | 'refused'

type State = { name: 'waiting' } | { name: 'ended'; notice: Notice }

export const StepUpAuthentication = ({
  stepUp,
  check,
  onConfirmed,
  onRetry,
  retrying = false,
  context,
  onBack,
}: StepUpAuthenticationProps) => {
  const { formatMessage } = useLocale()
  const [state, setState] = useState<State>({ name: 'waiting' })
  const pollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const unmounted = useRef(false)

  // In refs, so parent re-renders don't restart polling while a check is in flight.
  const checkRef = useRef(check)
  const onConfirmedRef = useRef(onConfirmed)
  checkRef.current = check
  onConfirmedRef.current = onConfirmed

  const poll = useCallback(() => {
    clearTimeout(pollTimer.current)
    pollTimer.current = setTimeout(async () => {
      let status: StepUpStatus | 'refused'
      try {
        status = await checkRef.current()
      } catch (error) {
        status = error === 'refused' ? 'refused' : 'pending'
      }

      if (unmounted.current) {
        return
      }

      switch (status) {
        case 'pending':
          poll()
          return
        case 'confirmed':
          onConfirmedRef.current()
          return
        default:
          setState({ name: 'ended', notice: status })
      }
    }, stepUp.interval * 1000)
  }, [stepUp.interval])

  // Reset on mount too: StrictMode mounts twice, and a flag only ever set to true would ignore every answer.
  useEffect(() => {
    unmounted.current = false
    poll()
    return () => {
      unmounted.current = true
      clearTimeout(pollTimer.current)
    }
  }, [poll])

  const notices: Record<Notice, { title: string; message: string }> = {
    denied: {
      title: formatMessage(m.stepUpDeniedTitle),
      message: formatMessage(m.stepUpDenied),
    },
    timed_out: {
      title: formatMessage(m.stepUpTimedOutTitle),
      message: formatMessage(m.stepUpTimedOut),
    },
    expired: {
      title: formatMessage(m.confirmDelegationExpiredTitle),
      message: formatMessage(m.confirmDelegationExpiredMessage),
    },
    refused: {
      title: formatMessage(m.stepUpFailedTitle),
      message: formatMessage(m.confirmDelegationFailedMessage),
    },
  }

  const notice = state.name === 'ended' ? state.notice : undefined

  return (
    <Box display="flex" flexDirection="column" rowGap={4} width="full">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        rowGap={1}
        textAlign="center"
      >
        <Text variant="eyebrow" color="blue400">
          {formatMessage(
            stepUp.method === 'sim' ? m.stepUpMethodSim : m.stepUpMethodApp,
          )}
        </Text>
        <Text variant="h3" as="h2">
          {formatMessage(notice ? m.stepUpFailedTitle : m.stepUpTitle)}
        </Text>
        {context && <Text>{context}</Text>}
      </Box>

      {notice && (
        <Box role="alert">
          <AlertMessage
            type="error"
            title={notices[notice].title}
            message={notices[notice].message}
          />
        </Box>
      )}

      {state.name === 'waiting' && (
        <>
          {/* The same as the identity server's own verification screen. */}
          <Box
            width="full"
            display="flex"
            flexDirection="column"
            alignItems="center"
            rowGap="smallGutter"
            padding={3}
            background="blue100"
            borderRadius="large"
            role="alert"
          >
            <Text>{formatMessage(m.stepUpYourSecurityCode)}</Text>
            <Text variant="h3" as="p">
              {stepUp.verificationCode}
            </Text>
          </Box>
          <Box display="flex" justifyContent="center">
            <LoadingDots />
          </Box>
          <Box display="flex" flexDirection="column" rowGap={1}>
            <Text variant="small" textAlign="center">
              {formatMessage(
                stepUp.method === 'sim'
                  ? m.stepUpSecurityCodeConfirmMessage
                  : m.stepUpSecurityCodeConfirmMessageApp,
              )}
            </Text>
            <Text variant="small" textAlign="center">
              {formatMessage(m.stepUpSecurityCodeConfirmSubtitle)}
            </Text>
          </Box>
        </>
      )}

      {/* While waiting the modal's own close is the way out, as designed. */}
      {state.name === 'ended' && (
        <Box display="flex" justifyContent="spaceBetween" columnGap={2}>
          {onBack ? (
            <Button variant="ghost" onClick={onBack}>
              {formatMessage(m.stepUpBack)}
            </Button>
          ) : (
            <span />
          )}
          <Button onClick={onRetry} loading={retrying} disabled={retrying}>
            {formatMessage(m.stepUpRetry)}
          </Button>
        </Box>
      )}
    </Box>
  )
}
