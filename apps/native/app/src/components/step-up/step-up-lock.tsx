import { ApolloError } from '@apollo/client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Image, SafeAreaView, ScrollView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import {
  StepUpMethod,
  StepUpStatus,
  useStepUpStartMutation,
  useStepUpStatusMutation,
} from '@/graphql/types/schema'
import {
  clearLockScreenSuppression,
  suppressLockScreen,
} from '@/stores/auth-store'
import { Alert, Button, Typography } from '@/ui'

const TOO_MANY_ATTEMPTS = 'STEP_UP_TOO_MANY_ATTEMPTS'

type Notice = 'denied' | 'timed_out' | 'too_many_attempts' | 'failed'

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

const Host = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.shade.background};
`

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]}px;
  gap: ${({ theme }) => theme.spacing[3]}px;
`

const CodeBox = styled.View`
  align-self: stretch;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.spacing[3]}px;
  border-radius: ${({ theme }) => theme.border.radius.large};
  background-color: ${({ theme }) => theme.color.blue100};
`

const Full = styled.View`
  align-self: stretch;
`

const notices: Record<Notice, { type: 'warning' | 'error'; id: string }> = {
  denied: { type: 'warning', id: 'stepUp.denied' },
  timed_out: { type: 'warning', id: 'stepUp.timedOut' },
  too_many_attempts: { type: 'warning', id: 'stepUp.tooManyAttempts' },
  failed: { type: 'error', id: 'stepUp.failed' },
}

/**
 * Shown in place of a locked area. One button, a code, and the person approves
 * on their own phone. The server decides how to reach them from the way they
 * logged in (the Auðkenni app, or their own SIM); they can switch to the other
 * one if the server offers it. There is deliberately no way to send it anywhere
 * else.
 */
export function StepUpLock({ onUnlocked }: { onUnlocked(): void }) {
  const intl = useIntl()
  const theme = useTheme()
  const [state, setState] = useState<State>({ name: 'idle' })
  const [secondsLeft, setSecondsLeft] = useState(0)
  const pollTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const unmounted = useRef(false)

  const [startStepUp] = useStepUpStartMutation()
  const [checkStepUp] = useStepUpStatusMutation()

  useEffect(() => {
    unmounted.current = false
    return () => {
      unmounted.current = true
      clearTimeout(pollTimer.current)
      clearLockScreenSuppression()
    }
  }, [])

  const poll = useCallback(
    (stepUpId: string, interval: number) => {
      clearTimeout(pollTimer.current)
      pollTimer.current = setTimeout(async () => {
        let status: StepUpStatus
        try {
          const res = await checkStepUp({ variables: { stepUpId } })
          status = res.data?.stepUpStatus ?? StepUpStatus.Pending
        } catch {
          // A failed check is not an answer. Try again at the next interval.
          status = StepUpStatus.Pending
        }

        if (unmounted.current) {
          return
        }

        switch (status) {
          case StepUpStatus.Pending:
            poll(stepUpId, interval)
            return
          case StepUpStatus.Confirmed:
            clearLockScreenSuppression()
            onUnlocked()
            return
          case StepUpStatus.Denied:
            clearLockScreenSuppression()
            setState({ name: 'idle', notice: 'denied' })
            return
          default:
            clearLockScreenSuppression()
            setState({ name: 'idle', notice: 'timed_out' })
        }
      }, interval * 1000)
    },
    [checkStepUp, onUnlocked],
  )

  const begin = useCallback(
    async (method?: StepUpMethod) => {
      clearTimeout(pollTimer.current)
      setState({ name: 'starting' })

      try {
        const res = await startStepUp({ variables: { method } })
        const started = res.data?.stepUpStart
        if (!started) {
          throw new Error('No step-up started')
        }
        if (unmounted.current) {
          return
        }

        // The person may switch to the Auðkenni app on this phone to approve;
        // coming back shouldn't ask for the PIN on top of it.
        suppressLockScreen()

        setState({
          name: 'waiting',
          method: started.method,
          code: started.verificationCode,
          deadline: Date.now() + started.expiresIn * 1000,
          availableMethods: started.availableMethods,
        })
        poll(started.stepUpId, started.interval)
      } catch (error) {
        const tooMany =
          error instanceof ApolloError &&
          error.graphQLErrors.some(
            (e) => e.extensions?.code === TOO_MANY_ATTEMPTS,
          )
        setState({
          name: 'idle',
          notice: tooMany ? 'too_many_attempts' : 'failed',
        })
      }
    },
    [startStepUp, poll],
  )

  // Countdown shown while waiting. The server decides when it has expired;
  // this is only for the person's benefit.
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

  const notice =
    state.name === 'idle' && state.notice ? notices[state.notice] : undefined

  // The other way of reaching the person, if the server offers one: e.g. their
  // SIM isn't at hand.
  const otherMethod =
    state.name === 'waiting'
      ? state.availableMethods.find((method) => method !== state.method)
      : undefined

  return (
    <Host>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Content>
          <Image
            source={require('@/assets/icons/lock.png')}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
          <Typography variant="heading3" textAlign="center">
            {intl.formatMessage({ id: 'stepUp.title' })}
          </Typography>
          <Typography textAlign="center">
            {intl.formatMessage({ id: 'stepUp.intro' })}
          </Typography>

          {notice && (
            <Full>
              <Alert
                type={notice.type}
                message={intl.formatMessage({ id: notice.id })}
                hasBorder
              />
            </Full>
          )}

          {state.name === 'waiting' && (
            <Full accessibilityLiveRegion="polite">
              <CodeBox>
                <Typography variant="heading1" color={theme.color.blue600}>
                  {state.code}
                </Typography>
              </CodeBox>
              <Typography
                variant="heading5"
                textAlign="center"
                style={{ marginTop: 16 }}
              >
                {intl.formatMessage({
                  id:
                    state.method === StepUpMethod.Sim
                      ? 'stepUp.waitingSim'
                      : 'stepUp.waitingApp',
                })}
              </Typography>
              <Typography
                variant="body3"
                textAlign="center"
                style={{ marginTop: 8 }}
              >
                {intl.formatMessage(
                  { id: 'stepUp.timeLeft' },
                  {
                    minutes: Math.floor(secondsLeft / 60),
                    seconds: String(secondsLeft % 60).padStart(2, '0'),
                  },
                )}
              </Typography>
              {otherMethod && (
                <Button
                  isOutlined
                  style={{ marginTop: 24 }}
                  title={intl.formatMessage({
                    id:
                      otherMethod === StepUpMethod.App
                        ? 'stepUp.useApp'
                        : 'stepUp.useSim',
                  })}
                  onPress={() => void begin(otherMethod)}
                />
              )}
            </Full>
          )}

          {(state.name === 'idle' || state.name === 'starting') && (
            <Full>
              <Button
                title={intl.formatMessage({ id: 'stepUp.start' })}
                onPress={() => void begin()}
                loading={state.name === 'starting'}
                disabled={state.name === 'starting'}
              />
            </Full>
          )}
        </Content>
      </ScrollView>
    </Host>
  )
}
