import * as ferdalagApplication from './ferdalagApplication'
import * as yayApplication from './yayApplication'
import { Message, RoutingKey } from '@island.is/message-queue'

interface Handler {
  queueName: string
  routingKeys: RoutingKey[]
  handler: (message: Message, routingKey: RoutingKey) => Promise<void>
}

const handlers: Handler[] = [ferdalagApplication, yayApplication]

export default handlers
