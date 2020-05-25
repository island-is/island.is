import PubSub from 'pubsub-js'

class RequestsService {
  requests: { [_: number]: boolean }
  counter: number

  constructor() {
    this.requests = {}
    this.counter = 0
  }

  _getCounter(): number {
    this.counter += 1
    return this.counter
  }

  start(): number {
    const key = this._getCounter()
    if (Object.keys(this.requests).length === 0) {
      PubSub.publish('requests', {
        loading: true,
      })
    }
    this.requests[key] = true
    return key
  }

  stop(key: number) {
    delete this.requests[key]

    if (Object.keys(this.requests).length === 0) {
      PubSub.publish('requests', {
        loading: false,
      })
    }
  }

  subscribe(cb: Function) {
    return PubSub.subscribe(
      'requests',
      (_: string, { loading }: { loading: boolean }) => cb({ loading }),
    )
  }

  unsubscribe(value: string) {
    PubSub.unsubscribe(value)
  }
}

const service = new RequestsService()

export default service
