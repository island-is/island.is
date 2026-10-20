import { useCallback, useEffect, useState } from 'react'
import differenceInHours from 'date-fns/differenceInHours'

import type { Lawyer } from '@island.is/judicial-system/types'
import { useGetLawyers } from '@island.is/judicial-system-web/src/utils/hooks/useLawyers/useLawyers'

export const Database = {
  lawyerTable: 'lawyers',
  // Bump when the object store changes shape. Version 6 keys the store on the
  // registry row id instead of the national id.
  version: 6,
}

type LawyerWithCreated = Lawyer & { created: Date }

export const useLawyerRegistry = (shouldFetchLawyers: boolean) => {
  const [allLawyers, setAllLawyers] = useState<Lawyer[]>([])
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)
  const lawyers = useGetLawyers(shouldFetch)

  const openDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      let settled = false

      const request = window.indexedDB.open(
        Database.lawyerTable,
        Database.version,
      )

      request.onupgradeneeded = () => {
        const db = request.result

        // The store is rebuilt from scratch on upgrade; it is only a cache.
        if (db.objectStoreNames.contains(Database.lawyerTable)) {
          db.deleteObjectStore(Database.lawyerTable)
        }

        const objectStore = db.createObjectStore(Database.lawyerTable, {
          autoIncrement: false,
          keyPath: 'id',
        })

        objectStore.createIndex('name', 'name', { unique: false })
      }

      // Another tab still holds a connection at an older version, so the
      // upgrade waits until that tab closes. Give up on the cache rather than
      // keep the lawyer list empty for as long as that takes.
      request.onblocked = () => {
        settled = true
        console.warn('IndexedDB upgrade blocked by another open connection')
        reject(new Error('IndexedDB upgrade blocked'))
      }

      request.onsuccess = () => {
        const db = request.result

        // Let a newer tab upgrade the database instead of blocking it.
        db.onversionchange = () => db.close()

        if (settled) {
          db.close()
          return
        }

        settled = true
        console.log('Connected to IndexedDB')
        resolve(db)
      }

      request.onerror = () => {
        settled = true
        console.error('Failed to connect to IndexedDB')
        reject(request.error)
      }
    })
  }, [])

  const refreshData = useCallback(
    async (lawyers: Lawyer[]) => {
      setAllLawyers(lawyers)

      try {
        const db = await openDB()
        const transaction = db.transaction(Database.lawyerTable, 'readwrite')
        const store = transaction.objectStore(Database.lawyerTable)
        const now = new Date()

        transaction.oncomplete = () => db.close()
        transaction.onabort = () => db.close()

        store.clear()
        lawyers.forEach((lawyer) => store.put({ ...lawyer, created: now }))
      } catch (e) {
        console.log(e)
      }
    },
    [openDB],
  )

  useEffect(() => {
    const syncData = async () => {
      try {
        const db = await openDB()
        const transaction = db.transaction(Database.lawyerTable, 'readonly')
        const store = transaction.objectStore(Database.lawyerTable)
        const request = store.getAll()

        transaction.oncomplete = () => db.close()
        transaction.onabort = () => db.close()

        request.onsuccess = () => {
          const records: LawyerWithCreated[] = request.result
          const now = new Date()
          const shouldRefresh =
            records.length > 0
              ? differenceInHours(now, records[0].created) > 0
              : true

          setAllLawyers(request.result)

          if (shouldRefresh) {
            console.log('Refreshing IndexedDB data...')
            setShouldFetch(true)
          } else {
            console.log('Using cached IndexedDB data.')
          }
        }

        request.onerror = () => {
          console.error('Failed to access IndexedDB.')
          setShouldFetch(true)
        }
      } catch (e) {
        // The cache is unavailable; fetch the registry from the API instead.
        console.log(e)
        setShouldFetch(true)
      }
    }

    if (shouldFetchLawyers) {
      syncData()
    }
  }, [shouldFetchLawyers, openDB])

  useEffect(() => {
    if (shouldFetch && lawyers.length > 0) {
      refreshData(lawyers)
    }
  }, [shouldFetch, lawyers, refreshData])

  return {
    allLawyers: allLawyers.sort((a: Lawyer, b: Lawyer) =>
      a.name.localeCompare(b.name),
    ),
  }
}
