import { Injectable, UnauthorizedException } from '@nestjs/common'
import DataLoader from 'dataloader'

import { GraphQLContext, User } from '@island.is/auth-nest-tools'
import { NestDataLoader } from '@island.is/nest/dataloader'

import { ClientInput } from '../dto/client.input'
import { Client } from '../models/client.model'
import { ClientsService } from '../services/clients.service'

export type ClientDataLoader = DataLoader<ClientInput, Client>

@Injectable()
export class ClientLoader implements NestDataLoader<ClientInput, Client> {
  constructor(private readonly clientService: ClientsService) {}

  keyFn(input: ClientInput): string {
    return `${input.lang}##${input.clientId}`
  }

  async loadClients(
    user: User | undefined,
    inputs: readonly ClientInput[],
  ): Promise<Array<Client>> {
    if (!user) {
      throw new UnauthorizedException()
    }

    // Only support one language at a time.
    const lang = inputs[0].lang
    const clients = await this.clientService.getClients(user, {
      lang,
      clientIds: inputs.map((input) => input.clientId),
    })

    return inputs.map(
      (input) =>
        clients.find((client) => client.clientId === input.clientId) ?? {
          clientId: input.clientId,
        },
    )
  }

  generateDataLoader(ctx: GraphQLContext): ClientDataLoader {
    return new DataLoader(this.loadClients.bind(this, ctx.req.user), {
      cacheKeyFn: this.keyFn,
    })
  }
}
