import { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  AlertMessage,
  Box,
  Button,
  Stack,
  Text,
} from '@island.is/island-ui/core'

import { m } from '../translations.strings'
import type { MessengerStatus } from './useZendeskMessenger'
import * as styles from './ChatLauncher.css'

/** The delays the caret is handed back over, see the effect below */
const FOCUS_RETRY_DELAYS_MS = [0, 50, 150, 300, 600]

interface ChatLauncherProps {
  /** True while a conversation is being created for the question just asked */
  isStarting: boolean
  /** False while the launcher sits hidden underneath an open conversation */
  isVisible: boolean
  status: MessengerStatus
  onAsk: (question: string) => void
}

export const ChatLauncher = ({
  isStarting,
  isVisible,
  status,
  onAsk,
}: ChatLauncherProps) => {
  const { formatMessage } = useIntl()
  const [value, setValue] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const composerRef = useRef<HTMLTextAreaElement>(null)

  const focusComposer = useCallback(() => {
    const active = document.activeElement
    // Focus the visitor moved elsewhere within the launcher themselves, onto
    // the send button for instance, is left where it is.
    if (
      active &&
      active !== composerRef.current &&
      rootRef.current?.contains(active)
    ) {
      return
    }
    composerRef.current?.focus({ preventScroll: true })
  }, [])

  // The launcher stays mounted underneath the conversation, so returning to it
  // from an open chat has to hand the caret back to the question box. Only the
  // return is focused, not the first render, so the page does not open with the
  // mobile keyboard up. The widget takes focus into its iframe while the
  // conversation it was showing goes away, so this is retried for a moment
  // rather than done once.
  const wasVisible = useRef(isVisible)
  useEffect(() => {
    const isReturning = isVisible && !wasVisible.current
    wasVisible.current = isVisible
    if (!isReturning) return

    const timeouts = FOCUS_RETRY_DELAYS_MS.map((delay) =>
      window.setTimeout(focusComposer, delay),
    )
    return () => timeouts.forEach(window.clearTimeout)
  }, [isVisible, focusComposer])

  const isReady = status === 'ready'
  const canSubmit = isReady && !isStarting && Boolean(value.trim())

  const submit = (question: string) => {
    if (!isReady || isStarting || !question.trim()) return
    setValue('')
    onAsk(question.trim())
  }

  return (
    <Box
      ref={rootRef}
      className={styles.content}
      paddingX={[3, 3, 5, 6]}
      paddingY={[4, 4, 6]}
    >
      <Stack space={4}>
        <Text variant="h1" as="h1">
          {formatMessage(m.heading)}
        </Text>

        <Stack space={2}>
          <Box className={styles.composer}>
            <textarea
              ref={composerRef}
              className={styles.textarea}
              name="budget-bill-question"
              aria-label={formatMessage(m.inputLabel)}
              placeholder={formatMessage(m.inputPlaceholder)}
              value={value}
              disabled={isStarting}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  submit(value)
                }
              }}
            />

            <Box className={styles.submit}>
              <Button
                circle
                icon="arrowUp"
                title={formatMessage(m.send)}
                loading={isStarting}
                disabled={!canSubmit}
                onClick={() => submit(value)}
              />
            </Box>
          </Box>

          {status === 'error' && (
            <AlertMessage
              type="warning"
              title={formatMessage(m.chatErrorTitle)}
              message={formatMessage(m.chatErrorMessage)}
            />
          )}
        </Stack>

        <Text variant="small" color="dark400">
          {formatMessage(m.disclaimer)}
        </Text>
      </Stack>
    </Box>
  )
}
