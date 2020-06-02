import { Channel } from '@island.is/message-queue'

import { FerdalagAPI, ApplicationAPI, RskAPI } from '../services'

export type User = {
  ssn: string
}

export type MessageQueue = {
  channel: Channel
  companyApplicationExchangeId: string
}

export interface GraphQLContext {
  messageQueue: MessageQueue
  user?: User
}

export type Credentials = {
  user: User
  csrfToken: string
}

export type DataSource = {
  applicationApi: ApplicationAPI
  ferdalagApi: FerdalagAPI
  rskApi: RskAPI
}
