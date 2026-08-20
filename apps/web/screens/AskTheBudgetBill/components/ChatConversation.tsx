import type { ReactNode } from 'react'
import { useIntl } from 'react-intl'

import {
  AlertMessage,
  Box,
  Button,
  Inline,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'

import { m } from '../translations.strings'
import type { MessengerStatus } from './useZendeskMessenger'
import * as styles from './ChatConversation.css'

interface ChatConversationProps {
  title: string
  status: MessengerStatus
  /** The always mounted element the Zendesk widget renders itself into */
  children: ReactNode
  onBack: () => void
  onNewChat: () => void
}

/**
 * Full height chat view. The widget's own header is hidden through the
 * customization API, so this supplies the only chrome above the conversation
 * and the visitor sees just the messages and the composer underneath them.
 */
export const ChatConversation = ({
  title,
  status,
  children,
  onBack,
  onNewChat,
}: ChatConversationProps) => {
  const { formatMessage } = useIntl()

  return (
    <>
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
            {title}
          </Text>
        </Box>
        <Inline space={1} alignY="center" flexWrap="nowrap">
          <Button
            variant="utility"
            preTextIcon="arrowBack"
            preTextIconType="outline"
            onClick={onBack}
          >
            {formatMessage(m.allChats)}
          </Button>
          <Button
            variant="utility"
            preTextIcon="add"
            preTextIconType="outline"
            onClick={onNewChat}
          >
            {formatMessage(m.newChat)}
          </Button>
        </Inline>
      </Box>

      <Box className={styles.widget}>
        {children}
        {status === 'loading' && (
          <Box className={styles.loadingOverlay}>
            <LoadingDots size="large" />
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
    </>
  )
}
