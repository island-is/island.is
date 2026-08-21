const TITLE_MAX_LENGTH = 60

/** Cuts a question down to something that fits on one line as a chat title */
export const toConversationTitle = (question: string) => {
  const trimmed = question.trim().replace(/\s+/g, ' ')
  return trimmed.length > TITLE_MAX_LENGTH
    ? `${trimmed.slice(0, TITLE_MAX_LENGTH - 1).trimEnd()}…`
    : trimmed
}
