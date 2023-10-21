import { Injectable, UnauthorizedException } from '@nestjs/common'
import DataLoader from 'dataloader'

import { GraphQLContext, User } from '@island.is/auth-nest-tools'
import { NestDataLoader } from '@island.is/nest/dataloader'

import { ClientsService } from './clients.service'
import { ClientSecretInput } from './dto/client-secret.input'
import { ClientSecret } from './models/client-secret.model'

export type ClientSecretDataLoader = DataLoader<
  ClientSecretInput,
  ClientSecret[],
  string
>

@Injectable()
export class ClientSecretLoader
  implements NestDataLoader<ClientSecretInput, ClientSecret[]>
{
  constructor(private readonly clientsService: ClientsService) {}

  keyFn(input: ClientSecretInput): string {
    return `${input.tenantId}##${input.clientId}##${input.environment}`
  }

  async loadClientSecret(
    user: User | undefined,
    inputs: readonly ClientSecretInput[],
  ): Promise<ClientSecret[][]> {
    if (!user) {
      throw new UnauthorizedException()
    }

    return Promise.all(
      inputs.map((input) => this.clientsService.getClientSecrets(user, input)),
    )
  }

  generateDataLoader(ctx: GraphQLContext): ClientSecretDataLoader {
    return new DataLoader(this.loadClientSecret.bind(this, ctx.req.user), {
      cacheKeyFn: this.keyFn,
    })
  }
}
