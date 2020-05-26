import { ApplicationMessage } from '@island.is/message-queue'

export const routingKeys = ['approved', 'manual-approved']

export const queueName = 'gjafakort-ferdalag-application-approved'

export const handler = async (message: ApplicationMessage) => {
  console.log(`receiving message on ${queueName}`, message)
}
