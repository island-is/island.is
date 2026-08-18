// Shape a `throwOnError: false` template-api action writes into externalData
// on failure — see templateApiActionRunner.service.ts's buildExternalData.
// `reason` is already localized server-side (via formatMessage using the
// application's locale) before it reaches the client.
export type ActionErrorReason = { title?: string; summary?: string } | string[]

export type ActionExternalData<T> = {
  status?: 'success' | 'failure'
  data?: T
  reason?: ActionErrorReason
}

// DMR's own message when it has one (summary, falling back to title);
// undefined when the action failed without a specific reason, so callers can
// fall back to a generic localized string instead of showing "undefined".
export const getActionErrorMessage = (
  reason: ActionErrorReason | undefined,
): string | undefined => {
  if (!reason) return undefined
  if (Array.isArray(reason)) return reason.join(', ')
  return reason.summary || reason.title
}
