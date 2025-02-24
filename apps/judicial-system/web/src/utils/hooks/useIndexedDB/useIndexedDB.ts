import { useEffect, useState } from 'react'
import differenceInDays from 'date-fns/differenceInDays'

import { Lawyer } from '@island.is/judicial-system/types'

import { useGetLawyers } from '../useLawyers/useLawyers'

export const Database = {
  name: 'lawyer-registry',
  lawyerTable: 'lawyers-table3',
  version: 5,
}

export const useIndexedDB = (databaseName: string, tableName: string) => {
  const [db, setDB] = useState<IDBDatabase | null>(null)
  const [dbExists, setDBExists] = useState<boolean | null>(null)
  const [createdDate, setCreatedDate] = useState<Date | null>(null)
  const [isDBConnecting, setIsDBConnecting] = useState<boolean>(false)
  const lawyers = useGetLawyers(true)

  useEffect(() => {
    const initDB = async () => {
      console.info(`Init IndexedDB`)
      const request = window.indexedDB.open(
        Database.lawyerTable,
        Database.version,
      )

      request.onupgradeneeded = (event) => {
        const db = request.result

        if (!db.objectStoreNames.contains(tableName)) {
          const objectStore = db.createObjectStore(tableName, {
            autoIncrement: true,
            keyPath: 'nationalId',
          })

          objectStore.createIndex('name', 'name', { unique: false })
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

        const transaction = request.result.transaction(tableName, 'readwrite')
        const lawyerStore = transaction.objectStore(tableName)
        const today = new Date()

        lawyers.forEach((lawyer) => {
          lawyerStore.add({ ...lawyer, created: today })
        })

        transaction.oncomplete = () =>
          console.info('Lawyers added successfully.')
        transaction.onerror = (e) => console.error('Error adding lawyers')
      }
    }

    const checkDBExists = async () => {
      if (indexedDB.databases) {
        const databases = await indexedDB.databases()
        console.log(databases)
        const exists = databases.some((db) => db.name === Database.lawyerTable)
        setDBExists(exists)
      }
    }
    // const cDate = async () => {
    //   const a = await getCreatedDate()
    //   console.log(a)
    //   setCreatedDate(a)
    // }

    // checkDBExists()

    // if (dbExists) {
    //   // cDate()

    //   if (createdDate && differenceInDays(new Date(), createdDate) > 1) {
    //     console.log(createdDate)
    //   }
    // }

    if (!db && lawyers.length > 0) {
      initDB()
    }
  }, [databaseName, db, tableName, lawyers, dbExists, createdDate])

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
