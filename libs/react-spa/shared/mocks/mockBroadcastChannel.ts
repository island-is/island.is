export class MockBroadcastChannel {
  constructor() {
    this.onmessage = null
  }

  postMessage() {
    // No-op
  }

  close() {
    // No-op
  }

  addEventListener(type, listener) {
    if (type === 'message') {
      this.onmessage = listener
    }
  }

  removeEventListener() {
    // No-op
  }
}
