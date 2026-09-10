/**
 * Shape of one entry in an `externalData` bag, whether it is read off the
 * application or off an `updateApplicationExternalData` response — the template
 * API runner writes both the same way.
 */
export type ProviderExternalData<T> = {
  status?: 'success' | 'failure'
  data?: T
  reason?: unknown
}

/**
 * Only a `success` entry carries a usable payload. The runner writes
 * `data: {}` next to `status: 'failure'`, so `entry.data` is truthy even for a
 * provider that failed — reading it without checking the status hands the
 * caller an empty bag masquerading as a result.
 *
 * A mutation naming several providers reports each status independently: the
 * `updateExternalData` endpoint runs them and returns, never applying the
 * `throwOnError` flag the state-transition paths honour. Partial success is
 * therefore normal on that path and every entry has to be judged on its own.
 */
export const getProviderSuccessData = <T>(
  entry?: ProviderExternalData<T>,
): T | undefined => (entry?.status === 'success' ? entry.data : undefined)
