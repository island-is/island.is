import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  AlertMessage,
  Box,
  Button,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'

import { m } from '../translations.strings'
import type { MessengerStatus } from './useZendeskMessenger'
import * as styles from './ChatLauncher.css'

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
  const composerRef = useRef<HTMLTextAreaElement>(null)

  // The launcher stays mounted underneath the conversation, so returning to it
  // from an open chat has to hand the caret back to the question box. Only the
  // return is focused, not the first render, so the page does not open with the
  // mobile keyboard up.
  const wasVisible = useRef(isVisible)
  useEffect(() => {
    if (isVisible && !wasVisible.current) {
      composerRef.current?.focus()
    }
    wasVisible.current = isVisible
  }, [isVisible])

  const isReady = status === 'ready'
  const canSubmit = isReady && !isStarting && Boolean(value.trim())

  const submit = (question: string) => {
    if (!isReady || isStarting || !question.trim()) return
    setValue('')
    onAsk(question.trim())
  }

  return (
    <Box
      className={styles.content}
      paddingX={[3, 3, 5, 6]}
      paddingY={[4, 4, 6]}
    >
      <Stack space={4}>
        <Text variant="h1" as="h1">
          {formatMessage(m.heading)}
        </Text>

        <Stack space={2}>
          <Input
            name="budget-bill-question"
            ref={composerRef}
            textarea
            rows={4}
            label={formatMessage(m.inputLabel)}
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

          <Box display="flex" justifyContent="flexEnd">
            <Button
              icon="arrowForward"
              loading={isStarting}
              disabled={!canSubmit}
              onClick={() => submit(value)}
            >
              {formatMessage(m.send)}
            </Button>
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
