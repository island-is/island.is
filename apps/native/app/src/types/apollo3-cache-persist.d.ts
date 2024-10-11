import { PersistentStorage } from 'apollo3-cache-persist/src/types'
import MMKVInstance from 'react-native-mmkv-storage'

declare module 'apollo3-cache-persist' {
  export class MMKVStorageWrapper implements PersistentStorage<string | null> {
    protected storage

    constructor(storage: MMKVInstance) {
      this.storage = storage
    }

    getItem(key: string): Promise<string | null> {
      return this.storage.getItem(key) || null
    }

    removeItem(key: string): Promise<void> {
      return new Promise((resolve, reject) => {
        // Ensure the removeItem is thenable, even if it's not, by wrapping it to Promise.resolve
        // The MMKV storage's removeItem is synchronous since 0.5.7, this Promise wrap allows backward compatibility
        // https://stackoverflow.com/a/27746324/2078771
        Promise.resolve(this.storage.removeItem(key))
          .then(() => resolve())
          .catch(() => reject())
      })
    }

    setItem(key: string, value: string | null): Promise<void> {
      return new Promise((resolve, reject) => {
        this.storage
          .setItem(key, value)
          .then(() => resolve())
          .catch(() => reject())
      })
    }
  }
}
