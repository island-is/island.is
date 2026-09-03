import { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

import { AlertMessage, Box, Stack, Text } from '@island.is/island-ui/core'
import { MarkdownText } from '@island.is/web/components'

import { exampleQuestionMessages, m } from '../translations.strings'
import { ExampleQuestions } from './ExampleQuestions'
import { QuestionInput } from './QuestionInput'
import { toExampleQuestions } from './questions'
import type { MessengerStatus } from './useZendeskMessenger'
import * as styles from './ChatLauncher.css'

/** The delays the caret is handed back over, see the effect below */
const FOCUS_RETRY_DELAYS_MS = [0, 50, 150, 300, 600]

interface ChatLauncherProps {
  /** False while the launcher sits hidden underneath an open conversation */
  isVisible: boolean
  status: MessengerStatus
  /**
   * Hands the question over and swaps to the chat, which is where the wait for
   * the widget to boot and the conversation to open is shown.
   */
  onAsk: (question: string) => void
}

export const ChatLauncher = ({
  isVisible,
  status,
  onAsk,
}: ChatLauncherProps) => {
  const intl = useIntl()
  const { formatMessage } = intl
  const [value, setValue] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)
  const composerRef = useRef<HTMLInputElement>(null)

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

  const submit = useCallback(
    (question: string) => {
      const trimmed = question.trim()
      // A widget that never came up is not worth swapping into, the error under
      // the box is all there is to show.
      if (status === 'error' || !trimmed) return
      setValue('')
      onAsk(trimmed)
    },
    [status, onAsk],
  )

  const exampleQuestions = toExampleQuestions(
    exampleQuestionMessages,
    intl.messages,
    formatMessage,
  )

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
          <QuestionInput
            ref={composerRef}
            placeholder={formatMessage(m.inputPlaceholder)}
            sendLabel={formatMessage(m.send)}
            value={value}
            onChange={setValue}
            onSubmit={() => submit(value)}
            // A widget that never came up leaves nothing to ask, so the box is
            // closed off rather than taking a question it would drop
            disabled={status === 'error'}
          />

          {status === 'error' && (
            <AlertMessage
              type="warning"
              title={formatMessage(m.chatErrorTitle)}
              message={formatMessage(m.chatErrorMessage)}
            />
          )}
        </Stack>

        {/* The disclaimer is edited in Contentful, so any links it carries are
            written into it as markdown, `[texti](slóð)`, next to the words they
            belong to */}
        <MarkdownText variant="small" color="dark400">
          {formatMessage(m.disclaimer)}
        </MarkdownText>

        {exampleQuestions.length > 0 && (
          // Set apart from the disclaimer, which belongs to the question box
          // above it rather than to the questions
          <Box paddingTop={[1, 1, 2]}>
            <ExampleQuestions
              title={formatMessage(m.exampleQuestionsTitle)}
              questions={exampleQuestions}
              onSelect={submit}
              disabled={status === 'error'}
            />
          </Box>
        )}
      </Stack>
    </Box>
  )
}
