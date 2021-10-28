/*
 * Based on an article from Michal Zalecki:
 * https://michalzalecki.com/why-using-localStorage-directly-is-a-bad-idea/
 *
 * Tweaked to have better runtime performance by only checking for support once
 * per wrapped storage.
 */

export function storageFactory(getStorage: () => Storage): Storage {
  let inMemoryStorage: { [key: string]: string } = {}
  let storage: Storage | null = initStorage()

  function initStorage(): Storage | null {
    try {
      const testStorage = getStorage()
      const testKey = '__some_random_key_you_are_not_going_to_use__'
      testStorage.setItem(testKey, testKey)
      testStorage.removeItem(testKey)
      return testStorage
    } catch (e) {
      // Ignored, falling back to inMemoryStorage.
      return null
    }
  }

  function clear(): void {
    if (storage) {
      storage.clear()
    } else {
      inMemoryStorage = {}
    }
  }

  function getItem(name: string): string | null {
    if (storage) {
      return storage.getItem(name)
    }
    if (inMemoryStorage.hasOwnProperty(name)) {
      return inMemoryStorage[name]
    }
    return null
  }

  function key(index: number): string | null {
    if (storage) {
      return storage.key(index)
    } else {
      return Object.keys(inMemoryStorage)[index] || null
    }
  }

  function removeItem(name: string): void {
    if (storage) {
      storage.removeItem(name)
    } else {
      delete inMemoryStorage[name]
    }
  }

  function setItem(name: string, value: string): void {
    if (storage) {
      storage.setItem(name, value)
    } else {
      inMemoryStorage[name] = String(value) // not everyone uses TypeScript
    }
  }

  function length(): number {
    if (storage) {
      return storage.length
    } else {
      return Object.keys(inMemoryStorage).length
    }
  }

  return {
    getItem,
    setItem,
    removeItem,
    clear,
    key,
    get length() {
      return length()
    },
  }
}
