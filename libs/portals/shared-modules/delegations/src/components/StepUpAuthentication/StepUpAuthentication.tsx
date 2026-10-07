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
  /** Start straight away, without waiting for a button press. */
  autoStart?: boolean
}

type Notice = 'denied' | 'timed_out' | StepUpStartError

type State =
  | { name: 'idle'; notice?: Notice }
  | { name: 'starting' }
  | {
      name: 'waiting'
      method: StepUpMethod
      code?: string | null
      deadline: number
    }

/**
 * Authenticates the person again with electronic ID without leaving the page —
 * one button, a code, and they approve on their own phone. Looks like the
 * identity server's own verification screen: the code in a blue box while
 * waiting. There is no phone number field and no choice of method: it uses
 * the method the person logged in with, so it only reaches their own phone.
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
  autoStart = false,
}: StepUpAuthenticationProps) => {
  const { formatMessage } = useLocale()
  const [state, setState] = useState<State>({ name: 'idle' })
  const [secondsLeft, setSecondsLeft] = useState(0)
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
    (interval: number) => {
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
            poll(interval)
            return
          case 'confirmed':
            onConfirmed()
            return
          case 'expired':
            onExpired()
            return
          case 'denied':
          case 'timed_out':
            setState({ name: 'idle', notice: status })
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
        deadline: Date.now() + started.expiresIn * 1000,
      })
      poll(started.interval)
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

  // Countdown shown while waiting. The server decides when it has expired; this
  // is only for the person's benefit.
  useEffect(() => {
    if (state.name !== 'waiting') {
      return
    }

    const tick = () =>
      setSecondsLeft(
        Math.max(0, Math.round((state.deadline - Date.now()) / 1000)),
      )
    tick()
    const timer = setInterval(tick, 1000)

    return () => clearInterval(timer)
  }, [state])

  const notices: Record<
    Notice,
    { type: 'warning' | 'error'; message: string }
  > = {
    denied: { type: 'warning', message: formatMessage(m.stepUpDenied) },
    timed_out: { type: 'warning', message: formatMessage(m.stepUpTimedOut) },
    too_many_attempts: {
      type: 'warning',
      message: formatMessage(m.stepUpTooManyAttempts),
    },
    failed: { type: 'error', message: formatMessage(m.stepUpStartFailed) },
  }

  const notice =
    state.name === 'idle' && state.notice ? notices[state.notice] : undefined

  return (
    <Box display="flex" flexDirection="column" rowGap={[4, 4, 5]} width="full">
      <Box>
        <Text variant="h3" as="h2" marginBottom={1}>
          {formatMessage(m.stepUpTitle)}
        </Text>
        <Text>{formatMessage(m.stepUpIntro)}</Text>
      </Box>

      {notice && <AlertMessage type={notice.type} message={notice.message} />}

      {state.name === 'waiting' && (
        <>
          {/* The same as the identity server's own verification screen. */}
          <Box
            width="full"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            rowGap="smallGutter"
            paddingY={3}
            background="blue100"
            borderRadius="large"
            role="alert"
          >
            <Text>{formatMessage(m.stepUpYourSecurityCode)}</Text>
            <Text variant="h1">{state.code}</Text>
          </Box>
          <Box display="flex" justifyContent="center">
            <LoadingDots />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            rowGap={2}
          >
            <Text textAlign="center">
              {formatMessage(m.stepUpSecurityCodeConfirmMessage)}
            </Text>
            <Text textAlign="center">
              {formatMessage(m.stepUpSecurityCodeConfirmSubtitle)}
            </Text>
            <Text variant="small" color="dark300">
              {formatMessage(m.stepUpTimeLeft, {
                minutes: Math.floor(secondsLeft / 60),
                seconds: String(secondsLeft % 60).padStart(2, '0'),
              })}
            </Text>
          </Box>
        </>
      )}

      {(state.name === 'idle' || state.name === 'starting') && (
        <Button
          fluid
          onClick={() => begin()}
          loading={state.name === 'starting'}
        >
          {formatMessage(m.stepUpStart)}
        </Button>
      )}
    </Box>
  )
}
