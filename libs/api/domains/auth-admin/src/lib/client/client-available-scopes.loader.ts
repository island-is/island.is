import DataLoader from 'dataloader'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { GraphQLContext, NestDataLoader } from '@island.is/nest/dataloader'
import { User } from '@island.is/auth-nest-tools'
import { ClientsService } from './clients.service'
import { ClientAllowedScope } from './models/client-allowed-scope.model'
import { ClientAvailableScopeInput } from './dto/client-available-scope.input'

export type ClientAvailableScopesDataLoader = DataLoader<
  ClientAvailableScopeInput,
  ClientAllowedScope[],
  string
>

@Injectable()
export class ClientAvailableScopesLoader
  implements NestDataLoader<ClientAvailableScopeInput, ClientAllowedScope[]> {
  constructor(private readonly clientsService: ClientsService) {}

  async loadApiScopes(
    user: User | undefined,
    inputs: readonly ClientAvailableScopeInput[],
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
