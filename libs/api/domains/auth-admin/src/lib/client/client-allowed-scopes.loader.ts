import DataLoader from 'dataloader'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { NestDataLoader, GraphQLContext } from '@island.is/nest/dataloader'
import { User } from '@island.is/auth-nest-tools'

import { ClientsService } from './clients.service'
import { ClientAllowedScopeInput } from './dto/client-allowed-scope.input'
import { ClientAllowedScope } from './models/client-allowed-scope.model'

export type ClientAllowedScopesDataLoader = DataLoader<
  ClientAllowedScopeInput,
  ClientAllowedScope[],
  string
>

@Injectable()
export class ClientAllowedScopesLoader
  implements NestDataLoader<ClientAllowedScopeInput, ClientAllowedScope[]>
{
  constructor(private readonly clientsService: ClientsService) {}

  keyFn(input: ClientAllowedScopeInput): string {
    return `${input.environment}##${input.clientId}##${input.tenantId}`
  }

  async loadApiScopes(
    user: User | undefined,
    inputs: readonly ClientAllowedScopeInput[],
  ): Promise<ClientAllowedScope[][]> {
    if (!user) {
      throw new UnauthorizedException()
    }

    return Promise.all(
      inputs.map((input) => this.clientsService.getAllowedScopes(user, input)),
    )
  }

  generateDataLoader(ctx: GraphQLContext): ClientAllowedScopesDataLoader {
    return new DataLoader(this.loadApiScopes.bind(this, ctx.req.user), {
      cacheKeyFn: this.keyFn,
    })
  }
}
