import DataLoader from 'dataloader'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { GraphQLContext, NestDataLoader } from '@island.is/nest/dataloader'
import { User } from '@island.is/auth-nest-tools'
import { ClientsService } from './clients.service'
import { ClientAllowedScopeInput } from './dto/client-allowed-scope.input'
import { ClientAllowedScope } from './models/client-allowed-scope.model'

export type ClientAvailableScopesDataLoader = DataLoader<
  ClientAllowedScopeInput,
  ClientAllowedScope[],
  string
>

@Injectable()
export class ClientAvailableScopesLoader
  implements NestDataLoader<{ tenantId: string }, ClientAllowedScope[]> {
  constructor(private readonly clientsService: ClientsService) {}

  async loadApiScopes(
    user: User | undefined,
    inputs: readonly ClientAllowedScopeInput[],
  ): Promise<ClientAllowedScope[][]> {
    if (!user) {
      throw new UnauthorizedException()
    }

    return Promise.all(
      inputs.map((input) =>
        this.clientsService.getScopesByTenantId(input, user),
      ),
    )
  }

  generateDataLoader(ctx: GraphQLContext): ClientAvailableScopesDataLoader {
    return new DataLoader(this.loadApiScopes.bind(this, ctx.req.user))
  }
}
