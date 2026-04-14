import type { StoreApi } from 'zustand'

// Late-bound reference to the auth store, set by auth-store.ts after creation.
// This breaks the circular dependency between graphql/client.ts and auth-store.ts.
let ref: StoreApi<any> | null = null

export function setAuthStoreRef(store: StoreApi<any>) {
  ref = store
}

export function getAuthStoreRef(): StoreApi<any> {
  if (!ref) {
    throw new Error('Auth store ref not set')
  }
  return ref
}
