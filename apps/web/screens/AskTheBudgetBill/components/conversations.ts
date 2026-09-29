const TITLE_MAX_LENGTH = 60

/** Cuts a question down to something that fits on one line as a chat title */
export const toConversationTitle = (question: string) => {
  const trimmed = question.trim().replace(/\s+/g, ' ')
  // Counted and cut by code point rather than by string index, so that a
  // character outside the basic plane, an emoji for instance, is not cut in
  // half into the lone surrogate that would be sent as the conversation name.
  const characters = Array.from(trimmed)
  return characters.length > TITLE_MAX_LENGTH
    ? `${characters
        .slice(0, TITLE_MAX_LENGTH - 1)
        .join('')
        .trimEnd()}…`
    : trimmed
}
