import * as ferdalagCompanyApplication from './ferdalagCompanyApplication'
import * as yayCompanyApplication from './yayCompanyApplication'
import {
  GjafakortApplicationMessage,
  GjafakortApplicationRoutingKey,
  GjafakortApplicationExchange,
} from '@island.is/message-queue'

interface Handler {
  exchangeName: GjafakortApplicationExchange
  queueName: string
  routingKeys: GjafakortApplicationRoutingKey[]
  handler: (
    message: GjafakortApplicationMessage,
    routingKey: GjafakortApplicationRoutingKey,
  ) => Promise<void>
}

const handlers: Handler[] = [ferdalagCompanyApplication, yayCompanyApplication]

export default handlers
