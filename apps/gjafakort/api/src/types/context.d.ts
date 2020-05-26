import { Channel } from '@island.is/message-queue'

export type User = {
  ssn: string
}

export interface GraphQLContext {
  // TODO: not optional
  channel?: Channel
  appExchangeId: string
  user?: User
}

export type Credentials = {
  user: User
  csrfToken: string
}
