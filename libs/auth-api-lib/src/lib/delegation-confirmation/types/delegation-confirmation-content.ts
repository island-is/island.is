export interface ConfirmationScope {
  name: string
  displayName: string
  validTo: string
}

/** What the grantor was shown. contentHash covers it, so never re-derive it from current state. */
export interface ConfirmationContentSnapshot {
  version: 1
  fromNationalId: string
  toNationalId: string
  toName: string
  domainName: string | null
  domainDisplayName: string | null
  scopes: ConfirmationScope[]
  requestedAt: string
  locale: string
  bindingMessage: string
}
