export class ProcessingError extends Error {
  constructor(
    queueName: string,
    routingKey: string,
    status: number,
    error: string,
  ) {
    super()
    this.name = 'ProcessingError'
    this.message = `Queue '${queueName}' with routing key '${routingKey}' got ${status} while processing message.\n${error}`
  }
}

export class RoutingKeyError extends Error {
  constructor(queueName: string, routingKey: string) {
    super()
    this.name = 'RoutingKeyError'
    this.message = `Unhandled routingkey ${routingKey} for queue ${queueName}`
  }
}
