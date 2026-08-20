import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'

import {
  AlertMessage,
  Box,
  Button,
  Inline,
  LoadingDots,
  Stack,
  Tag,
  Text,
  VisuallyHidden,
} from '@island.is/island-ui/core'

import type { ZendeskConversation } from '../../../components/ChatPanel/ZendeskChatPanel/types'
import { m } from '../translations.strings'
import { ConversationList } from './ConversationList'
import type { MessengerStatus } from './useZendeskMessenger'
import * as styles from './ChatLauncher.css'

const MAX_COMPOSER_HEIGHT_PX = 200

interface ChatLauncherProps {
  conversations: ZendeskConversation[]
  isLoadingConversations: boolean
  /** True while a conversation is being created for the question just asked */
  isStarting: boolean
  status: MessengerStatus
  onAsk: (question: string) => void
  onSelectConversation: (conversationId: string) => void
}

export const ChatLauncher = ({
  conversations,
  isLoadingConversations,
  isStarting,
  status,
  onAsk,
  onSelectConversation,
}: ChatLauncherProps) => {
  const { formatMessage } = useIntl()
  const [value, setValue] = useState('')
  const composerRef = useRef<HTMLTextAreaElement>(null)

  // The textarea starts at one line and grows with the question, the way the
  // composer inside the chat does.
  useEffect(() => {
    const composer = composerRef.current
    if (!composer) return
    composer.style.height = 'auto'
    composer.style.height = `${Math.min(
      composer.scrollHeight,
      MAX_COMPOSER_HEIGHT_PX,
    )}px`
  }, [value])

  const isReady = status === 'ready'
  const canSubmit = isReady && !isStarting && Boolean(value.trim())

  const submit = (question: string) => {
    if (!isReady || isStarting || !question.trim()) return
    setValue('')
    onAsk(question.trim())
  }

  const suggestions = [m.suggestionOne, m.suggestionTwo, m.suggestionThree]

  return (
    <Box
      className={styles.content}
      paddingX={[3, 3, 5, 6]}
      paddingY={[4, 4, 6]}
    >
      <Box className={styles.columns}>
        <Stack space={4}>
          <Stack space={2}>
            <Text variant="eyebrow" color="blue400">
              {formatMessage(m.eyebrow)}
            </Text>
            <Text variant="h1" as="h1">
              {formatMessage(m.heading)}
            </Text>
            <Text variant="intro" color="dark400">
              {formatMessage(m.intro)}
            </Text>
          </Stack>

          <Stack space={2}>
            <Box className={styles.composer}>
              <VisuallyHidden>
                <label htmlFor="budget-bill-question">
                  {formatMessage(m.inputLabel)}
                </label>
              </VisuallyHidden>
              <textarea
                id="budget-bill-question"
                ref={composerRef}
                rows={1}
                className={styles.composerInput}
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
              {isStarting ? (
                <Box paddingX={2} paddingY={1}>
                  <LoadingDots />
                </Box>
              ) : (
                <Button
                  circle
                  icon="arrowForward"
                  aria-label={formatMessage(m.send)}
                  disabled={!canSubmit}
                  onClick={() => submit(value)}
                />
              )}
            </Box>

            {status === 'error' ? (
              <AlertMessage
                type="warning"
                title={formatMessage(m.chatErrorTitle)}
                message={formatMessage(m.chatErrorMessage)}
              />
            ) : (
              <Text variant="small" color="dark400">
                {formatMessage(m.inputHint)}
              </Text>
            )}
          </Stack>

          <Stack space={2}>
            <Text variant="eyebrow" color="dark400">
              {formatMessage(m.suggestionsTitle)}
            </Text>
            <Inline space={1}>
              {suggestions.map((suggestion) => (
                <Tag
                  key={suggestion.id}
                  outlined
                  textLeft
                  disabled={!isReady || isStarting}
                  onClick={() => submit(formatMessage(suggestion))}
                >
                  {formatMessage(suggestion)}
                </Tag>
              ))}
            </Inline>
          </Stack>

          <Text variant="small" color="dark400">
            {formatMessage(m.disclaimer)}
          </Text>
        </Stack>

        <Box
          background="white"
          borderRadius="large"
          border="standard"
          borderColor="blue200"
          padding={[2, 2, 3]}
        >
          <Stack space={2}>
            <Text variant="eyebrow" color="dark400">
              {formatMessage(m.previousChatsTitle)}
            </Text>
            <ConversationList
              conversations={conversations}
              isLoading={isLoadingConversations}
              onSelect={onSelectConversation}
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
