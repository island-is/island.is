import { Channel } from '@island.is/message-queue'

export interface Context {
  channel: Channel
  appExchangeId: string
}
