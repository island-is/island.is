export class ProcessingError extends Error {
  constructor(queueName: string, url: string, status: number, error: string) {
    super()
    this.name = 'ProcessingError'
    this.message = `Queue ${queueName} got ${status} while requesting ${url}.\n${error}`
  }
}

export class RoutingKeyError extends Error {
  constructor(queueName: string, routingKey: string) {
    super()
    this.name = 'RoutingKeyError'
    this.message = `Unhandled routingkey ${routingKey} for queue ${queueName}`
  }
}
