// @ts-check

import { ENV_KEYS } from './_const.mjs'

class KeyStorage {
  _keys = {}
  /**
   * Represents a KeyStorage object.
   * @constructor
   * @param {string|undefined} value - The value to initialize the KeyStorage object with.
   */
  constructor(value = undefined) {
    if (!value || value === 'false') {
      return
    }
    try {
      this._keys = JSON.parse(value)
    } finally {
      return
    }
  }
  getKey(key) {
    return this._keys[key]
  }
  setKey(key, value) {
    this._keys[key] = value
  }
  count() {
    return Object.keys(this._keys).length
  }
  json() {
    return JSON.stringify(this._keys)
  }
  getKeys() {
    return this._keys
  }
  deleteKey(key) {
    delete this._keys[key]
  }
  hasKey(key) {
    return this._keys.hasOwnProperty(key)
  }
}

export const keyStorage = new KeyStorage(process.env[ENV_KEYS])
