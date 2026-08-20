const TITLE_MAX_LENGTH = 60

/** Cuts a question down to something that fits on one line as a chat title */
export const toConversationTitle = (question: string) => {
  const trimmed = question.trim().replace(/\s+/g, ' ')
  return trimmed.length > TITLE_MAX_LENGTH
    ? `${trimmed.slice(0, TITLE_MAX_LENGTH - 1).trimEnd()}…`
    : trimmed
}

/**
 * The widget cannot be asked what a conversation is called, so the question a
 * chat was started from is kept here and read back when the page is reloaded
 * into that conversation. Only the most recent chats are worth remembering.
 */
const TITLE_STORAGE_KEY = 'askTheBudgetBill:conversationTitles'
const MAX_STORED_TITLES = 20

const readTitles = (): Record<string, string> => {
  try {
    const stored = window.localStorage.getItem(TITLE_STORAGE_KEY)
    const parsed = stored ? JSON.parse(stored) : null
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    // Storage can be unavailable, or hold something this never wrote
    return {}
  }
}

export const getStoredConversationTitle = (conversationId: string) =>
  readTitles()[conversationId]

export const storeConversationTitle = (
  conversationId: string,
  title: string,
) => {
  try {
    const titles = Object.entries({
      ...readTitles(),
      [conversationId]: title,
    }).slice(-MAX_STORED_TITLES)
    window.localStorage.setItem(
      TITLE_STORAGE_KEY,
      JSON.stringify(Object.fromEntries(titles)),
    )
  } catch {
    // Private browsing refuses storage, the chat falls back to a generic title
  }
}
