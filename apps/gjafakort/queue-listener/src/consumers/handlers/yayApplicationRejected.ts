import { ApplicationMessage } from '@island.is/message-queue'

export const routingKeys = ['rejected']

export const queueName = 'gjafakort-yay-application-rejected'

export const handler = async (message: ApplicationMessage) => {
  console.log(`receiving message on ${queueName}`, message)
}
