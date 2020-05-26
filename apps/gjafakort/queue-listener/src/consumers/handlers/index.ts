import * as ferdalagApplicationApproved from './ferdalagApplicationApproved'
import * as yayApplicationCreated from './yayApplicationCreated'
import * as yayApplicationRejected from './yayApplicationRejected'
import { Message } from '@island.is/message-queue'

interface Handler {
  queueName: string
  routingKeys: string[]
  handler: (message: Message) => Promise<void>
}

const handlers: Handler[] = [
  ferdalagApplicationApproved,
  yayApplicationCreated,
  yayApplicationRejected,
]

export default handlers
