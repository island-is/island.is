export const normalizeSenderId = (senderId: string): string =>
  senderId.replace(/\D/g, '')

/** Matches the sender id validation user-profile applies */
export const isValidSenderId = (normalizedSenderId: string): boolean =>
  /^\d{10}$/.test(normalizedSenderId)

export const toCategoryKey = (senderId: string, category: string): string =>
  `${normalizeSenderId(senderId)}-${category}`

/**
 * Drops senders without a name and sorts the rest alphabetically by name.
 */
export const filterAndSortSenders = <T extends { sender: { id?: string } }>(
  senders: T[],
  titles: Record<string, string | null | undefined>,
): Array<T & { sender: { id?: string; title: string } }> =>
  senders
    .flatMap((s) => {
      const title = titles[s.sender.id ?? '']?.trim()
      return title ? [{ ...s, sender: { ...s.sender, title } }] : []
    })
    .sort((a, b) => a.sender.title.localeCompare(b.sender.title, 'is'))
