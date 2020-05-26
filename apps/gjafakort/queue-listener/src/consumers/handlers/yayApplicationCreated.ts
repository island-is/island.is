import { ApplicationMessage } from '@island.is/message-queue'

export const routingKeys = ['approved', 'pending']

export const queueName = 'gjafakort-yay-application-created'

export const handler = async (message: ApplicationMessage) => {
  console.log(`receiving message on ${queueName}`, message)
}
