import type { BffUser } from '@island.is/shared/types'

export const DELEGATION_REQUEST_PATH = '/umbod/bidja'
export const DELEGATION_REQUEST_SCOPES_PARAM = 'scopes'
const DELEGATION_REQUEST_GRANTOR_KEY = 'delegationRequestGrantor'
const GRANTOR_TTL_MS = 10 * 60 * 1000

export type DelegationRequestGrantor = { nationalId: string; name: string }

type StoredGrantor = DelegationRequestGrantor & {
  requesterNationalId: string
  expiresAt: number
}

export const getDelegationRequestPath = (scopes?: string[]): string => {
  if (!scopes?.length) {
    return DELEGATION_REQUEST_PATH
  }

  const params = new URLSearchParams({
    [DELEGATION_REQUEST_SCOPES_PARAM]: scopes.join(','),
  })

  return `${DELEGATION_REQUEST_PATH}?${params.toString()}`
}

const readStoredGrantor = (): StoredGrantor | null => {
  try {
    const raw = window.sessionStorage.getItem(DELEGATION_REQUEST_GRANTOR_KEY)
    return raw ? (JSON.parse(raw) as StoredGrantor) : null
  } catch {
    return null
  }
}

const isForUser = (stored: StoredGrantor, user?: BffUser | null) =>
  stored.expiresAt > Date.now() &&
  !user?.profile.actor &&
  stored.requesterNationalId === user?.profile.nationalId

export const clearDelegationRequestGrantor = () => {
  try {
    window.sessionStorage.removeItem(DELEGATION_REQUEST_GRANTOR_KEY)
  } catch {
    // noop
  }
}

export const storeDelegationRequestGrantor = (
  grantor: DelegationRequestGrantor,
  requesterNationalId: string,
) => {
  const stored: StoredGrantor = {
    ...grantor,
    requesterNationalId,
    expiresAt: Date.now() + GRANTOR_TTL_MS,
  }
  try {
    window.sessionStorage.setItem(
      DELEGATION_REQUEST_GRANTOR_KEY,
      JSON.stringify(stored),
    )
  } catch {
    // noop
  }
}

export const takeDelegationRequestGrantor = (
  user?: BffUser | null,
): DelegationRequestGrantor | null => {
  const stored = readStoredGrantor()
  clearDelegationRequestGrantor()
  return stored && isForUser(stored, user)
    ? { nationalId: stored.nationalId, name: stored.name }
    : null
}

export const clearStaleDelegationRequestGrantor = (user?: BffUser | null) => {
  const stored = readStoredGrantor()
  if (stored && !isForUser(stored, user)) {
    clearDelegationRequestGrantor()
  }
}
