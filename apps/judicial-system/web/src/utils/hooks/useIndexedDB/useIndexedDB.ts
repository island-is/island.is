import { useEffect, useState } from 'react'

export const Database = {
  name: 'lawyer-registry',
  lawyerTable: 'lawyers-table',
}

export const useIndexedDB = (databaseName: string, tableNames: string[]) => {
  const [db, setDB] = useState<IDBDatabase | null>(null)
  const [isDBConnecting, setIsDBConnecting] = useState<boolean>(false)

  useEffect(() => {
    const initDB = () => {
      const request = window.indexedDB.open(databaseName, 3)

      request.onupgradeneeded = () => {
        const db = request.result

        tableNames.forEach((tableName) => {
          if (!db.objectStoreNames.contains(tableName)) {
            db.createObjectStore(tableName, {
              autoIncrement: true,
              keyPath: 'id',
            })
          }
        })
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
  }, [databaseName, db, tableNames])

  return { isDBConnecting }
}
