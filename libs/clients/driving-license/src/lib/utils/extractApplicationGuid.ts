// RLS returns the new application's guid on a successful v6 create, but not in a
// stable, documented place: the full-licence endpoint sends it as the (text)
// body, and the temporary endpoint carries it under a field the generated DTO
// drops. Pull it out defensively — purely for logging/reconciliation, so it must
// never throw and returns null when nothing guid-shaped is present.
export const extractApplicationGuid = (body: unknown): string | null => {
  const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

  if (typeof body === 'string') {
    return body.match(UUID)?.[0] ?? null
  }

  if (body && typeof body === 'object') {
    const rec = body as Record<string, unknown>
    for (const key of ['guid', 'applicationGuid', 'applicationId']) {
      const value = rec[key]
      if (typeof value === 'string' && UUID.test(value)) {
        return value
      }
    }
    try {
      return JSON.stringify(body).match(UUID)?.[0] ?? null
    } catch {
      // JSON.stringify throws on circular structures; the contract is never to.
      return null
    }
  }

  return null
}
