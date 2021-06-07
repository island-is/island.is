import { Injectable } from '@nestjs/common'
import { freshdeskApi } from '@island.is/clients/freshdesk'
import { Ticket } from './graphql/ticket.model'

@Injectable()
export class FreshdeskService {
  constructor(private readonly freshdeskApi: freshdeskApi) {}

  async getTickets(): Promise<Ticket[]> {
    return await this.freshdeskApi.getTickets()
  }
}
