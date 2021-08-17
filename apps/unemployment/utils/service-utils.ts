import { isFunction } from 'lodash'

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function mockAsync<T>(retVal: T | (() => T)) {
  return sleep(200).then(() => (isFunction(retVal) ? retVal() : retVal))
}
