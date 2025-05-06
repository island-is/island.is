import { useCallback, useEffect, useState } from 'react'
import differenceInHours from 'date-fns/differenceInHours'

import { Lawyer } from '@island.is/judicial-system/types'

import { useGetLawyers } from '../useLawyers/useLawyers'

export const Database = {
  lawyerTable: 'lawyers',
  version: 5,
}

type LawyerWithCreated = Lawyer & { created: Date }

export const useLawyerRegistry = (shouldFetchLawyers: boolean) => {
  const [allLawyers, setAllLawyers] = useState<Lawyer[]>([])
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)
  const lawyers = useGetLawyers(shouldFetch)

  const openDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(
        Database.lawyerTable,
        Database.version,
      )

      request.onupgradeneeded = () => {
        const db = request.result
        const objectStore = db.createObjectStore(Database.lawyerTable, {
          autoIncrement: false,
          keyPath: 'nationalId',
        })

        objectStore.createIndex('name', 'name', { unique: false })
      }

      request.onsuccess = () => {
        console.log('Connected to IndexedDB')
        resolve(request.result)
      }

      request.onerror = () => {
        console.error('Failed to connect to IndexedDB')
        reject(request.error)
      }
    })
  }, [])

  const refreshData = useCallback(
    async (lawyers: Lawyer[]) => {
      const db = await openDB()
      const transaction = db.transaction(Database.lawyerTable, 'readwrite')
      const store = transaction.objectStore(Database.lawyerTable)
      const now = new Date()

      store.clear()
      setAllLawyers(lawyers)

      lawyers.forEach((lawyer) => store.add({ ...lawyer, created: now }))
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
        }
      } catch (e) {
        console.log(e)
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
