class TempStorage {
  storage = new Map<string, any>()
  ttlTimers = new Map<string, NodeJS.Timeout>()

  set(key: string, value: any, ttlSeconds?: number) {
    this.storage.set(key, value)

    if (ttlSeconds) {
      if (this.ttlTimers.has(key)) {
        clearTimeout(this.ttlTimers.get(key)!)
      }

      this.ttlTimers.set(
        key,
        setTimeout(() => {
          this.storage.delete(key)
          this.ttlTimers.delete(key)
        }, ttlSeconds * 1000),
      )
    }
  }

  get(key: string) {
    return this.storage.get(key)
  }

  delete(key: string) {
    this.storage.delete(key)

    if (this.ttlTimers.has(key)) {
      clearTimeout(this.ttlTimers.get(key)!)
      this.ttlTimers.delete(key)
    }
  }

  getAndDelete(key: string) {
    const value = this.storage.get(key)
    this.storage.delete(key)
    return value
  }

  clear() {
    this.storage.clear()
    this.ttlTimers.forEach((timer) => clearTimeout(timer))
    this.ttlTimers.clear()
  }
}

let instance: null | TempStorage = null

export const getTempStorage = () => {
  if (instance) {
    return instance
  }

  instance = new TempStorage()

  return instance
}
