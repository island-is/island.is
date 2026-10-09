import type { ApolloCache } from '@apollo/client'

/**
 * Root fields whose data sits behind a locked area. Their results are removed
 * from the cache when the area locks, so nothing is left to show — on screen,
 * or in the cache persisted to the device — until the person unlocks again.
 */
const LOCKED_FIELD_PREFIXES = [
  'healthDirectorate',
  'rightsPortal',
  'questionnaires',
]

export const evictLockedData = (cache: ApolloCache<unknown>) => {
  cache.modify({
    id: 'ROOT_QUERY',
    fields: (value, { fieldName, DELETE }) =>
      LOCKED_FIELD_PREFIXES.some((prefix) => fieldName.startsWith(prefix))
        ? DELETE
        : value,
  })
  cache.gc()
}
