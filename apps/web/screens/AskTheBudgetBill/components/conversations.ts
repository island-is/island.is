import type { ZendeskConversation } from '../../../components/ChatPanel/ZendeskChatPanel/types'

const TITLE_MAX_LENGTH = 60

/** Cuts a question down to something that fits on one line in the history list */
export const toConversationTitle = (question: string) => {
  const trimmed = question.trim().replace(/\s+/g, ' ')
  return trimmed.length > TITLE_MAX_LENGTH
    ? `${trimmed.slice(0, TITLE_MAX_LENGTH - 1).trimEnd()}…`
    : trimmed
}

/**
 * Conversations started from this page carry the question as their display
 * name, but ones started before that, or from another entry point, do not. For
 * those the first message is used instead.
 */
export const getConversationTitle = (
  conversation: ZendeskConversation,
  fallback: string,
) => {
  if (conversation.displayName) return conversation.displayName

  const firstMessage = conversation.messages?.find((message) =>
    Boolean(message.text?.trim()),
  )
  if (firstMessage?.text) return toConversationTitle(firstMessage.text)

  return fallback
}

/**
 * Zendesk reports timestamps in seconds. Today's conversations are shown as a
 * time and older ones as a date, the way a chat history usually reads.
 */
export const formatConversationTimestamp = (
  conversation: ZendeskConversation,
  locale: string,
) => {
  const seconds = conversation.lastUpdatedAt
  if (!seconds) return null

  const date = new Date(seconds * 1000)
  if (Number.isNaN(date.getTime())) return null

  const isToday = date.toDateString() === new Date().toDateString()

  return new Intl.DateTimeFormat(
    locale,
    isToday
      ? { hour: '2-digit', minute: '2-digit' }
      : { day: 'numeric', month: 'short' },
  ).format(date)
}
