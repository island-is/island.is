import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import DataLoader from 'dataloader'

import { GraphQLContext, User } from '@island.is/auth-nest-tools'
import { NestDataLoader } from '@island.is/nest/dataloader'

import { ClientInput } from '../dto/client.input'
import { Client } from '../models/client.model'
import { ClientsService } from '../services/clients.service'
import { DomainService } from '../services/domain.service'

export type ClientDataLoader = DataLoader<ClientInput, Client>

@Injectable()
export class ClientLoader implements NestDataLoader<ClientInput, Client> {
  constructor(
    private readonly clientService: ClientsService,
    private readonly domainsService: DomainService,
  ) {}

  keyFn(input: ClientInput): string {
    return `${input.lang}##${input.clientId}`
  }

  async loadClients(
    user: User | undefined,
    inputs: readonly ClientInput[],
  ): Promise<Array<Client | Error>> {
    if (!user) {
      throw new UnauthorizedException()
    }

    // Only support one language at a time.
    const lang = inputs[0].lang
    const authClients = await this.clientService.getClients(user, {
      lang,
      clientIds: inputs.map((input) => input.clientId),
    })
    const domains = await this.domainsService.getDomains(user, { lang })

    const clients: Client[] = authClients.map((client) => ({
      clientId: client.clientId,
      clientName: client.clientName,
      domain: domains.find((domain) => domain.name === client.domainName),
    }))

    return inputs.map(
      (input) =>
        clients.find((client) => client.clientId === input.clientId) ??
        new NotFoundException(`Could not find client: ${input.clientId}`),
    )
  }

  generateDataLoader(ctx: GraphQLContext): ClientDataLoader {
    return new DataLoader(this.loadClients.bind(this, ctx.req.user), {
      cacheKeyFn: this.keyFn,
    })
  }
}
