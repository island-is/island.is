import { MMKVInstance, MMKVLoader } from 'react-native-mmkv-storage'

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
