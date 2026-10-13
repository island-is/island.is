import type { MessageDescriptor } from 'react-intl'

/** A message from `defineMessages`, which always carries a string id */
type Message = MessageDescriptor & { id: string }

/**
 * The example questions to offer, in the order they are defined.
 *
 * Each question is a string of its own in the CMS, so both the wording and how
 * many questions there are can be changed there. A question the CMS carries is
 * taken as it is written, an empty one included, which is how a question is
 * left off the page: react-intl reads an empty translation as a missing one and
 * would hand back the default wording instead, so the strings are read rather
 * than formatted. Only a question the CMS has nothing at all for falls back to
 * the default in the code.
 */
export const toExampleQuestions = (
  messages: Message[],
  cmsStrings: Record<string, unknown>,
  formatMessage: (message: Message) => string,
): string[] =>
  messages
    .map((message) => {
      const fromCms = cmsStrings[message.id]
      return typeof fromCms === 'string' ? fromCms : formatMessage(message)
    })
    .map((question) => question.trim())
    .filter((question) => question.length > 0)
