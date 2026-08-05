import '@vanilla-extract/css/disableRuntimeStyles'

global.BroadcastChannel = class BroadcastChannel {
  name: string
  constructor(name: string) {
    this.name = name
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  postMessage() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close() {}
  onmessage = null
  onmessageerror = null
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addEventListener() {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
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
