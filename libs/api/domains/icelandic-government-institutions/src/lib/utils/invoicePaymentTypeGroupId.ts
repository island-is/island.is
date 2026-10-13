import { createHash } from 'crypto'

/**
 * A payment type group has no identifier of its own upstream — only a name and
 * the codes it covers. This fingerprints both so the id is stable for identical
 * content and changes when the group's content does, which is all a cache key
 * needs. It is deliberately not something the API can be queried by: `lookup`
 * matches the underlying codes, not this id.
 */
export const buildInvoicePaymentTypeGroupId = (
  name: string,
  codes: string[],
): string =>
  createHash('sha256')
    .update(JSON.stringify({ name, codes: [...codes].sort() }))
    .digest('hex')
    .slice(0, 12)
