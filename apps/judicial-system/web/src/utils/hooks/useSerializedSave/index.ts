import { useCallback, useRef } from 'react'

interface Entry<V> {
  // Settles when every save queued so far for the key has settled
  chain: Promise<unknown>
  // How many saves are queued or in flight
  pending: number
  // The value the server is known to hold
  confirmed: V
  // The id of the most recently queued save
  latest: number
}

export interface SerializedSaveOptions<V> {
  /** Groups the saves that write the same thing - a field, a party's row */
  key: string
  /**
   * The value the server holds before this save, read before the optimistic
   * update is applied. Only the first save of a key uses it - from then on the
   * hook tracks what the server has itself.
   */
  confirmed: V
  /** The value this save writes */
  value: V
  /** Persists the value; resolves to whether it was saved */
  persist: () => Promise<boolean>
  /** Puts the working state back to the last value the server confirmed */
  rollback: (confirmed: V) => void
}

/**
 * Coordinates the optimistic saves of one value so the UI never ends up
 * claiming a value the server does not have.
 *
 * Saves for the same key run one at a time in the order they were queued, so
 * the server ends up with the last value the user chose rather than with
 * whichever request happened to land last. When a save fails the working state
 * is rolled back to the last value the server confirmed - but only if no newer
 * save for the key is queued behind it, since that save will decide the
 * outcome. Two quick changes that both fail therefore end at the confirmed
 * value, not at the first, never-saved one.
 *
 * Resolves to whether the save succeeded and is still the latest for its key,
 * which is when dependent work (derived text, callbacks) should run.
 */
const useSerializedSave = <V>() => {
  const entries = useRef<Record<string, Entry<V>>>({})

  return useCallback(
    ({
      key,
      confirmed,
      value,
      persist,
      rollback,
    }: SerializedSaveOptions<V>) => {
      const entry = (entries.current[key] ??= {
        chain: Promise.resolve(),
        pending: 0,
        confirmed,
        latest: 0,
      })
      const id = ++entry.latest

      const runSave = async () => {
        try {
          let saved = false

          try {
            saved = await persist()
          } catch {
            // A throwing persist is a failed save
          }

          const isLatest = id === entry.latest

          if (saved) {
            entry.confirmed = value

            return isLatest
          }

          if (isLatest) {
            rollback(entry.confirmed)
          }

          return false
        } finally {
          entry.pending -= 1
        }
      }

      // An idle key starts saving right away - the request goes out on the
      // click, as it did before saves were coordinated - while a busy key
      // queues the save behind the ones already in flight.
      entry.pending += 1
      const run = entry.pending === 1 ? runSave() : entry.chain.then(runSave)
      entry.chain = run

      return run
    },
    [],
  )
}

export default useSerializedSave
