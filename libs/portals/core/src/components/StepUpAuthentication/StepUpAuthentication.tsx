import { useCallback, useEffect, useRef, useState } from 'react'

import {
  AlertMessage,
  Box,
  Button,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import type { MessageDescriptor } from 'react-intl'

import { m } from '../../lib/messages'

const defaultMessages = {
  title: m.stepUpTitle,
  failedTitle: m.stepUpFailedTitle,
  methodSim: m.stepUpMethodSim,
  methodApp: m.stepUpMethodApp,
  back: m.stepUpBack,
  retry: m.stepUpRetry,
  yourSecurityCode: m.stepUpYourSecurityCode,
  confirmMessageSim: m.stepUpSecurityCodeConfirmMessage,
  confirmMessageApp: m.stepUpSecurityCodeConfirmMessageApp,
  confirmSubtitle: m.stepUpSecurityCodeConfirmSubtitle,
  deniedTitle: m.stepUpDeniedTitle,
  denied: m.stepUpDenied,
  timedOutTitle: m.stepUpTimedOutTitle,
  timedOut: m.stepUpTimedOut,
  expiredTitle: m.stepUpExpiredTitle,
  expired: m.stepUpExpired,
  refused: m.stepUpRefused,
}

export type StepUpMessages = Record<
  keyof typeof defaultMessages,
  MessageDescriptor
>

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
  /** Wording for what is being confirmed, where the general one doesn't fit. */
  messages?: Partial<StepUpMessages>
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
  messages,
}: StepUpAuthenticationProps) => {
  const { formatMessage } = useLocale()
  const text = { ...defaultMessages, ...messages }
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
      title: formatMessage(text.deniedTitle),
      message: formatMessage(text.denied),
    },
    timed_out: {
      title: formatMessage(text.timedOutTitle),
      message: formatMessage(text.timedOut),
    },
    expired: {
      title: formatMessage(text.expiredTitle),
      message: formatMessage(text.expired),
    },
    refused: {
      title: formatMessage(text.failedTitle),
      message: formatMessage(text.refused),
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
            stepUp.method === 'sim' ? text.methodSim : text.methodApp,
          )}
        </Text>
        <Text variant="h3" as="h2">
          {formatMessage(notice ? text.failedTitle : text.title)}
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
            <Text>{formatMessage(text.yourSecurityCode)}</Text>
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
                  ? text.confirmMessageSim
                  : text.confirmMessageApp,
              )}
            </Text>
            <Text variant="small" textAlign="center">
              {formatMessage(text.confirmSubtitle)}
            </Text>
          </Box>
        </>
      )}

      {/* While waiting the modal's own close is the way out, as designed. */}
      {state.name === 'ended' && (
        <Box display="flex" justifyContent="spaceBetween" columnGap={2}>
          {onBack ? (
            <Button variant="ghost" onClick={onBack}>
              {formatMessage(text.back)}
            </Button>
          ) : (
            <span />
          )}
          <Button onClick={onRetry} loading={retrying} disabled={retrying}>
            {formatMessage(text.retry)}
          </Button>
        </Box>
      )}
    </Box>
  )
}
