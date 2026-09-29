import type { ReactNode } from 'react'
import { useIntl } from 'react-intl'

import {
  AlertMessage,
  Box,
  Button,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'

import { m } from '../translations.strings'
import type { MessengerStatus } from './useZendeskMessenger'
import * as styles from './ChatConversation.css'

interface ChatConversationProps {
  status: MessengerStatus
  /**
   * True between the question being asked and its conversation opening, since
   * the swap into the chat happens the moment the question is sent.
   */
  isStarting: boolean
  /** The always mounted element the Zendesk widget renders itself into */
  children: ReactNode
  /** Clears the open conversation and returns to the question box */
  onNewChat: () => void
}

/**
 * Full height chat view. The widget's own header is hidden through the
 * customization API, so this supplies the only chrome above the conversation
 * and the visitor sees just the messages and the composer underneath them.
 */
export const ChatConversation = ({
  status,
  isStarting,
  children,
  onNewChat,
}: ChatConversationProps) => {
  const { formatMessage } = useIntl()

  const isLoading = status === 'idle' || status === 'loading' || isStarting

  // Once the widget is up, the question asked is on its way to becoming a
  // conversation that the page opens as soon as it lands. Resetting in the
  // middle of that would be undone the moment it does, so the reset waits it
  // out. Before the widget is up, and once it has failed, nothing is on its
  // way and returning to the question box stands.
  const isConversationPending = isStarting && status === 'ready'

  return (
    <Box className={styles.conversation}>
      <Box
        className={styles.topBar}
        paddingX={[2, 3, 4]}
        paddingY={[1, 1, 2]}
        display="flex"
        alignItems="center"
        justifyContent="spaceBetween"
        columnGap={2}
      >
        <Box className={styles.title}>
          <Text variant="h5" as="h1" truncate>
            {formatMessage(m.heading)}
          </Text>
        </Box>
        <Button
          variant="utility"
          preTextIcon="add"
          preTextIconType="outline"
          disabled={isConversationPending}
          onClick={onNewChat}
        >
          {formatMessage(m.newChat)}
        </Button>
      </Box>

      <Box className={styles.widget}>
        {children}
        {status !== 'error' && isLoading && (
          <Box className={styles.loadingOverlay}>
            <LoadingDots size="small" />
          </Box>
        )}
        {status === 'error' && (
          <Box className={styles.loadingOverlay} padding={[2, 3, 4]}>
            <AlertMessage
              type="warning"
              title={formatMessage(m.chatErrorTitle)}
              message={formatMessage(m.chatErrorMessage)}
            />
          </Box>
        )}
      </Box>

      <Box className={styles.footer} paddingX={[2, 3, 4]} paddingY={1}>
        <Text variant="small" color="dark400" textAlign="center">
          {formatMessage(m.disclaimer)}
        </Text>
      </Box>
    </Box>
  )
}
