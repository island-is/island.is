import { createContext, useCallback, useState } from 'react'
import type { EntryProps } from 'contentful-management'
import { useCMA } from '@contentful/react-apps-toolkit'

export const EntryContext = createContext({
  entries: {},
  updateEntry: (_entry: EntryProps) => {
    // Empty function
  },
  fetchEntries: (_entryIds: string[]) => {
    // Empty function
  },
})

export const useEntryContext = () => {
  const [entries, setEntries] = useState({})
  const cma = useCMA()

  const updateEntry = useCallback((entry: EntryProps) => {
    setEntries((prevEntries) => ({ ...prevEntries, [entry.sys.id]: entry }))
  }, [])

  const fetchEntries = useCallback(
    async (entryIds: string[]) => {
      // TODO: fetch more if needed, split up fetches if we are asking for too much data
      const response = await cma.entry.getMany({
        query: {
          'sys.id[in]': entryIds.join(','),
          'sys.archivedVersion[exists]': false,
        },
      })

      const entryMap = new Map(
        response.items.map((entry) => [entry.sys.id, entry]),
      )

      setEntries((prevEntries) => ({
        ...prevEntries,
        ...Object.fromEntries(entryMap),
      }))
    },
    [cma.entry],
  )

  return {
    entries,
    updateEntry,
    fetchEntries,
  }
}
