/**
 * External-data `reason` reaches the client through a GraphQL JSON scalar, so
 * it is untyped at runtime. `DataProviderResult['reason']` documents three
 * shapes — `StaticText`, `ProviderErrorReason`, `ProviderErrorReason[]` — and
 * both `title` and `summary` are themselves `StaticText`, meaning they can be
 * MessageDescriptor objects rather than strings when a provider did not
 * localize server-side.
 *
 * Hence `unknown` in and `string | undefined` out: a descriptor rendered as a
 * React child throws, and `['{title,summary}'].join(', ')` yields
 * "[object Object]". Anything that is not usable text is dropped so the caller
 * falls back to its own generic message.
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

// Same shapes as getProviderErrorMessage, kept as a list rather than joined —
// e.g. DMR returns one entry per invalid row in an uploaded workbook, and
// joining those with ', ' into a single sentence reads worse than a bulleted
// list of what to fix.
export const getProviderErrorMessages = (
  reason: unknown,
): string[] | undefined => {
  if (!reason) return undefined

  const list = Array.isArray(reason) ? reason : [reason]
  const parts = list
    .map(singleReason)
    .filter((part): part is string => Boolean(part))
  return parts.length > 0 ? parts : undefined
}
