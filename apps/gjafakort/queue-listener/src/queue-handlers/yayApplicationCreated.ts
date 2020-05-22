import { ApplicationMessage } from '@island.is/message-queue'

export const routingKeys = ['approved', 'pending']

export const handler = async (message: ApplicationMessage) => {
  console.log('receiving message on gjafakort-yay-application-created', message)
}
