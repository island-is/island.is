import { ApolloError } from '@apollo/client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { Image, SafeAreaView, ScrollView } from 'react-native'
import { Passkey } from 'react-native-passkey'
import styled, { useTheme } from 'styled-components/native'

import {
  StepUpMethod,
  StepUpStatus,
  useStepUpReopenWithPasskeyMutation,
  useStepUpStartMutation,
  useStepUpStatusMutation,
} from '@/graphql/types/schema'
import { useGetPasskeyAssertion } from '@/lib/passkeys/useGetPasskeyAssertion'
import {
  clearLockScreenSuppression,
  suppressLockScreen,
} from '@/stores/auth-store'
import { usePreferencesStore } from '@/stores/preferences-store'
import { Alert, Button, Typography } from '@/ui'

const TOO_MANY_ATTEMPTS = 'STEP_UP_TOO_MANY_ATTEMPTS'

type Notice =
  | 'denied'
  | 'timed_out'
  | 'too_many_attempts'
  | 'failed'
  | 'passkey_failed'

type State =
  | { name: 'idle'; notice?: Notice }
  | { name: 'starting' }
  | { name: 'reopening' }
  | {
      name: 'waiting'
      method: StepUpMethod
      code?: string | null
      deadline: number
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
  passkey_failed: { type: 'warning', id: 'stepUp.passkeyFailed' },
}

const isTooManyAttempts = (error: unknown) =>
  error instanceof ApolloError &&
  error.graphQLErrors.some((e) => e.extensions?.code === TOO_MANY_ATTEMPTS)

/**
 * Shown in place of a locked area. One button, a code, and the person approves
 * on their own phone, by the method they logged in with (the Auðkenni app, or
 * their own SIM). There is deliberately no way to choose another method or send
 * it anywhere else.
 *
 * Locked for want of use, within a while of the last electronic ID unlock, the
 * passkey will do instead: the server checks the Face ID or fingerprint, so
 * it is asked for straight away. If it fails, electronic ID it is.
 */
export function StepUpLock({
  canReopenWithPasskey,
  onUnlocked,
}: {
  canReopenWithPasskey: boolean
  onUnlocked(): void
}) {
  const intl = useIntl()
  const theme = useTheme()
  const { hasCreatedPasskey } = usePreferencesStore()
  const [passkeyFailed, setPasskeyFailed] = useState(false)
  const offerPasskey =
    canReopenWithPasskey &&
    hasCreatedPasskey &&
    !passkeyFailed &&
    Passkey.isSupported()
  const [state, setState] = useState<State>({ name: 'idle' })
  const [secondsLeft, setSecondsLeft] = useState(0)
  const pollTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const unmounted = useRef(false)

  const [startStepUp] = useStepUpStartMutation()
  const [checkStepUp] = useStepUpStatusMutation()
  const [reopenStepUp] = useStepUpReopenWithPasskeyMutation()
  const { getPasskeyAssertion } = useGetPasskeyAssertion()

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

  const begin = useCallback(async () => {
    clearTimeout(pollTimer.current)
    setState({ name: 'starting' })

    try {
      const res = await startStepUp()
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
      })
      poll(started.stepUpId, started.interval)
    } catch (error) {
      setState({
        name: 'idle',
        notice: isTooManyAttempts(error) ? 'too_many_attempts' : 'failed',
      })
    }
  }, [startStepUp, poll])

  const reopen = useCallback(async () => {
    setState({ name: 'reopening' })

    let notice: Notice | undefined
    try {
      const passkey = await getPasskeyAssertion()
      if (passkey) {
        const res = await reopenStepUp({ variables: { passkey } })
        if (res.data?.stepUpReopenWithPasskey) {
          onUnlocked()
          return
        }
      }
      // Cancelled by the person: no notice, the passkey stays on offer.
      notice = passkey ? 'passkey_failed' : undefined
    } catch (error) {
      notice = isTooManyAttempts(error) ? 'too_many_attempts' : 'passkey_failed'
    }

    if (unmounted.current) {
      return
    }
    if (notice) {
      setPasskeyFailed(true)
    }
    setState({ name: 'idle', notice })
  }, [getPasskeyAssertion, reopenStepUp, onUnlocked])

  // Asked for straight away, as the phone's own lock would.
  const askedForPasskey = useRef(false)
  useEffect(() => {
    if (offerPasskey && !askedForPasskey.current) {
      askedForPasskey.current = true
      void reopen()
    }
  }, [offerPasskey, reopen])

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
            {intl.formatMessage({
              id: offerPasskey ? 'stepUp.introPasskey' : 'stepUp.intro',
            })}
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
            </Full>
          )}

          {offerPasskey &&
            (state.name === 'idle' || state.name === 'reopening') && (
              <Full>
                <Button
                  title={intl.formatMessage({ id: 'stepUp.reopenWithPasskey' })}
                  onPress={() => void reopen()}
                  loading={state.name === 'reopening'}
                  disabled={state.name === 'reopening'}
                />
              </Full>
            )}

          {(state.name === 'idle' || state.name === 'starting') && (
            <Full>
              <Button
                title={intl.formatMessage({ id: 'stepUp.start' })}
                onPress={() => void begin()}
                loading={state.name === 'starting'}
                disabled={state.name === 'starting'}
                isOutlined={offerPasskey}
              />
            </Full>
          )}
        </Content>
      </ScrollView>
    </Host>
  )
}
