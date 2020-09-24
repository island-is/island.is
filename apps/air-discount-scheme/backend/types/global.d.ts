type ValueOf<T> = T[keyof T]

interface CacheManager {
  name: 'redis'
  isCacheableValue(value: any): boolean
  get(...args: any[]): Promise<any>
  set(...args: any[]): Promise<any>
  del(...args: any[]): Promise<any>
  reset(...args: any[]): Promise<any>
  keys(...args: any[]): Promise<any>
  ttl(...args: any[]): Promise<any>
}

declare module 'kennitala' {
  interface Info {
    kt: string
    valid: boolean
    type: 'person' | 'company'
    birthday: date
    birthdayReadable: string
    age: number
  }
  function info(kt: string): Info
}
