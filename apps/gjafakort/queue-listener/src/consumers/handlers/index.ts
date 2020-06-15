import * as ferdalagCompanyApplication from './ferdalagCompanyApplication'
import * as yayCompanyApplication from './yayCompanyApplication'
import * as yayUserApplication from './yayUserApplication'
import { Message, RoutingKey, Exchange } from '@island.is/message-queue'

interface Handler {
  exchangeName: Exchange
  queueName: string
  routingKeys: RoutingKey[]
  handler: (message: Message, routingKey: RoutingKey) => Promise<void>
}

const handlers: Handler[] = [
  ferdalagCompanyApplication,
  yayCompanyApplication,
  yayUserApplication,
]

export default handlers
