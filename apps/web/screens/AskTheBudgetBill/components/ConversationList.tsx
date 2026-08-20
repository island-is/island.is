import cn from 'classnames'
import { useIntl } from 'react-intl'

import { Box, SkeletonLoader, Stack, Text } from '@island.is/island-ui/core'

import type { ZendeskConversation } from '../../../components/ChatPanel/ZendeskChatPanel/types'
import { m } from '../translations.strings'
import {
  formatConversationTimestamp,
  getConversationTitle,
} from './conversations'
import * as styles from './ConversationList.css'

interface ConversationListProps {
  conversations: ZendeskConversation[]
  activeConversationId?: string
  isLoading: boolean
  onSelect: (conversationId: string) => void
}

export const ConversationList = ({
  conversations,
  activeConversationId,
  isLoading,
  onSelect,
}: ConversationListProps) => {
  const { formatMessage, locale } = useIntl()

  if (isLoading) {
    return (
      <SkeletonLoader height={52} repeat={3} space={1} borderRadius="large" />
    )
  }

  if (conversations.length === 0) {
    return (
      <Text variant="small" color="dark400">
        {formatMessage(m.noPreviousChats)}
      </Text>
    )
  }

  return (
    <Box className={styles.list}>
      <Stack space={1}>
        {conversations.map((conversation) => {
          const timestamp = formatConversationTimestamp(conversation, locale)
          return (
            <button
              key={conversation.id}
              type="button"
              className={cn(styles.item, {
                [styles.itemActive]: conversation.id === activeConversationId,
              })}
              onClick={() => onSelect(conversation.id)}
            >
              <Text variant="medium" color="dark400">
                <span className={styles.itemTitle}>
                  {getConversationTitle(
                    conversation,
                    formatMessage(m.untitledChat),
                  )}
                </span>
              </Text>
              {timestamp && (
                <Text variant="small" color="dark300">
                  {timestamp}
                </Text>
              )}
            </button>
          )
        })}
      </Stack>
    </Box>
  )
}
