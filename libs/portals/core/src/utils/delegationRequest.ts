export const DELEGATION_REQUEST_PATH = '/umbod/bidja'
export const DELEGATION_REQUEST_SCOPES_PARAM = 'scopes'
export const DELEGATION_REQUEST_GRANTOR_KEY = 'delegationRequestGrantor'

export const getDelegationRequestPath = (scopes?: string[]): string => {
  if (!scopes?.length) {
    return DELEGATION_REQUEST_PATH
  }

  const params = new URLSearchParams({
    [DELEGATION_REQUEST_SCOPES_PARAM]: scopes.join(','),
  })

  return `${DELEGATION_REQUEST_PATH}?${params.toString()}`
}
