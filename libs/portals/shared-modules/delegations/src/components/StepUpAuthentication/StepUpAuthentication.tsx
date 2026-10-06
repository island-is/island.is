import { useCallback, useEffect, useRef, useState } from 'react'

import {
  AlertMessage,
  Box,
  Button,
  Icon,
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
  /** Every method the person could use, so they can be offered the other one. */
  availableMethods: StepUpMethod[]
}

/** Why starting failed, so the right thing can be said about it. */
export type StepUpStartError = 'too_many_attempts' | 'failed'

interface StepUpAuthenticationProps {
  /**
   * Asks the server to start the authentication. By default the server decides
   * how to reach the person — the way they logged in to this session. They may
   * ask for the other method, never for where it goes, so it only ever reaches
   * their own phone. Reject with a StepUpStartError.
   */
  start: (method?: StepUpMethod) => Promise<StepUpStart>
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
      availableMethods: StepUpMethod[]
    }

/**
 * Authenticates the person again with electronic ID without leaving the page —
 * one button, a code, and they approve on their own phone. The server decides
 * how, from the way they logged in: the Auðkenni app, or their own SIM. They can
 * switch to the other one if the server offers it. There is deliberately no way
 * to send it anywhere else.
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
  // The last attempt, so a person whose attempt failed can try the other way.
  const [lastAttempt, setLastAttempt] = useState<
    { method: StepUpMethod; availableMethods: StepUpMethod[] } | undefined
  >()
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

  const begin = useCallback(
    async (method?: StepUpMethod) => {
      clearTimeout(pollTimer.current)
      setState({ name: 'starting' })

      try {
        const started = await start(method)
        if (unmounted.current) {
          return
        }

        setLastAttempt({
          method: started.method,
          availableMethods: started.availableMethods,
        })
        setState({
          name: 'waiting',
          method: started.method,
          code: started.verificationCode,
          deadline: Date.now() + started.expiresIn * 1000,
          availableMethods: started.availableMethods,
        })
        poll(started.interval)
      } catch (error) {
        setState({
          name: 'idle',
          notice:
            error === 'too_many_attempts' ? 'too_many_attempts' : 'failed',
        })
      }
    },
    [start, poll],
  )

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

  // The other way of reaching the person, if the server offers one: while
  // waiting (e.g. their SIM isn't at hand), and after an attempt that failed.
  const otherMethod =
    state.name === 'waiting'
      ? state.availableMethods.find((method) => method !== state.method)
      : state.name === 'idle' && state.notice && lastAttempt
      ? lastAttempt.availableMethods.find(
          (method) => method !== lastAttempt.method,
        )
      : undefined

  const switchMethod = otherMethod && (
    <Box>
      <Button variant="text" size="small" onClick={() => begin(otherMethod)}>
        {formatMessage(otherMethod === 'app' ? m.stepUpUseApp : m.stepUpUseSim)}
      </Button>
    </Box>
  )

  return (
    <Box
      border="standard"
      borderRadius="large"
      padding={[3, 3, 4]}
      display="flex"
      flexDirection="column"
      alignItems="center"
      rowGap={3}
      textAlign="center"
    >
      <Icon icon="lockClosed" type="outline" size="large" color="dark400" />
      <Box>
        <Text variant="h3" as="h2" marginBottom={1}>
          {formatMessage(m.stepUpTitle)}
        </Text>
        <Text>{formatMessage(m.stepUpIntro)}</Text>
      </Box>

      {notice && (
        <Box width="full" textAlign="left">
          <AlertMessage type={notice.type} message={notice.message} />
        </Box>
      )}

      {state.name === 'waiting' && (
        <Box
          width="full"
          display="flex"
          flexDirection="column"
          rowGap={2}
          aria-live="polite"
        >
          <Box background="blue100" borderRadius="large" paddingY={3}>
            <Text variant="h1" as="p" color="blue600">
              {state.code}
            </Text>
          </Box>
          <Text fontWeight="semiBold">
            {formatMessage(
              state.method === 'app' ? m.stepUpWaitingApp : m.stepUpWaitingSim,
            )}
          </Text>
          <Text variant="small" color="dark300">
            {formatMessage(m.stepUpTimeLeft, {
              minutes: Math.floor(secondsLeft / 60),
              seconds: String(secondsLeft % 60).padStart(2, '0'),
            })}
          </Text>
          {switchMethod}
        </Box>
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

      {state.name === 'idle' && switchMethod}
    </Box>
  )
}
