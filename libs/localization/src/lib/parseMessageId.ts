export function parseMessageId(id: string) {
  const namespace = id.substring(0, id.lastIndexOf(':'))
  const messageId = id.substring(id.lastIndexOf(':') + 1, id.length)

  return { namespace, messageId }
}
