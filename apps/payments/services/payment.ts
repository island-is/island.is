class TempRedisStorage {
  private storage = new Map<string, any>()

  set(key: string, value: any, ttlSeconds = null) {
    this.storage.set(key, value)
    if (ttlSeconds !== null) {
      setTimeout(() => {
        this.storage.delete(key)
      }, ttlSeconds * 1000)
    }
  }

  get(key: string) {
    return this.storage.get(key)
  }

  delete(key: string) {
    this.storage.delete(key)
  }

  getAndForget(key: string) {
    const value = this.get(key)
    this.delete(key)
    return value
  }

  clear() {
    this.storage.clear()
  }

  has(key: string) {
    return this.storage.has(key)
  }
}

let redisStorage = null

export const getTempRedisStorage = () => {
  if (redisStorage === null) {
    redisStorage = new TempRedisStorage()
  }
  return redisStorage
}
