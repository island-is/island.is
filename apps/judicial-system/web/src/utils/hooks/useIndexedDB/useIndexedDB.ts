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
  const [db, setDB] = useState<IDBDatabase | null>(null)
  const [dbExists, setDBExists] = useState<boolean | null>(null)
  const [createdDate, setCreatedDate] = useState<Date | null>(null)
  const [isDBConnecting, setIsDBConnecting] = useState<boolean>(false)
  const lawyers = useGetLawyers(true)

  useEffect(() => {
    const syncData = async () => {
      try {
        const db = await openDB()
        const transaction = db.transaction(Database.lawyerTable, 'readonly')
        const store = transaction.objectStore(Database.lawyerTable)
        const request = store.getAll()

        request.onsuccess = async () => {
          const records: LawyerWithCreated[] = request.result
          const now = new Date()
          const shouldRefresh =
            records.length > 0
              ? differenceInMinutes(now, records[0].created) > 1
              : true

          if (shouldRefresh) {
            console.log('Refreshing IndexedDB data...')
            await clearAndFetchData()
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

    if (lawyers.length > 0) {
      syncData()
    }
  }, [lawyers])

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

  const clearAndFetchData = async () => {
    const db = await openDB()
    const transaction = db.transaction(Database.lawyerTable, 'readwrite')
    const store = transaction.objectStore(Database.lawyerTable)
    const now = new Date()

    store.clear()

    lawyers.map((lawyer) => {
      store.add({ ...lawyer, created: now })
    })
  }

  const getAllLawyers = (): Promise<Lawyer[]> => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(
        Database.lawyerTable,
        Database.version,
      )

      request.onsuccess = function () {
        const db = request.result
        console.log(db)
        const transaction = db.transaction(Database.lawyerTable, 'readonly')
        const store = transaction.objectStore(Database.lawyerTable)
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

  // const getCreatedDate = (): Promise<Date> => {
  //   return new Promise((resolve, reject) => {
  //     const request = window.indexedDB.open(
  //       Database.lawyerTable,
  //       Database.version,
  //     )

  //     request.onsuccess = function () {
  //       const db = request.result
  //       const transaction = db.transaction('misc-table', 'readonly')
  //       const store = transaction.objectStore('misc-table')
  //       const lastUpdated = store.get('last_updated')

  //       lastUpdated.onsuccess = function () {
  //         resolve(lastUpdated.result)
  //       }

  //       lastUpdated.onerror = function () {
  //         reject(lastUpdated.error)
  //       }
  //     }

  //     request.onerror = function () {
  //       reject(request.error)
  //     }
  //   })
  // }

  return { isDBConnecting, db, getAllLawyers }
}
