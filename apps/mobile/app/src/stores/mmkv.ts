import { MMKVInstance, MMKVLoader } from 'react-native-mmkv-storage'
import { StateStorage } from 'zustand/middleware'

const storages: MMKVInstance[] = []

export const createMMKVStorage = ({
  withEncryption = false,
}: { withEncryption?: boolean } = {}): MMKVInstance => {
  const storage = withEncryption
    ? new MMKVLoader()
        .withEncryption() // Generates a random key and stores it securely in Keychain
        .initialize()
    : new MMKVLoader().initialize()

  storages.push(storage)

  return storage
}

export const clearAllStorages = () => {
  storages.forEach((storage) => storage.clearStore())
}

export const createZustandMMKVStorage = (
  storage: MMKVInstance,
): StateStorage => ({
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.setItem(name, value) as Promise<void>,
})
