import '@vanilla-extract/css/disableRuntimeStyles'

global.BroadcastChannel = class BroadcastChannel {
  name: string
  constructor(name: string) {
    this.name = name
  }
  postMessage() {}
  close() {}
  onmessage = null
  onmessageerror = null
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return false
  }
}

// Only import jest-dom for .tsx test files to avoid memory leaks in .ts files
if (expect.getState().testPath?.endsWith('.spec.tsx')) {
  import('@testing-library/jest-dom')
}

jest.setTimeout(60000)
