import { useCallback, useEffect, useRef, useState } from 'react'

import { Box, Button, LoadingDots, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { m } from '../../lib/messages'

export type StepUpMethod = 'app' | 'sim'

export type StepUpStatus =
  | 'not_started'
  | 'pending'
  | 'confirmed'
  | 'denied'
  | 'timed_out'
  | 'expired'

export interface StepUpStart {
  /** Which method the server chose, so we can say where to look. */
  method: StepUpMethod
  verificationCode?: string | null
  /** Seconds between polls. */
  interval: number
  /** Seconds until the step-up gives up. */
  expiresIn: number
}

/** Why starting failed, so the right thing can be said about it. */
export type StepUpStartError = 'too_many_attempts' | 'failed'

interface StepUpAuthenticationProps {
  /**
   * Asks the server to start the authentication. The server reaches the person
   * the way they logged in to this session — their Auðkenni app or their own
   * SIM — so it only ever reaches their own phone. Reject with a
   * StepUpStartError.
   */
  start: () => Promise<StepUpStart>
  /** Asks the server where the authentication stands. */
  check: () => Promise<StepUpStatus>
  onConfirmed: () => void
  /** The thing being confirmed is gone; there is nothing left to authenticate for. */
  onExpired: () => void
  /** What is being confirmed, shown under the title, e.g. "Veiting umboðs · Name". */
  context?: string
  /** Shows a "Til baka" button. */
  onBack?: () => void
  /** Start straight away, without waiting for a button press. */
  autoStart?: boolean
}

type Notice = 'denied' | 'timed_out' | StepUpStartError

type State =
  | { name: 'idle'; notice?: Notice; method?: StepUpMethod }
  | { name: 'starting' }
  | {
      name: 'waiting'
      method: StepUpMethod
      code?: string | null
    }

/**
 * Authenticates the person again with electronic ID without leaving the page:
 * a code, and they approve on their own phone. Looks like the identity
 * server's own verification screen. There is no phone number field and no
 * choice of method: it uses the method the person logged in with, so it only
 * reaches their own phone.
 *
 * Generic on purpose — it only knows how to start and how to check. Confirming
 * a sensitive delegation is the first use; locking a sensitive screen is meant
 * to be the next.
 */
export const StepUpAuthentication = ({
  start,
  check,
  onConfirmed,
  onExpired,
  context,
  onBack,
  autoStart = false,
}: StepUpAuthenticationProps) => {
  const { formatMessage } = useLocale()
  const [state, setState] = useState<State>({ name: 'idle' })
  const pollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const unmounted = useRef(false)
  const autoStarted = useRef(false)

  // Set on mount as well as cleared on unmount: React mounts twice in
  // development (StrictMode), and a flag only ever set to true would make the
  // second mount ignore every answer.
  useEffect(() => {
    unmounted.current = false
    return () => {
      unmounted.current = true
      clearTimeout(pollTimer.current)
    }
  }, [])

  const poll = useCallback(
    (interval: number, method: StepUpMethod) => {
      clearTimeout(pollTimer.current)
      pollTimer.current = setTimeout(async () => {
        let status: StepUpStatus
        try {
          status = await check()
        } catch {
          // A failed poll is not an answer. Try again at the next interval.
          status = 'pending'
        }

        if (unmounted.current) {
          return
        }

        switch (status) {
          case 'pending':
            poll(interval, method)
            return
          case 'confirmed':
            onConfirmed()
            return
          case 'expired':
            onExpired()
            return
          case 'denied':
          case 'timed_out':
            setState({ name: 'idle', notice: status, method })
            return
          case 'not_started':
            setState({ name: 'idle' })
            return
        }
      }, interval * 1000)
    },
    [check, onConfirmed, onExpired],
  )

  const begin = useCallback(async () => {
    clearTimeout(pollTimer.current)
    setState({ name: 'starting' })

    try {
      const started = await start()
      if (unmounted.current) {
        return
      }

      setState({
        name: 'waiting',
        method: started.method,
        code: started.verificationCode,
      })
      poll(started.interval, started.method)
    } catch (error) {
      setState({
        name: 'idle',
        notice: error === 'too_many_attempts' ? 'too_many_attempts' : 'failed',
      })
    }
  }, [start, poll])

  // Kept to exactly one start, however many times React mounts this.
  useEffect(() => {
    if (autoStart && !autoStarted.current) {
      autoStarted.current = true
      void begin()
    }
  }, [autoStart, begin])

  const notices: Record<Notice, string> = {
    denied: formatMessage(m.stepUpDenied),
    timed_out: formatMessage(m.stepUpTimedOut),
    too_many_attempts: formatMessage(m.stepUpTooManyAttempts),
    failed: formatMessage(m.stepUpStartFailed),
  }

  const notice =
    state.name === 'idle' && state.notice ? state.notice : undefined
  const method = state.name === 'starting' ? undefined : state.method
  // Starting again won't help after too many attempts.
  const canRetry = notice !== 'too_many_attempts'

  return (
    <Box display="flex" flexDirection="column" rowGap={4} width="full">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        rowGap={1}
        textAlign="center"
      >
        {method && (
          <Text variant="eyebrow" color="blue400">
            {formatMessage(
              method === 'sim' ? m.stepUpMethodSim : m.stepUpMethodApp,
            )}
          </Text>
        )}
        <Text variant="h3" as="h2">
          {formatMessage(notice ? m.stepUpFailedTitle : m.stepUpTitle)}
        </Text>
        {context && <Text>{context}</Text>}
      </Box>

      {notice && (
        <Box role="alert">
          <Text textAlign="center">{notices[notice]}</Text>
        </Box>
      )}

      {state.name === 'starting' && (
        <Box display="flex" justifyContent="center">
          <LoadingDots />
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
              {state.code}
            </Text>
          </Box>
          <Box display="flex" justifyContent="center">
            <LoadingDots />
          </Box>
          <Box display="flex" flexDirection="column" rowGap={1}>
            <Text variant="small" textAlign="center">
              {formatMessage(
                state.method === 'sim'
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

      {(onBack || state.name === 'idle') && (
        <Box display="flex" justifyContent="spaceBetween" columnGap={2}>
          {onBack ? (
            <Button variant="ghost" onClick={onBack}>
              {formatMessage(m.stepUpBack)}
            </Button>
          ) : (
            <span />
          )}
          {state.name === 'idle' && canRetry && (
            <Button onClick={() => begin()}>
              {formatMessage(notice ? m.stepUpRetry : m.stepUpStart)}
            </Button>
          )}
        </Box>
      )}
    </Box>
  )
}
