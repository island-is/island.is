import { Resolver, Query } from '@nestjs/graphql'
import { FreshdeskService } from './freshdesk.service'
import { Ticket } from './graphql/ticket.model'

@Resolver()
export class FreshdeskResolver {
  constructor(private readonly freshdeskService: FreshdeskService) {}

  @Query(() => [Ticket])
  async getTickets(): Promise<Ticket[]> {
    return await this.freshdeskService.getTickets()
  }
}
