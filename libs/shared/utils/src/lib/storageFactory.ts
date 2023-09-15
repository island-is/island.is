/*
 * Based on an article from Michal Zalecki:
 * https://michalzalecki.com/why-using-localStorage-directly-is-a-bad-idea/
 *
 * Tweaked to have better runtime performance by only checking for support once
 * per wrapped storage.
 */

class InMemoryStorage implements Storage {
  storage: { [key: string]: string } = {}

  clear = (): void => {
    this.storage = {}
  }

  getItem = (name: string): string | null => {
    if (Object.prototype.hasOwnProperty.call(this.storage, name)) {
      return this.storage[name]
    }
    return null
  }

  key = (index: number): string | null => {
    return Object.keys(this.storage)[index] || null
  }

  removeItem = (name: string): void => {
    delete this.storage[name]
  }

  setItem = (name: string, value: string): void => {
    this.storage[name] = String(value) // not everyone uses TypeScript
  }

  get length(): number {
    return Object.keys(this.storage).length
  }
}

export function storageFactory(getStorage: () => Storage): Storage {
  try {
    // Test if the storage works.
    const storage = getStorage()
    const testKey = '__some_random_key_you_are_not_going_to_use__'
    storage.setItem(testKey, testKey)
    storage.removeItem(testKey)

    // Great! return it.
    return storage
  } catch (e) {
    // Oh no. Fall back to inMemoryStorage.
    return new InMemoryStorage()
  }
}
