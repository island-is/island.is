import { ApplicationMessage } from '@island.is/message-queue'

export const routingKeys = ['approved', 'manual-approved']

export const handler = async (message: ApplicationMessage) => {
  console.log(
    'receiving message on gjafakort-ferdalag-application-approved',
    message,
  )
}
