import { useEffect, useState } from 'react'
import differenceInMinutes from 'date-fns/differenceInMinutes'

import { Lawyer } from '@island.is/judicial-system/types'

import { useGetLawyers } from '../useLawyers/useLawyers'

export const Database = {
  name: 'lawyer-registry',
  lawyerTable: 'lawyers-table3',
  version: 5,
}

type LawyerWithCreated = Lawyer & { created: Date }

export const useIndexedDB = (databaseName: string, tableName: string) => {
  const [allLawyers, setAllLawyers] = useState<Lawyer[]>([])
  const [shouldFetch, setShouldFetch] = useState<boolean>(false)
  const lawyers = useGetLawyers(shouldFetch)

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
              ? differenceInMinutes(now, records[0].created) > 1
              : true

          if (shouldRefresh) {
            console.log('Refreshing IndexedDB data...')
            setShouldFetch(true)
          } else {
            console.log('Using cached IndexedDB data.')
            setAllLawyers(request.result)
          }
        }

        request.onerror = () => {
          console.error('Failed to access IndexedDB.')
        }
      } catch (e) {
        console.log(e)
      }
    }

    syncData()
  }, [])

  useEffect(() => {
    if (shouldFetch && lawyers.length > 0) {
      refreshData(lawyers)
    }
  }, [shouldFetch, lawyers])

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(
        Database.lawyerTable,
        Database.version,
      )

      request.onupgradeneeded = () => {
        const db = request.result
        const objectStore = db.createObjectStore(tableName, {
          autoIncrement: true,
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
  }

  const refreshData = async (lawyers: Lawyer[]) => {
    const db = await openDB()
    const transaction = db.transaction(Database.lawyerTable, 'readwrite')
    const store = transaction.objectStore(Database.lawyerTable)
    const now = new Date()

    store.clear()
    setAllLawyers(lawyers)

    lawyers.map((lawyer) => {
      store.add({ ...lawyer, created: now })
    })
  }

  return {
    allLawyers: allLawyers.sort((a: Lawyer, b: Lawyer) =>
      a.name.localeCompare(b.name),
    ),
  }
}
