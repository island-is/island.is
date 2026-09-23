/**
 * `reason` arrives through a JSON scalar, so it is untyped: a StaticText, a
 * {title, summary}, or an array of those — and either half can still be a
 * MessageDescriptor, which throws if rendered. Hence `unknown` in, text out,
 * with anything unusable dropped so the caller falls back to its own message.
 */
const asText = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim().length > 0 ? value : undefined

const singleReason = (reason: unknown): string | undefined => {
  const text = asText(reason)
  if (text) return text
  if (!reason || typeof reason !== 'object') return undefined
  const { title, summary } = reason as { title?: unknown; summary?: unknown }
  return asText(summary) ?? asText(title)
}

export const getProviderErrorMessage = (
  reason: unknown,
): string | undefined => {
  if (!reason) return undefined

  if (Array.isArray(reason)) {
    const parts = reason
      .map(singleReason)
      .filter((part): part is string => Boolean(part))
    // An empty join would render an empty alert, so treat it as absent.
    return parts.length > 0 ? parts.join(', ') : undefined
  }

  return singleReason(reason)
}
