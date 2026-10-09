/** A single scope held pending confirmation. */
export interface ConfirmationScope {
  name: string
  displayName: string
  validTo: string
}

/**
 * The grant exactly as it was presented to the grantor. This is what
 * `contentHash` is computed over and what the receipt renders, so it must
 * never be re-derived from current state after the fact.
 */
export interface ConfirmationContentSnapshot {
  /** Snapshot format version, so a future format change stays verifiable. */
  version: 1
  fromNationalId: string
  toNationalId: string
  toName: string
  domainName: string | null
  domainDisplayName: string | null
  scopes: ConfirmationScope[]
  requestedAt: string
  locale: string
  /**
   * The text shown in the Auðkenni app when the grantor confirms. Part of the
   * snapshot so `contentHash` covers what the phone displayed, not only what the
   * screen did.
   */
  bindingMessage: string
}
