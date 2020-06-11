import * as ferdalagCompanyApplication from './ferdalagCompanyApplication'
import * as yayCompanyApplication from './yayCompanyApplication'
import { Message, RoutingKey, Exchange } from '@island.is/message-queue'

interface Handler {
  exchangeName: Exchange
  queueName: string
  routingKeys: RoutingKey[]
  handler: (message: Message, routingKey: RoutingKey) => Promise<void>
}

const handlers: Handler[] = [ferdalagCompanyApplication, yayCompanyApplication]

export default handlers
