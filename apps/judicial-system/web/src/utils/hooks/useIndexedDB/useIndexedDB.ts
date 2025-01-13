import { useEffect, useState } from 'react'

import { Lawyer } from '@island.is/judicial-system/types'

export const Database = {
  name: 'lawyer-registry',
  lawyerTable: 'lawyers-table',
}

export const useIndexedDB = (
  databaseName: string,
  tableName: string,
  lawyers: Lawyer[],
) => {
  const [db, setDB] = useState<IDBDatabase | null>(null)
  const [isDBConnecting, setIsDBConnecting] = useState<boolean>(false)

  useEffect(() => {
    const initDB = () => {
      const request = window.indexedDB.open(databaseName, 3)

      request.onupgradeneeded = () => {
        const db = request.result
        const objectStore = db.createObjectStore(tableName, {
          autoIncrement: true,
          keyPath: 'nationalId',
        })

        objectStore.createIndex('name', 'name', { unique: false })

        objectStore.transaction.oncomplete = () => {
          // Store values in the newly created objectStore.
          const lawyerRegistryObjectStore = db
            .transaction(tableName, 'readwrite')
            .objectStore(tableName)

          lawyers.forEach((lawyer) => {
            lawyerRegistryObjectStore.add(lawyer)
          })
        }
      }

      request.onerror = () => {
        console.error(`IndexedDB error. ${request.error}`)
        setIsDBConnecting(false)
      }

      request.onsuccess = () => {
        setDB(request.result)
        setIsDBConnecting(false)
      }
    }

    if (!db) {
      initDB()
    }
  }, [databaseName, db, tableName, lawyers])

  return { isDBConnecting, db }
}
