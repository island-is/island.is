import { useEffect, useState } from 'react'

import { Lawyer } from '@island.is/judicial-system/types'

export const Database = {
  name: 'lawyer-registry',
  lawyerTable: 'db1',
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
      console.info(`Init IndexedDB`)
      console.log(lawyers)

      const request = window.indexedDB.open(Database.lawyerTable, 3)

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
        console.info(`IndexedDB success.`)
        setDB(request.result)
        setIsDBConnecting(false)
      }
    }

    if (!db) {
      initDB()
    }
  }, [databaseName, db, tableName, lawyers])

  const ls = () => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(Database.lawyerTable, 3)

      request.onsuccess = function () {
        const db = request.result
        const transaction = db.transaction('lawyers-table', 'readonly')
        const store = transaction.objectStore('lawyers-table')
        const getAllRequest = store.getAll()

        getAllRequest.onsuccess = function () {
          resolve(
            getAllRequest.result.sort((a: Lawyer, b: Lawyer) =>
              a.name.localeCompare(b.name),
            ),
          )
        }

        getAllRequest.onerror = function () {
          reject(getAllRequest.error)
        }
      }

      request.onerror = function () {
        reject(request.error)
      }
    })
  }

  return { isDBConnecting, db, ls }
}
